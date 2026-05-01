import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import db, { POST_TYPES } from '@/lib/db';
import { isAuthed, getName } from '@/lib/session';

const VALID_TYPES = new Set<string>(POST_TYPES.map((t) => t.value));

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin), 303);
  }
  const author = (await getName()) || 'anonyme';
  const form = await req.formData();
  const type = String(form.get('type') || '').trim();
  const title = String(form.get('title') || '').trim().slice(0, 200);
  const body = String(form.get('body') || '').trim().slice(0, 5000);

  if (!VALID_TYPES.has(type) || !title || !body) {
    return NextResponse.redirect(new URL('/new?error=missing', req.nextUrl.origin), 303);
  }

  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO posts (id, author, type, title, body, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, author, type, title, body, Date.now());

  return NextResponse.redirect(new URL(`/p/${id}`, req.nextUrl.origin), 303);
}
