import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';

export const runtime = 'nodejs';

function isValidHttpUrl(s: string): boolean {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const me = (await getName()) || '';
  const { id } = await params;
  const supabase = getSupabase();

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', id)
    .maybeSingle<{ author: string }>();
  if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (post.author !== me) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};
  if (typeof body.title === 'string') {
    const t = body.title.trim().slice(0, 200);
    if (!t) return NextResponse.json({ error: 'empty_title' }, { status: 400 });
    updates.title = t;
  }
  if (typeof body.body === 'string') {
    const b = body.body.trim().slice(0, 5000);
    if (!b) return NextResponse.json({ error: 'empty_body' }, { status: 400 });
    updates.body = b;
  }
  if ('direct_url' in body) {
    const raw = String(body.direct_url || '').trim();
    if (raw === '') updates.direct_url = null;
    else if (!isValidHttpUrl(raw)) return NextResponse.json({ error: 'bad_url' }, { status: 400 });
    else updates.direct_url = raw.slice(0, 2000);
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }

  const { error } = await supabase.from('posts').update(updates).eq('id', id);
  if (error) {
    console.error('update post error', error);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const me = (await getName()) || '';
  const { id } = await params;
  const supabase = getSupabase();

  const { data: post } = await supabase
    .from('posts')
    .select('author')
    .eq('id', id)
    .maybeSingle<{ author: string }>();
  if (!post) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (post.author !== me) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    console.error('delete post error', error);
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
