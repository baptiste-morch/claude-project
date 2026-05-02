import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Post, typeLabel } from '@/lib/db';
import { getSupabase } from '@/lib/supabase';
import { isAuthed, getName } from '@/lib/session';
import { timeAgo } from '@/lib/format';
import { loadReactions, makeKey } from '@/lib/reactions';
import Body from './components/Body';
import Reactions from './components/Reactions';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  if (!(await isAuthed())) redirect('/famille/login');
  const me = await getName();

  const supabase = getSupabase();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;

  const ids = (posts ?? []).map((p) => p.id);
  const countMap = new Map<string, number>();
  if (ids.length > 0) {
    const { data: rows } = await supabase
      .from('comments')
      .select('post_id')
      .in('post_id', ids);
    for (const r of rows ?? []) {
      countMap.set(r.post_id, (countMap.get(r.post_id) ?? 0) + 1);
    }
  }

  const reactions = await loadReactions(
    (posts ?? []).map((p) => ({ type: 'post' as const, id: p.id })),
    me
  );

  return (
    <>
      {(!posts || posts.length === 0) ? (
        <div className="empty">
          <p>Pas encore de publication. Lance la conversation !</p>
          <Link href="/famille/new" className="btn btn-primary">+ Nouvelle publication</Link>
        </div>
      ) : (
        posts.map((p: Post) => {
          const t = typeLabel(p.type);
          const n = countMap.get(p.id) ?? 0;
          const r = reactions.get(makeKey('post', p.id)) ?? [];
          return (
            <article key={p.id} className="card">
              <div className="post-row">
                {p.cover_url && (
                  <Link href={`/famille/p/${p.id}`} className="cover-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover_url} alt="" loading="lazy" />
                  </Link>
                )}
                <div className="post-main">
                  <div className="post-head">
                    {t && <span className="badge">{t.emoji} {t.label}</span>}
                    <Link href={`/famille/p/${p.id}`} style={{ color: 'inherit' }}>
                      <h2 className="post-title">
                        {p.title}
                        {p.year ? <span className="muted" style={{ fontWeight: 400 }}> · {p.year}</span> : null}
                      </h2>
                    </Link>
                  </div>
                  <div className="muted">par {p.author} · {timeAgo(p.created_at)}</div>
                  <div className="body"><Body text={p.body} /></div>
                  <div className="actions">
                    <Reactions targetType="post" targetId={p.id} initial={r} />
                    <Link href={`/famille/p/${p.id}`} className="muted">
                      💬 {n} {n === 1 ? 'commentaire' : 'commentaires'}
                      {p.photos.length > 0 ? ` · 📷 ${p.photos.length}` : ''}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })
      )}
      <div className="fab">
        <Link href="/famille/new">+ Nouvelle publication</Link>
      </div>
    </>
  );
}
