'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactionSummary } from '@/lib/reactions';

type Props = {
  targetType: 'post' | 'comment';
  targetId: string;
  initial: ReactionSummary[];
};

export default function Reactions({ targetType, targetId, initial }: Props) {
  const [state, setState] = useState(initial);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle(emoji: string) {
    // Optimistic update
    setState((prev) =>
      prev.map((r) =>
        r.emoji === emoji
          ? { ...r, byMe: !r.byMe, count: r.byMe ? r.count - 1 : r.count + 1 }
          : r
      )
    );
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_type: targetType, target_id: targetId, emoji }),
      });
      if (!res.ok) throw new Error('reaction failed');
      // Revalidate page so other reactors' updates also appear
      startTransition(() => router.refresh());
    } catch {
      // Roll back on failure
      setState((prev) =>
        prev.map((r) =>
          r.emoji === emoji
            ? { ...r, byMe: !r.byMe, count: r.byMe ? r.count - 1 : r.count + 1 }
            : r
        )
      );
    }
  }

  return (
    <div className="reactions" data-pending={pending || undefined}>
      {state.map((r) => (
        <button
          key={r.emoji}
          type="button"
          className={`reaction ${r.byMe ? 'reaction-active' : ''}`}
          onClick={() => toggle(r.emoji)}
          title={r.authors.length > 0 ? r.authors.join(', ') : `Réagir avec ${r.emoji}`}
          aria-pressed={r.byMe}
        >
          <span className="reaction-emoji">{r.emoji}</span>
          {r.count > 0 && <span className="reaction-count">{r.count}</span>}
        </button>
      ))}
    </div>
  );
}
