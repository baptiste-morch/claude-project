import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.redirect(new URL('/famille/login', req.nextUrl.origin), 303);
  }
  const { id } = await params;
  const supabase = getSupabase();

  const { data: post } = await supabase
    .from('posts')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (!post) {
    return NextResponse.redirect(new URL('/famille', req.nextUrl.origin), 303);
  }

  const author = (await getName()) || 'anonyme';
  const form = await req.formData();
  const body = String(form.get('body') || '').trim().slice(0, 3000);

  if (!body) {
    return NextResponse.redirect(new URL(`/famille/p/${id}?error=missing`, req.nextUrl.origin), 303);
  }

  const { error } = await supabase
    .from('comments')
    .insert({ post_id: id, author, body });
  if (error) {
    console.error('insert comment error', error);
    return NextResponse.redirect(new URL(`/famille/p/${id}?error=missing`, req.nextUrl.origin), 303);
  }

  return NextResponse.redirect(new URL(`/famille/p/${id}`, req.nextUrl.origin), 303);
}
