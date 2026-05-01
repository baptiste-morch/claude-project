import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { isAuthed, getName } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Famille — partage',
  description: 'Films, livres, jeux, vidéos : un coin pour en discuter en famille.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthed();
  const name = await getName();

  return (
    <html lang="fr">
      <body>
        <header className="site">
          <div className="inner">
            <Link href="/" style={{ color: 'inherit' }}>
              <h1>🍂 Famille — partage</h1>
            </Link>
            <div className="meta">
              {authed && name && <span>Coucou {name}</span>}
              {authed && (
                <form action="/api/logout" method="post" style={{ margin: 0 }}>
                  <button className="btn" type="submit">Quitter</button>
                </form>
              )}
            </div>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
