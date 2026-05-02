// Spotify OAuth client_credentials token cache. Tokens last ~1h.

type CachedToken = { value: string; expiresAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __spotifyToken: CachedToken | undefined;
}

export async function getSpotifyToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  const cached = global.__spotifyToken;
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('spotify token fetch failed', res.status);
    return null;
  }
  const data = await res.json();
  if (!data.access_token) return null;
  const expiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
  global.__spotifyToken = { value: data.access_token, expiresAt };
  return data.access_token;
}
