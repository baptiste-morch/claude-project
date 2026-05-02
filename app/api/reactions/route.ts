import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';
import { REACTION_EMOJIS } from '@/lib/db';

export const runtime = 'nodejs';

const VALID_EMOJIS = new Set<string>(REACTION_EMOJIS);
const VALID_TARGETS = new Set(['post', 'comment']);

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const author = (await getName()) || '';
  if (!author) {
    return NextResponse.json({ error: 'no_name' }, { status: 400 });
  }
  const { target_type, target_id, emoji } = await req.json().catch(() => ({}));

  if (!VALID_TARGETS.has(target_type) || !target_id || !VALID_EMOJIS.has(emoji)) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const supabase = getSupabase();

  // Toggle: if exists, delete; otherwise insert.
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('target_type', target_type)
    .eq('target_id', target_id)
    .eq('author', author)
    .eq('emoji', emoji)
    .maybeSingle();

  if (existing) {
    await supabase.from('reactions').delete().eq('id', existing.id);
    return NextResponse.json({ active: false });
  }

  const { error } = await supabase
    .from('reactions')
    .insert({ target_type, target_id, author, emoji });
  if (error) {
    console.error('insert reaction error', error);
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 });
  }
  return NextResponse.json({ active: true });
}
