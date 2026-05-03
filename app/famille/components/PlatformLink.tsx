type Platform = { emoji: string; label: string; verb: string };

const PLATFORMS: Array<{ pattern: RegExp; meta: Platform }> = [
  { pattern: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/, meta: { emoji: '▶️', label: 'YouTube', verb: 'Voir sur' } },
  { pattern: /(^|\.)vimeo\.com$/, meta: { emoji: '▶️', label: 'Vimeo', verb: 'Voir sur' } },
  { pattern: /(^|\.)open\.spotify\.com$|(^|\.)spotify\.com$/, meta: { emoji: '🎧', label: 'Spotify', verb: 'Écouter sur' } },
  { pattern: /(^|\.)podcasts\.apple\.com$/, meta: { emoji: '🎧', label: 'Apple Podcasts', verb: 'Écouter sur' } },
  { pattern: /(^|\.)music\.apple\.com$/, meta: { emoji: '🎵', label: 'Apple Music', verb: 'Écouter sur' } },
  { pattern: /(^|\.)tv\.apple\.com$/, meta: { emoji: '🎬', label: 'Apple TV', verb: 'Voir sur' } },
  { pattern: /(^|\.)netflix\.com$/, meta: { emoji: '🎬', label: 'Netflix', verb: 'Voir sur' } },
  { pattern: /(^|\.)disneyplus\.com$|(^|\.)disney\.com$/, meta: { emoji: '🎬', label: 'Disney+', verb: 'Voir sur' } },
  { pattern: /(^|\.)primevideo\.com$|(^|\.)amazon\.[a-z.]+$/, meta: { emoji: '🎬', label: 'Prime Video', verb: 'Voir sur' } },
  { pattern: /(^|\.)max\.com$|(^|\.)hbomax\.com$/, meta: { emoji: '🎬', label: 'Max', verb: 'Voir sur' } },
  { pattern: /(^|\.)paramountplus\.com$/, meta: { emoji: '🎬', label: 'Paramount+', verb: 'Voir sur' } },
  { pattern: /(^|\.)crunchyroll\.com$/, meta: { emoji: '🎬', label: 'Crunchyroll', verb: 'Voir sur' } },
  { pattern: /(^|\.)crave\.ca$/, meta: { emoji: '🎬', label: 'Crave', verb: 'Voir sur' } },
  { pattern: /(^|\.)tou\.tv$|(^|\.)ici\.tou\.tv$/, meta: { emoji: '🎬', label: 'Tou.tv', verb: 'Voir sur' } },
  { pattern: /(^|\.)books\.google\.[a-z.]+$/, meta: { emoji: '📚', label: 'Google Books', verb: 'Voir sur' } },
  { pattern: /(^|\.)goodreads\.com$/, meta: { emoji: '📚', label: 'Goodreads', verb: 'Voir sur' } },
  { pattern: /(^|\.)babelio\.com$/, meta: { emoji: '📚', label: 'Babelio', verb: 'Voir sur' } },
  { pattern: /(^|\.)twitch\.tv$/, meta: { emoji: '🎮', label: 'Twitch', verb: 'Voir sur' } },
  { pattern: /(^|\.)store\.steampowered\.com$|(^|\.)steamcommunity\.com$/, meta: { emoji: '🎮', label: 'Steam', verb: 'Voir sur' } },
  { pattern: /(^|\.)epicgames\.com$/, meta: { emoji: '🎮', label: 'Epic Games', verb: 'Voir sur' } },
];

function detect(url: string): { meta: Platform; host: string } | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const p of PLATFORMS) {
    if (p.pattern.test(host)) return { meta: p.meta, host };
  }
  return { meta: { emoji: '🔗', label: host.replace(/^www\./, ''), verb: 'Ouvrir' }, host };
}

export default function PlatformLink({ url }: { url: string }) {
  const detected = detect(url);
  if (!detected) return null;
  const { meta } = detected;
  return (
    <a className="platform-link" href={url} target="_blank" rel="noreferrer noopener">
      <span className="platform-emoji">{meta.emoji}</span>
      <span>{meta.verb} <strong>{meta.label}</strong></span>
    </a>
  );
}
