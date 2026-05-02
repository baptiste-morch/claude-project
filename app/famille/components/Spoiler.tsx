'use client';

import { useState } from 'react';

export default function Spoiler({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span
      className={`spoiler ${revealed ? 'spoiler-revealed' : ''}`}
      onClick={() => setRevealed(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setRevealed(true);
        }
      }}
      title={revealed ? undefined : 'Spoiler — clique pour révéler'}
    >
      {children}
    </span>
  );
}
