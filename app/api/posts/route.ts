import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { VALID_TYPES } from '@/lib/db';
import { getSupabase, PHOTOS_BUCKET } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';

export const runtime = 'nodejs';

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']);

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const author = (await getName()) || 'anonyme';
  const form = await req.formData();
  const type = String(form.get('type') || '').trim();
  const title = String(form.get('title') || '').trim().slice(0, 200);
  const body = String(form.get('body') || '').trim().slice(0, 5000);
  const externalId = (String(form.get('external_id') || '').trim() || null);
  const coverUrl = (String(form.get('cover_url') || '').trim() || null);
  const yearRaw = String(form.get('year') || '').trim();
  const year = yearRaw && /^\d{1,4}$/.test(yearRaw) ? parseInt(yearRaw, 10) : null;

  if (!VALID_TYPES.has(type) || !title || !body) {
    return NextResponse.json({ error: 'Type, titre et message sont requis.' }, { status: 400 });
  }

  const supabase = getSupabase();
  const id = crypto.randomUUID();

  // Upload photos to Supabase Storage
  const files = form.getAll('photo').filter((f): f is File => f instanceof File && f.size > 0).slice(0, MAX_PHOTOS);
  const photoUrls: string[] = [];
  for (const file of files) {
    if (file.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: `Photo trop volumineuse (max ${MAX_PHOTO_BYTES / 1024 / 1024} Mo).` }, { status: 400 });
    }
    if (file.type && !ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: `Format non supporté (${file.type}).` }, { status: 400 });
    }
    const ext = (file.name.match(/\.([a-zA-Z0-9]{1,5})$/)?.[1] || mimeToExt(file.type) || 'jpg').toLowerCase();
    const objectPath = `${id}/${crypto.randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(PHOTOS_BUCKET)
      .upload(objectPath, buf, { contentType: file.type || 'image/jpeg', upsert: false });
    if (upErr) {
      console.error('storage upload error', upErr);
      return NextResponse.json({ error: "Échec de l'upload d'une photo." }, { status: 500 });
    }
    const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(objectPath);
    photoUrls.push(data.publicUrl);
  }

  const { error } = await supabase.from('posts').insert({
    id,
    author,
    type,
    title,
    body,
    external_id: externalId,
    cover_url: coverUrl,
    year,
    photos: photoUrls,
  });
  if (error) {
    console.error('insert post error', error);
    return NextResponse.json({ error: "Impossible d'enregistrer la publication." }, { status: 500 });
  }

  return NextResponse.json({ id });
}

function mimeToExt(mime: string): string | null {
  if (!mime) return null;
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  if (mime === 'image/heic') return 'heic';
  return null;
}
