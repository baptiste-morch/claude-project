import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>404</h1>
        <p className="tagline">Cette page n'existe pas.</p>
        <Link href="/" className="btn">Retour à l'accueil</Link>
      </section>
    </main>
  );
}
