import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthed } from '@/lib/session';
import { POST_TYPES } from '@/lib/db';

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAuthed())) redirect('/login?next=/new');
  const sp = await searchParams;

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Nouvelle publication</h2>
      {sp.error === 'missing' && <div className="error">Type, titre et message sont requis.</div>}
      <form action="/api/posts" method="post">
        <div className="row">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" required defaultValue="film">
            {POST_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
            ))}
          </select>
        </div>
        <div className="row">
          <label htmlFor="title">Titre de l'œuvre</label>
          <input id="title" name="title" required maxLength={200} placeholder="Ex. Le Voyage de Chihiro" />
        </div>
        <div className="row">
          <label htmlFor="body">Ton avis, ta question, ce que tu en as pensé…</label>
          <textarea id="body" name="body" required maxLength={5000} />
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" type="submit">Publier</button>
          <Link href="/" className="btn">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
