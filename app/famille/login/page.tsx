import { redirect } from 'next/navigation';
import { isAuthed, getName } from '@/lib/session';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (await isAuthed()) redirect('/famille');
  const sp = await searchParams;
  const previousName = await getName();

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Bienvenue 👋</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Entre le mot de passe familial et choisis ton prénom pour participer.
      </p>
      {sp.error === 'bad' && <div className="error">Mot de passe incorrect.</div>}
      {sp.error === 'missing' && <div className="error">Prénom et mot de passe requis.</div>}
      <form action="/api/login" method="post">
        <input type="hidden" name="next" value={sp.next || '/famille'} />
        <div className="row">
          <label htmlFor="name">Ton prénom</label>
          <input
            id="name"
            name="name"
            defaultValue={previousName}
            placeholder="Ex. Camille"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="row">
          <label htmlFor="password">Mot de passe familial</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Le mot que vous avez choisi"
            required
          />
        </div>
        <div style={{ marginTop: 18 }}>
          <button className="btn btn-primary" type="submit">Entrer</button>
        </div>
      </form>
    </div>
  );
}
