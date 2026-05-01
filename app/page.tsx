import Link from 'next/link';
import { redirect } from 'next/navigation';
import db, { Post, typeLabel } from '@/lib/db';
import { isAuthed } from '@/lib/session';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  if (!(await isAuthed())) redirect('/login');

  const posts = db
    .prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100')
    .all() as Post[];

  const counts = db
    .prepare('SELECT post_id, COUNT(*) as n FROM comments GROUP BY post_id')
    .all() as { post_id: string; n: number }[];
  const countMap = new Map(counts.map((c) => [c.post_id, c.n]));

  return (
    <>
      {posts.length === 0 ? (
        <div className="empty">
          <p>Pas encore de publication. Lance la conversation !</p>
          <Link href="/new" className="btn btn-primary">+ Nouvelle publication</Link>
        </div>
      ) : (
        <>
          {posts.map((p) => {
            const t = typeLabel(p.type);
            const n = countMap.get(p.id) || 0;
            return (
              <article key={p.id} className="card">
                <div className="post-head">
                  {t && <span className="badge">{t.emoji} {t.label}</span>}
                  <Link href={`/p/${p.id}`} style={{ color: 'inherit' }}>
                    <h2 className="post-title">{p.title}</h2>
                  </Link>
                </div>
                <div className="muted">par {p.author} · {timeAgo(p.created_at)}</div>
                <div className="body">{truncate(p.body, 280)}</div>
                <div className="actions">
                  <Link href={`/p/${p.id}`} className="muted">
                    💬 {n} {n === 1 ? 'commentaire' : 'commentaires'}
                  </Link>
                </div>
              </article>
            );
          })}
        </>
      )}
      <div className="fab">
        <Link href="/new">+ Nouvelle publication</Link>
      </div>
    </>
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
