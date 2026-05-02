import { getSupabase } from '@/lib/supabase';
import { Reaction, REACTION_EMOJIS } from '@/lib/db';

export type ReactionSummary = {
  emoji: string;
  count: number;
  authors: string[];
  byMe: boolean;
};

export type ReactionMap = Map<string, ReactionSummary[]>; // key: `${target_type}:${target_id}`

export function makeKey(target_type: 'post' | 'comment', target_id: string) {
  return `${target_type}:${target_id}`;
}

export async function loadReactions(
  targets: { type: 'post' | 'comment'; id: string }[],
  me: string
): Promise<ReactionMap> {
  const map: ReactionMap = new Map();
  if (targets.length === 0) return map;

  const supabase = getSupabase();
  const postIds = targets.filter((t) => t.type === 'post').map((t) => t.id);
  const commentIds = targets.filter((t) => t.type === 'comment').map((t) => t.id);

  const queries: Promise<{ data: Reaction[] | null }>[] = [];
  if (postIds.length > 0) {
    queries.push(
      supabase
        .from('reactions')
        .select('*')
        .eq('target_type', 'post')
        .in('target_id', postIds) as unknown as Promise<{ data: Reaction[] | null }>
    );
  }
  if (commentIds.length > 0) {
    queries.push(
      supabase
        .from('reactions')
        .select('*')
        .eq('target_type', 'comment')
        .in('target_id', commentIds) as unknown as Promise<{ data: Reaction[] | null }>
    );
  }

  const rows: Reaction[] = (await Promise.all(queries))
    .flatMap((q) => q.data || []);

  // Group by target then emoji
  type Bucket = Map<string, { authors: string[]; byMe: boolean }>;
  const grouped = new Map<string, Bucket>();
  for (const r of rows) {
    const key = makeKey(r.target_type, r.target_id);
    let bucket = grouped.get(key);
    if (!bucket) {
      bucket = new Map();
      grouped.set(key, bucket);
    }
    let entry = bucket.get(r.emoji);
    if (!entry) {
      entry = { authors: [], byMe: false };
      bucket.set(r.emoji, entry);
    }
    entry.authors.push(r.author);
    if (r.author === me) entry.byMe = true;
  }

  for (const t of targets) {
    const key = makeKey(t.type, t.id);
    const bucket = grouped.get(key);
    const summary: ReactionSummary[] = REACTION_EMOJIS.map((emoji) => {
      const e = bucket?.get(emoji);
      return {
        emoji,
        count: e?.authors.length ?? 0,
        authors: e?.authors ?? [],
        byMe: e?.byMe ?? false,
      };
    });
    map.set(key, summary);
  }
  return map;
}
