'use client';

import { useEffect, useRef, useState } from 'react';
import {
  profile,
  pitch,
  territoires,
  experiences,
  realisations,
  vibrer,
  scene,
  formation,
  type TerritoireId,
} from '@/lib/cv-content';

// Rendu d'un pitch avec **gras** → <strong>.
function renderPitch(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>));
}

const colorOf: Record<TerritoireId, string> = territoires.reduce(
  (acc, t) => ({ ...acc, [t.id]: t.color }),
  {} as Record<TerritoireId, string>
);

export default function MorchPage() {
  const [filter, setFilter] = useState<TerritoireId | null>(null);
  const [openExp, setOpenExp] = useState<Set<string>>(new Set());
  const [photoOk, setPhotoOk] = useState(true);

  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineFillRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll-driven timeline fill (rail global retiré, on garde seulement le fil du parcours).
  useEffect(() => {
    const onScroll = () => {
      if (timelineRef.current && timelineFillRef.current) {
        const r = timelineRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const prog = Math.min(1, Math.max(0, (vh * 0.55 - r.top) / r.height));
        timelineFillRef.current.style.height = (prog * r.height).toFixed(0) + 'px';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver reveals : on bascule data-revealed via attribut,
  // pas via style.opacity inline (sinon ça écraserait la règle dim des filtres).
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      els.forEach((el) => el.setAttribute('data-revealed', 'true'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute('data-revealed', 'true');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Anim déplier/replier les expériences
  useEffect(() => {
    panelRefs.current.forEach((panel, id) => {
      if (openExp.has(id)) {
        panel.style.maxHeight = panel.scrollHeight + 40 + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  }, [openExp]);

  const toggleFilter = (id: TerritoireId) => {
    setFilter((cur) => (cur === id ? null : id));
  };
  const toggleExp = (id: string) => {
    setOpenExp((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const year = new Date().getFullYear();

  return (
    <div data-brand="morch">
      {/* ─── SPLASH ─── */}
      <section className="cv-splash">
        <svg
          className="cv-splash-bg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path d="M120 640 C 360 640 320 240 580 240" fill="none" stroke="#2B4BF2" strokeWidth="2.5" strokeDasharray="2 11" strokeLinecap="round" />
          <path d="M580 240 C 840 240 800 560 1060 560" fill="none" stroke="#E2447C" strokeWidth="2.5" strokeDasharray="2 11" strokeLinecap="round" />
          <path d="M300 120 C 540 120 560 440 1060 130" fill="none" stroke="#F4A82A" strokeWidth="2.5" strokeDasharray="2 11" strokeLinecap="round" />
          <circle cx="120" cy="640" r="9" fill="#2B4BF2" />
          <circle cx="580" cy="240" r="11" fill="#E2447C" />
          <circle cx="1060" cy="560" r="9" fill="#1FA37A" />
          <circle cx="300" cy="120" r="7" fill="#F4A82A" />
        </svg>

        <div className="cv-splash-inner">
          <div className="cv-photo">
            {photoOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/bapt-carre.jpg"
                alt="Baptiste Morch"
                onError={() => setPhotoOk(false)}
              />
            ) : (
              <svg viewBox="0 0 100 100" width="92" height="92" aria-hidden="true">
                <path d="M30 70 C 30 44 70 60 70 30" fill="none" stroke="#F7F4ED" strokeWidth="7" strokeLinecap="round" />
                <circle cx="30" cy="70" r="14" fill="#2B4BF2" />
                <circle cx="70" cy="30" r="14" fill="#E2447C" />
              </svg>
            )}
          </div>
          <div>
            <div className="cv-hello">{profile.hello}</div>
            <h1 className="cv-h1">
              Créons des <span className="liens">liens</span>
              <br />
              <span className="impro">improbables</span>.
            </h1>
          </div>
          <p className="cv-position">{profile.positioning}</p>
        </div>

        <div className="cv-scroll-cue" aria-hidden="true">
          <span>Faire défiler</span>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M12 4 L12 18 M6 12 L12 18 L18 12" fill="none" stroke="#9A9CB4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ─── PITCH ─── */}
      <section className="cv-section cv-pitch">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label" style={{ color: '#2B4BF2' }}>En gros</span>
            <span className="cv-kicker-rule" />
          </div>
          <p data-reveal>{renderPitch(pitch)}</p>
        </div>
      </section>

      {/* ─── TERRITOIRES ─── */}
      <section className="cv-section cv-section--dark cv-territoires">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label" style={{ color: '#F4A82A' }}>Ce que je relie</span>
            <span className="cv-kicker-rule" />
          </div>
          <h2 className="cv-h2" data-reveal>Quatre territoires, un même fil.</h2>
          <div className="cv-terr-grid">
            {territoires.map((t) => (
              <div key={t.id} className="cv-terr-card" data-reveal>
                <div className="cv-terr-head">
                  <span className="cv-terr-dot" style={{ background: t.color }} />
                  <h3>{t.label}</h3>
                </div>
                <p>{t.line}</p>
                <div className="cv-chips">
                  {t.skills.map((s) => (
                    <span key={s} className="cv-chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARCOURS ─── */}
      <section className="cv-section cv-parcours">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label" style={{ color: '#2B4BF2' }}>Le parcours</span>
            <span className="cv-kicker-rule" />
          </div>
          <h2 className="cv-h2 cv-h2--tight" data-reveal>Douze ans à tisser des liens.</h2>
          <p className="cv-intro-line" data-reveal>
            Filtrer par territoire — ou cliquer sur une étape pour la déplier.
          </p>

          <div className="cv-filterbar" data-reveal>
            <button
              type="button"
              className="cv-filterchip"
              data-active={filter === null}
              onClick={() => setFilter(null)}
            >
              Tout voir
            </button>
            {territoires.map((t) => (
              <button
                key={t.id}
                type="button"
                className="cv-filterchip"
                data-active={filter === t.id}
                onClick={() => toggleFilter(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div ref={timelineRef} className="cv-timeline">
            <div className="cv-timeline-track" />
            <div ref={timelineFillRef} className="cv-timeline-fill" />
            {experiences.map((e) => {
              const dim = filter !== null && !e.territoires.includes(filter);
              const isOpen = openExp.has(e.id);
              const color = colorOf[e.territoires[0]] ?? '#2B4BF2';
              return (
                <div key={e.id} className="cv-exp" data-dim={dim} data-reveal>
                  <span
                    className="cv-exp-dot"
                    style={{ background: color }}
                    aria-hidden="true"
                  />
                  <div
                    className="cv-exp-card"
                    data-open={isOpen}
                    onClick={() => toggleExp(e.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        toggleExp(e.id);
                      }
                    }}
                    aria-expanded={isOpen}
                  >
                    <div className="cv-exp-head">
                      <div>
                        <div className="cv-exp-role">{e.role}</div>
                        <div className="cv-exp-org" style={{ color }}>{e.org}</div>
                      </div>
                      <div className="cv-exp-dates">{e.dates}</div>
                    </div>
                    <p className="cv-exp-pitch">{e.pitch}</p>
                    <div
                      ref={(el) => {
                        if (el) panelRefs.current.set(e.id, el);
                        else panelRefs.current.delete(e.id);
                      }}
                      className="cv-exp-panel"
                    >
                      <ul>
                        {e.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="cv-exp-more" aria-hidden="true">
                      <span>{isOpen ? 'Replier' : 'Déplier'}</span>
                      <span className="cv-exp-more-icon">↓</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── RÉALISATIONS ─── */}
      <section className="cv-section cv-section--sand cv-realisations">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label" style={{ color: '#E2447C' }}>Réalisations marquantes</span>
            <span className="cv-kicker-rule" />
          </div>
          <h2 className="cv-h2" data-reveal>Trois liens dont je suis fier.</h2>
          <div className="cv-real-list">
            {realisations.map((r) => (
              <div key={r.id} className="cv-real" data-reveal>
                <div>
                  <div className="cv-real-title" style={{ color: r.color }}>{r.title}</div>
                  <span
                    className="cv-real-tag"
                    style={{
                      background: `${r.color}1F`,
                      color: r.color,
                    }}
                  >
                    {r.tag}
                  </span>
                </div>
                <p className="cv-real-desc">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CE QUI ME FAIT VIBRER ─── */}
      <section className="cv-section cv-section--cobalt cv-vibrer">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label">Ce qui me fait vibrer</span>
            <span className="cv-kicker-rule" />
          </div>
          <h2 className="cv-h2" data-reveal>Là où je me sens le plus utile.</h2>
          <div className="cv-vibrer-grid">
            {vibrer.map((v, i) => (
              <div key={i} className="cv-vibrer-card" data-reveal>
                <span className="dot" />
                <p>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOIX, SCÈNE & FORMATION ─── */}
      <section className="cv-section cv-scene">
        <div className="cv-content">
          <div className="cv-kicker" data-reveal>
            <span className="cv-kicker-label">Voix, scène &amp; engagement</span>
            <span className="cv-kicker-rule" />
          </div>
          <div className="cv-scene-list">
            {scene.map((s, i) => (
              <div key={i} className="cv-scene-row" data-reveal>
                <div>
                  <div className="cv-scene-role">{s.role}</div>
                  <div className="cv-scene-org">{s.org}</div>
                  <p className="cv-scene-desc">{s.desc}</p>
                </div>
                <div className="cv-scene-dates">{s.dates}</div>
              </div>
            ))}
          </div>

          <div className="cv-formation">
            <div className="cv-kicker" data-reveal>
              <span className="cv-kicker-label">Formation</span>
              <span className="cv-kicker-rule" />
            </div>
            <div className="cv-formation-grid">
              {formation.map((f, i) => (
                <div key={i} className="cv-form-card" data-reveal>
                  <div className="cv-form-head">
                    <div className="cv-form-school">{f.school}</div>
                    <div className="cv-form-year">{f.year}</div>
                  </div>
                  <div className="cv-form-degree">{f.degree}</div>
                  {f.note && <div className="cv-form-note">{f.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section className="cv-section cv-section--dark cv-contact">
        <div className="cv-content">
          <h2 data-reveal>
            On relie quelque chose
            <br />
            ensemble&nbsp;?
          </h2>
          <div className="cv-contact-cta" data-reveal>
            <a className="cv-btn-primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <a
              className="cv-btn-ghost"
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>
          </div>
          <div className="cv-contact-foot">
            <svg width="34" height="34" viewBox="0 0 80 80" aria-hidden="true">
              <path d="M22 56 C 22 30 58 50 58 24" fill="none" stroke="#F7F4ED" strokeWidth="5" strokeLinecap="round" />
              <circle cx="22" cy="56" r="10" fill="#2B4BF2" />
              <circle cx="58" cy="24" r="10" fill="#E2447C" />
            </svg>
            <span style={{ fontWeight: 600 }}>{profile.name}</span>
            <span className="spacer" />
            <span className="meta">CV interactif · {year}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
