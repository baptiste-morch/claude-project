import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Post, Comment, typeLabel } from '@/lib/db';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';
import { timeAgo } from '@/lib/format';
import { loadReactions, makeKey } from '@/lib/reactions';
import Body from '../../components/Body';
import Reactions from '../../components/Reactions';
import PlatformLink from '../../components/PlatformLink';
import PostActions from '../../components/PostActions';
import CommentActions from '../../components/CommentActions';

export const dynamic = 'force-dynamic';

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect('/famille/login');
  const me = await getName();
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

  const targets: { type: 'post' | 'comment'; id: string }[] = [
    { type: 'post', id: post.id },
    ...(comments ?? []).map((c) => ({ type: 'comment' as const, id: c.id })),
  ];
  const reactions = await loadReactions(targets, me);

  const t = typeLabel(post.type);
  const postReactions = reactions.get(makeKey('post', post.id)) ?? [];
  const isMyPost = me === post.author;
  const postEdited = post.updated_at && post.updated_at !== post.created_at;

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
            <div className="muted">
              par {post.author} · {timeAgo(post.created_at)}
              {postEdited ? ' · (modifié)' : ''}
            </div>
            <div className="body"><Body text={post.body} /></div>
            {post.direct_url && (
              <div style={{ marginTop: 10 }}>
                <PlatformLink url={post.direct_url} />
              </div>
            )}
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

        <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Reactions targetType="post" targetId={post.id} initial={postReactions} />
          {isMyPost && (
            <PostActions
              postId={post.id}
              initialTitle={post.title}
              initialBody={post.body}
              initialDirectUrl={post.direct_url}
              redirectAfterDelete="/famille"
            />
          )}
        </div>

        <h3 style={{ marginTop: 24, marginBottom: 0, fontSize: 16 }}>
          {(comments ?? []).length}{' '}
          {(comments ?? []).length === 1 ? 'commentaire' : 'commentaires'}
        </h3>

        {(comments ?? []).map((c: Comment) => {
          const cr = reactions.get(makeKey('comment', c.id)) ?? [];
          const isMyComment = me === c.author;
          const commentEdited = c.updated_at && c.updated_at !== c.created_at;
          return (
            <div key={c.id} className="comment">
              <div className="muted">
                <strong style={{ color: 'var(--ink)' }}>{c.author}</strong> ·{' '}
                {timeAgo(c.created_at)}
                {commentEdited ? ' · (modifié)' : ''}
              </div>
              <div className="body"><Body text={c.body} /></div>
              <div style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <Reactions targetType="comment" targetId={c.id} initial={cr} />
                {isMyComment && (
                  <CommentActions
                    postId={post.id}
                    commentId={c.id}
                    initialBody={c.body}
                  />
                )}
              </div>
            </div>
          );
        })}

        {sp.error === 'missing' && (
          <div className="error" style={{ marginTop: 16 }}>Le commentaire est vide.</div>
        )}

        <form
          action={`/api/posts/${post.id}/comments`}
          method="post"
          style={{ marginTop: 20 }}
        >
          <label htmlFor="body">Ajouter un commentaire</label>
          <textarea
            id="body"
            name="body"
            required
            maxLength={3000}
            placeholder="Écris ce que tu en as pensé… (||texte caché|| pour un spoiler)"
          />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">Envoyer</button>
          </div>
        </form>
      </article>
    </>
  );
}
