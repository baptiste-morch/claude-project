import { NextRequest, NextResponse } from 'next/server';
import { setSession, checkPassword } from '@/lib/session';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get('name') || '').trim().slice(0, 40);
  const password = String(form.get('password') || '');
  const next = String(form.get('next') || '/famille');

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/famille';
  const origin = req.nextUrl.origin;

  if (!name || !password) {
    return NextResponse.redirect(new URL(`/famille/login?error=missing&next=${encodeURIComponent(safeNext)}`, origin), 303);
  }
  if (!checkPassword(password)) {
    return NextResponse.redirect(new URL(`/famille/login?error=bad&next=${encodeURIComponent(safeNext)}`, origin), 303);
  }

  await setSession(name);
  return NextResponse.redirect(new URL(safeNext, origin), 303);
}
