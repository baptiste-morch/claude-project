// Twitch OAuth + IGDB token cache. Tokens last ~60 days; we refresh proactively.

type CachedToken = { value: string; expiresAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __igdbToken: CachedToken | undefined;
}

export async function getIgdbToken(): Promise<string | null> {
  const id = process.env.TWITCH_CLIENT_ID;
  const secret = process.env.TWITCH_CLIENT_SECRET;
  if (!id || !secret) return null;

  const cached = global.__igdbToken;
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const url = new URL('https://id.twitch.tv/oauth2/token');
  url.searchParams.set('client_id', id);
  url.searchParams.set('client_secret', secret);
  url.searchParams.set('grant_type', 'client_credentials');

  const res = await fetch(url, { method: 'POST', cache: 'no-store' });
  if (!res.ok) {
    console.error('twitch token fetch failed', res.status);
    return null;
  }
  const data = await res.json();
  if (!data.access_token) return null;
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  global.__igdbToken = { value: data.access_token, expiresAt };
  return data.access_token;
}
