import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Post, typeLabel } from '@/lib/db';
import { getSupabase } from '@/lib/supabase';
import { isAuthed } from '@/lib/session';
import { timeAgo } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  if (!(await isAuthed())) redirect('/login');

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

  return (
    <>
      {(!posts || posts.length === 0) ? (
        <div className="empty">
          <p>Pas encore de publication. Lance la conversation !</p>
          <Link href="/new" className="btn btn-primary">+ Nouvelle publication</Link>
        </div>
      ) : (
        posts.map((p: Post) => {
          const t = typeLabel(p.type);
          const n = countMap.get(p.id) ?? 0;
          return (
            <article key={p.id} className="card">
              <div className="post-row">
                {p.cover_url && (
                  <Link href={`/p/${p.id}`} className="cover-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover_url} alt="" loading="lazy" />
                  </Link>
                )}
                <div className="post-main">
                  <div className="post-head">
                    {t && <span className="badge">{t.emoji} {t.label}</span>}
                    <Link href={`/p/${p.id}`} style={{ color: 'inherit' }}>
                      <h2 className="post-title">
                        {p.title}
                        {p.year ? <span className="muted" style={{ fontWeight: 400 }}> · {p.year}</span> : null}
                      </h2>
                    </Link>
                  </div>
                  <div className="muted">par {p.author} · {timeAgo(p.created_at)}</div>
                  <div className="body">{truncate(p.body, 240)}</div>
                  <div className="actions">
                    <Link href={`/p/${p.id}`} className="muted">
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
        <Link href="/new">+ Nouvelle publication</Link>
      </div>
    </>
  );
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}
