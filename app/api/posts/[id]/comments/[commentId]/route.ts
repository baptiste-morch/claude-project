import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const me = (await getName()) || '';
  const { commentId } = await params;
  const supabase = getSupabase();

  const { data: comment } = await supabase
    .from('comments')
    .select('author')
    .eq('id', commentId)
    .maybeSingle<{ author: string }>();
  if (!comment) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (comment.author !== me) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const text = String(body.body || '').trim().slice(0, 3000);
  if (!text) return NextResponse.json({ error: 'empty_body' }, { status: 400 });

  const { error } = await supabase
    .from('comments')
    .update({ body: text })
    .eq('id', commentId);
  if (error) {
    console.error('update comment error', error);
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const me = (await getName()) || '';
  const { commentId } = await params;
  const supabase = getSupabase();

  const { data: comment } = await supabase
    .from('comments')
    .select('author')
    .eq('id', commentId)
    .maybeSingle<{ author: string }>();
  if (!comment) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (comment.author !== me) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { error } = await supabase.from('comments').delete().eq('id', commentId);
  if (error) {
    console.error('delete comment error', error);
    return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
