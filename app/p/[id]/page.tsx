import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import db, { Post, Comment, typeLabel } from '@/lib/db';
import { isAuthed } from '@/lib/session';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect('/login');
  const { id } = await params;
  const sp = await searchParams;

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
  if (!post) notFound();

  const comments = db
    .prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC')
    .all(id) as Comment[];

  const t = typeLabel(post.type);

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Link href="/" className="muted">← Retour au flux</Link>
      </div>
      <article className="card">
        <div className="post-head">
          {t && <span className="badge">{t.emoji} {t.label}</span>}
          <h2 className="post-title">{post.title}</h2>
        </div>
        <div className="muted">par {post.author} · {timeAgo(post.created_at)}</div>
        <div className="body">{post.body}</div>

        <h3 style={{ marginTop: 24, marginBottom: 0, fontSize: 16 }}>
          {comments.length} {comments.length === 1 ? 'commentaire' : 'commentaires'}
        </h3>

        {comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="muted"><strong style={{ color: 'var(--ink)' }}>{c.author}</strong> · {timeAgo(c.created_at)}</div>
            <div className="body">{c.body}</div>
          </div>
        ))}

        {sp.error === 'missing' && <div className="error" style={{ marginTop: 16 }}>Le commentaire est vide.</div>}

        <form action={`/api/posts/${post.id}/comments`} method="post" style={{ marginTop: 20 }}>
          <label htmlFor="body">Ajouter un commentaire</label>
          <textarea id="body" name="body" required maxLength={3000} placeholder="Écris ce que tu en as pensé…" />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">Envoyer</button>
          </div>
        </form>
      </article>
    </>
  );
}
