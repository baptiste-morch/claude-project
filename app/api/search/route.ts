import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';
import { getIgdbToken } from '@/lib/igdb';
import { getSpotifyToken } from '@/lib/spotify';

export const runtime = 'nodejs';

export type SearchResult = {
  external_id: string;
  title: string;
  year: number | null;
  cover_url: string | null;
  subtitle: string | null;
};

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get('q') || '').trim();
  const type = req.nextUrl.searchParams.get('type') || '';
  if (q.length < 2) return NextResponse.json({ results: [] });

  try {
    if (type === 'film') return NextResponse.json({ results: await searchTmdb(q, 'movie') });
    if (type === 'serie') return NextResponse.json({ results: await searchTmdb(q, 'tv') });
    if (type === 'livre') return NextResponse.json({ results: await searchBooks(q) });
    if (type === 'jeu') return NextResponse.json({ results: await searchIgdb(q) });
    if (type === 'podcast') return NextResponse.json({ results: await searchPodcast(q) });
    if (type === 'video') return NextResponse.json({ results: await resolveVideoUrl(q) });
    return NextResponse.json({ results: [] });
  } catch (e) {
    console.error('search error', e);
    return NextResponse.json({ results: [], error: 'search_failed' }, { status: 502 });
  }
}

async function searchTmdb(q: string, kind: 'movie' | 'tv'): Promise<SearchResult[]> {
  const key = process.env.TMDB_API_KEY;
  if (!key) return [];
  const url = new URL(`https://api.themoviedb.org/3/search/${kind}`);
  url.searchParams.set('api_key', key);
  url.searchParams.set('language', 'fr-FR');
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('query', q);
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).slice(0, 8).map((r: any) => {
    const title = kind === 'movie' ? r.title : r.name;
    const date = (kind === 'movie' ? r.release_date : r.first_air_date) || '';
    const year = date ? parseInt(date.slice(0, 4), 10) || null : null;
    return {
      external_id: `tmdb:${kind}:${r.id}`,
      title,
      year,
      cover_url: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : null,
      subtitle: r.overview ? truncate(r.overview, 140) : null,
    };
  });
}

async function searchBooks(q: string): Promise<SearchResult[]> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', q);
  url.searchParams.set('maxResults', '8');
  url.searchParams.set('langRestrict', 'fr');
  if (process.env.GOOGLE_BOOKS_API_KEY) {
    url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
  }
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.items || []).map((it: any): SearchResult => {
    const v = it.volumeInfo || {};
    const date = v.publishedDate || '';
    const year = date ? parseInt(date.slice(0, 4), 10) || null : null;
    const cover = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail || null;
    return {
      external_id: `gbooks:${it.id}`,
      title: v.title || '(sans titre)',
      year,
      cover_url: cover ? cover.replace('http://', 'https://') : null,
      subtitle: (v.authors || []).join(', ') || null,
    };
  });
}

async function searchIgdb(q: string): Promise<SearchResult[]> {
  const id = process.env.TWITCH_CLIENT_ID;
  const token = await getIgdbToken();
  if (!id || !token) return [];

  const body = `search "${q.replace(/"/g, '\\"')}";\nfields name, cover.image_id, first_release_date, summary;\nlimit 8;`;
  const res = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': id,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((g: any): SearchResult => ({
    external_id: `igdb:${g.id}`,
    title: g.name,
    year: g.first_release_date
      ? new Date(g.first_release_date * 1000).getUTCFullYear()
      : null,
    cover_url: g.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${g.cover.image_id}.jpg`
      : null,
    subtitle: g.summary ? truncate(g.summary, 140) : null,
  }));
}

async function searchPodcast(q: string): Promise<SearchResult[]> {
  // Run Apple Podcasts (iTunes Search, no key) for shows + episodes,
  // and Spotify in parallel if credentials are configured.
  const [appleShows, appleEpisodes, spotify] = await Promise.all([
    searchItunes(q, 'podcast'),
    searchItunes(q, 'podcastEpisode'),
    searchSpotifyPodcast(q),
  ]);

  // Merge: prefer Apple shows first (most relevant for general podcast search),
  // then episodes, then Spotify extras. Dedupe loosely by title.
  const seen = new Set<string>();
  const merged: SearchResult[] = [];
  for (const list of [appleShows, appleEpisodes, spotify]) {
    for (const r of list) {
      const dedupeKey = r.title.toLowerCase();
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      merged.push(r);
      if (merged.length >= 8) break;
    }
    if (merged.length >= 8) break;
  }
  return merged;
}

async function searchItunes(q: string, entity: 'podcast' | 'podcastEpisode'): Promise<SearchResult[]> {
  const url = new URL('https://itunes.apple.com/search');
  url.searchParams.set('term', q);
  url.searchParams.set('media', 'podcast');
  url.searchParams.set('entity', entity);
  url.searchParams.set('limit', '6');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((r: any): SearchResult => {
    const isEpisode = entity === 'podcastEpisode';
    const title = isEpisode ? r.trackName : r.collectionName;
    const showName = isEpisode ? r.collectionName : r.artistName;
    const date = r.releaseDate || '';
    const year = date ? parseInt(date.slice(0, 4), 10) || null : null;
    const cover = r.artworkUrl600 || r.artworkUrl100 || null;
    const externalId = isEpisode
      ? `apple-ep:${r.trackId}`
      : `apple:${r.collectionId}`;
    return {
      external_id: externalId,
      title: title || '(sans titre)',
      year,
      cover_url: cover,
      subtitle: isEpisode && showName ? `Épisode · ${showName}` : showName || null,
    };
  });
}

async function searchSpotifyPodcast(q: string): Promise<SearchResult[]> {
  const token = await getSpotifyToken();
  if (!token) return [];
  const url = new URL('https://api.spotify.com/v1/search');
  url.searchParams.set('q', q);
  url.searchParams.set('type', 'show,episode');
  url.searchParams.set('limit', '4');
  url.searchParams.set('market', 'FR');
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  const results: SearchResult[] = [];
  for (const s of data.shows?.items || []) {
    if (!s) continue;
    results.push({
      external_id: `spotify-show:${s.id}`,
      title: s.name,
      year: null,
      cover_url: s.images?.[0]?.url || null,
      subtitle: s.publisher || null,
    });
  }
  for (const e of data.episodes?.items || []) {
    if (!e) continue;
    const date = e.release_date || '';
    results.push({
      external_id: `spotify-ep:${e.id}`,
      title: e.name,
      year: date ? parseInt(date.slice(0, 4), 10) || null : null,
      cover_url: e.images?.[0]?.url || null,
      subtitle: 'Épisode (Spotify)',
    });
  }
  return results;
}

async function resolveVideoUrl(q: string): Promise<SearchResult[]> {
  const trimmed = q.trim();
  if (!/^https?:\/\//i.test(trimmed)) return [];

  let oembedUrl: string | null = null;
  if (/youtube\.com\/watch|youtu\.be\//i.test(trimmed)) {
    oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(trimmed)}&format=json`;
  } else if (/vimeo\.com\//i.test(trimmed)) {
    oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(trimmed)}`;
  }
  if (!oembedUrl) return [];

  const res = await fetch(oembedUrl, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return [
    {
      external_id: `oembed:${trimmed}`,
      title: data.title || trimmed,
      year: null,
      cover_url: data.thumbnail_url || null,
      subtitle: data.author_name ? `par ${data.author_name}` : null,
    },
  ];
}

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max).trimEnd() + '…';
}
