'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { POST_TYPES, type PostType } from '@/lib/db';

type SearchResult = {
  external_id: string;
  title: string;
  year: number | null;
  cover_url: string | null;
  subtitle: string | null;
};

const TYPE_META = Object.fromEntries(POST_TYPES.map((t) => [t.value, t]));

export default function NewPostForm({ initialError }: { initialError?: string }) {
  const [type, setType] = useState<PostType>('film');
  const [title, setTitle] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(initialError);
  const debounceRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const supportsAutocomplete = !!TYPE_META[type]?.autocomplete;

  useEffect(() => {
    setSelected(null);
    setResults([]);
    setOpen(false);
  }, [type]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!supportsAutocomplete) return;
    if (selected && selected.title === title) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (title.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?type=${type}&q=${encodeURIComponent(title)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [title, type, supportsAutocomplete, selected]);

  function pickResult(r: SearchResult) {
    setSelected(r);
    setTitle(r.title);
    setOpen(false);
  }

  function clearSelected() {
    setSelected(null);
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6);
    setPhotos(files);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(undefined);
    const form = e.currentTarget;
    const fd = new FormData(form);
    photos.forEach((f) => fd.append('photo', f));

    try {
      const res = await fetch('/api/posts', { method: 'POST', body: fd, redirect: 'manual' });
      // With redirect: 'manual' the response is opaqueredirect, so check Location indirectly.
      if (res.type === 'opaqueredirect') {
        window.location.href = '/famille';
        return;
      }
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.id) {
          window.location.href = `/famille/p/${data.id}`;
          return;
        }
      }
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Erreur à la publication.');
    } catch (err) {
      setError('Erreur réseau. Réessaie.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {error && <div className="error">{error}</div>}

      <div className="row">
        <label htmlFor="type">Type</label>
        <select id="type" name="type" required value={type} onChange={(e) => setType(e.target.value as PostType)}>
          {POST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
          ))}
        </select>
      </div>

      <div className="row autocomplete-wrap" ref={wrapRef}>
        <label htmlFor="title">Titre de l'œuvre</label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          autoComplete="off"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (selected && e.target.value !== selected.title) clearSelected();
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={
            type === 'video'
              ? 'Colle une URL YouTube ou Vimeo…'
              : supportsAutocomplete
                ? 'Tape pour chercher…'
                : 'Ex. Hollow Knight'
          }
        />
        {searching && <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Recherche…</div>}
        {open && results.length > 0 && (
          <div className="autocomplete-list">
            {results.map((r) => (
              <button
                type="button"
                key={r.external_id}
                className="autocomplete-item"
                onClick={() => pickResult(r)}
              >
                {r.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.cover_url} alt="" />
                ) : (
                  <div className="autocomplete-thumb-empty">{TYPE_META[type]?.emoji}</div>
                )}
                <div>
                  <div className="autocomplete-title">
                    {r.title}{r.year ? ` · ${r.year}` : ''}
                  </div>
                  {r.subtitle && <div className="muted" style={{ fontSize: 12 }}>{r.subtitle}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="selected-preview">
          {selected.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.cover_url} alt="" />
          )}
          <div>
            <div style={{ fontWeight: 600 }}>{selected.title}{selected.year ? ` · ${selected.year}` : ''}</div>
            <button type="button" className="link-btn" onClick={clearSelected}>retirer la fiche</button>
          </div>
          <input type="hidden" name="external_id" value={selected.external_id} />
          <input type="hidden" name="cover_url" value={selected.cover_url ?? ''} />
          <input type="hidden" name="year" value={selected.year ?? ''} />
        </div>
      )}

      <div className="row">
        <label htmlFor="body">Ton avis, ta question, ce que tu en as pensé…</label>
        <textarea
          id="body"
          name="body"
          required
          maxLength={5000}
          placeholder="Astuce : encadre un spoiler avec ||double pipe|| pour le cacher"
        />
      </div>

      <div className="row">
        <label htmlFor="photos">Photos (optionnel, jusqu'à 6)</label>
        <input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
        />
        {photos.length > 0 && (
          <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
            {photos.length} fichier{photos.length > 1 ? 's' : ''} sélectionné{photos.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Publication…' : 'Publier'}
        </button>
        <Link href="/" className="btn">Annuler</Link>
      </div>
    </form>
  );
}
