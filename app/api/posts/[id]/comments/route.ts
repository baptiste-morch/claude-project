import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db, { Post } from '@/lib/db';
import { isAuthed, getName } from '@/lib/session';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin), 303);
  }
  const { id } = await params;
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(id) as Pick<Post, 'id'> | undefined;
  if (!post) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin), 303);
  }

  const author = (await getName()) || 'anonyme';
  const form = await req.formData();
  const body = String(form.get('body') || '').trim().slice(0, 3000);

  if (!body) {
    return NextResponse.redirect(new URL(`/p/${id}?error=missing`, req.nextUrl.origin), 303);
  }

  db.prepare(
    'INSERT INTO comments (id, post_id, author, body, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(crypto.randomUUID(), id, author, body, Date.now());

  return NextResponse.redirect(new URL(`/p/${id}`, req.nextUrl.origin), 303);
}
