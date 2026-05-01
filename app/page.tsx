import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>Baptiste Morch</h1>
        <p className="tagline">
          Bienvenue sur mon petit coin du web.
        </p>
      </section>

      <section className="cards">
        <Link href="/famille" className="project-card">
          <div className="project-emoji">🍂</div>
          <div>
            <h2>Famille — partage</h2>
            <p>
              Un espace privé pour partager films, livres, jeux et vidéos
              avec la famille, et en discuter en commentaires.
            </p>
            <span className="project-cta">Entrer →</span>
          </div>
        </Link>
      </section>

      <footer className="landing-footer">
        <span>© Baptiste Morch</span>
      </footer>
    </main>
  );
}
