'use client';

import { useEffect, useRef } from 'react';

const keywords = [
  { label: 'Improvisation', color: '#E2447C',  top: '14%', left: '8%',  delay: '0s',    duration: '7.2s' },
  { label: 'Innovation',    color: '#2B4BF2',  top: '11%', left: '62%', delay: '1.1s',  duration: '6.4s' },
  { label: 'Radio',         color: '#F4A82A',  top: '38%', left: '4%',  delay: '0.6s',  duration: '8.1s' },
  { label: 'Geek',          color: '#1FA37A',  top: '34%', left: '80%', delay: '1.8s',  duration: '5.9s' },
  { label: 'Enthousiaste',  color: '#E2447C',  top: '68%', left: '10%', delay: '0.3s',  duration: '7.6s' },
  { label: 'Gestion',       color: '#2B4BF2',  top: '72%', left: '55%', delay: '1.4s',  duration: '6.8s' },
  { label: 'Stratégie',     color: '#F4A82A',  top: '58%', left: '78%', delay: '0.9s',  duration: '7s'   },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll<HTMLElement>('.home-kw');
    if (!els) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      els.forEach((el, i) => {
        const freq = 0.13 + i * 0.017;
        const phase = i * 1.1;
        const y = Math.sin(t * freq * Math.PI * 2 + phase) * 9;
        const x = Math.cos(t * freq * 0.7 * Math.PI * 2 + phase) * 4;
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div data-brand="home" ref={containerRef}>
<div className="home-center">
        <h1 className="home-title">
          Moi c&rsquo;est&nbsp;<span className="home-name">Baptiste</span>.
        </h1>
      </div>

      {keywords.map((kw) => (
        <span
          key={kw.label}
          className="home-kw"
          style={{
            top: kw.top,
            left: kw.left,
            color: kw.color,
          }}
        >
          {kw.label}
        </span>
      ))}
    </div>
  );
}
