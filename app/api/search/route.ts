import { NextRequest, NextResponse } from 'next/server';
import { isAuthed } from '@/lib/session';

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

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max).trimEnd() + '…';
}
