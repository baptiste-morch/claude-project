import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      data-brand="morch"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        background: '#181A2E',
        color: '#F7F4ED',
      }}
    >
      <svg width="80" height="80" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M30 70 C 30 44 70 60 70 30"
          fill="none"
          stroke="#F7F4ED"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="30" cy="70" r="13" fill="#2B4BF2" />
        <circle cx="70" cy="30" r="13" fill="#E2447C" />
      </svg>
      <h1
        style={{
          fontFamily: '"Bricolage Grotesque", system-ui, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(48px, 9vw, 96px)',
          letterSpacing: '-0.025em',
          margin: '32px 0 12px',
          lineHeight: 1,
        }}
      >
        Lien manquant.
      </h1>
      <p
        style={{
          fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
          fontSize: 18,
          color: '#C9CBDD',
          maxWidth: 480,
          margin: '0 0 32px',
          lineHeight: 1.55,
        }}
      >
        Cette page n'existe pas (ou plus). Mais on peut toujours en créer un autre.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '14px 24px',
          borderRadius: 999,
          background: '#F7F4ED',
          color: '#181A2E',
          fontFamily: '"Hanken Grotesk", system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          textDecoration: 'none',
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
