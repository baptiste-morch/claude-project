'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  postId: string;
  initialTitle: string;
  initialBody: string;
  initialDirectUrl: string | null;
  redirectAfterDelete?: string;
};

export default function PostActions({
  postId,
  initialTitle,
  initialBody,
  initialDirectUrl,
  redirectAfterDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [directUrl, setDirectUrl] = useState(initialDirectUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, direct_url: directUrl }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? 'Erreur à la sauvegarde.');
      return;
    }
    setEditing(false);
    startTransition(() => router.refresh());
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette publication ? Les commentaires seront supprimés aussi.')) return;
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Échec de la suppression.');
      return;
    }
    if (redirectAfterDelete) {
      router.push(redirectAfterDelete);
    } else {
      startTransition(() => router.refresh());
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="edit-form">
        {error && <div className="error">{error}</div>}
        <label htmlFor={`edit-title-${postId}`}>Titre</label>
        <input
          id={`edit-title-${postId}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
        <label htmlFor={`edit-body-${postId}`}>Texte</label>
        <textarea
          id={`edit-body-${postId}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          required
        />
        <label htmlFor={`edit-url-${postId}`}>Lien direct (optionnel)</label>
        <input
          id={`edit-url-${postId}`}
          type="url"
          value={directUrl}
          onChange={(e) => setDirectUrl(e.target.value)}
          maxLength={2000}
          placeholder="https://…"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            Enregistrer
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTitle(initialTitle);
              setBody(initialBody);
              setDirectUrl(initialDirectUrl ?? '');
              setError(null);
              setEditing(false);
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="author-actions">
      <button type="button" className="link-btn" onClick={() => setEditing(true)}>
        modifier
      </button>
      <button type="button" className="link-btn link-btn-danger" onClick={handleDelete}>
        supprimer
      </button>
    </div>
  );
}
