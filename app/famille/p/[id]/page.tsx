import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Post, Comment, typeLabel } from '@/lib/db';
import { getSupabase } from '@/lib/supabase';
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
  if (!(await isAuthed())) redirect('/famille/login');
  const { id } = await params;
  const sp = await searchParams;
  const supabase = getSupabase();

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle<Post>();
  if (!post) notFound();

  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  const t = typeLabel(post.type);

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <Link href="/famille" className="muted">← Retour au flux</Link>
      </div>
      <article className="card">
        <div className="post-row">
          {post.cover_url && (
            <div className="cover-thumb cover-thumb-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt="" />
            </div>
          )}
          <div className="post-main">
            <div className="post-head">
              {t && <span className="badge">{t.emoji} {t.label}</span>}
              <h2 className="post-title">
                {post.title}
                {post.year ? <span className="muted" style={{ fontWeight: 400 }}> · {post.year}</span> : null}
              </h2>
            </div>
            <div className="muted">par {post.author} · {timeAgo(post.created_at)}</div>
            <div className="body">{post.body}</div>
          </div>
        </div>

        {post.photos.length > 0 && (
          <div className="photo-grid">
            {post.photos.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" />
              </a>
            ))}
          </div>
        )}

        <h3 style={{ marginTop: 24, marginBottom: 0, fontSize: 16 }}>
          {(comments ?? []).length}{' '}
          {(comments ?? []).length === 1 ? 'commentaire' : 'commentaires'}
        </h3>

        {(comments ?? []).map((c: Comment) => (
          <div key={c.id} className="comment">
            <div className="muted">
              <strong style={{ color: 'var(--ink)' }}>{c.author}</strong> ·{' '}
              {timeAgo(c.created_at)}
            </div>
            <div className="body">{c.body}</div>
          </div>
        ))}

        {sp.error === 'missing' && (
          <div className="error" style={{ marginTop: 16 }}>Le commentaire est vide.</div>
        )}

        <form
          action={`/api/posts/${post.id}/comments`}
          method="post"
          style={{ marginTop: 20 }}
        >
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
