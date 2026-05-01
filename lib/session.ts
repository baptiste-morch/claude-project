import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const AUTH_COOKIE = 'famille_auth';
const NAME_COOKIE = 'famille_nom';
const ONE_YEAR = 60 * 60 * 24 * 365;

function authToken() {
  const password = process.env.FAMILY_PASSWORD || 'changeme';
  return crypto.createHash('sha256').update(`famille:${password}`).digest('hex');
}

export async function isAuthed() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === authToken();
}

export async function getName() {
  const jar = await cookies();
  return jar.get(NAME_COOKIE)?.value || '';
}

export async function setSession(name: string) {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, authToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_YEAR,
    path: '/',
  });
  jar.set(NAME_COOKIE, name, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_YEAR,
    path: '/',
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  jar.delete(NAME_COOKIE);
}

export function checkPassword(input: string) {
  const expected = process.env.FAMILY_PASSWORD || 'changeme';
  if (input.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(input), Buffer.from(expected));
}
