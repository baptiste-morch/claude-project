import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="empty">
      <h2>Introuvable</h2>
      <p>Cette publication n'existe pas (ou plus).</p>
      <Link href="/famille" className="btn">Retour au flux</Link>
    </div>
  );
}
