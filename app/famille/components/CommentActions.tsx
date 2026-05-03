'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  postId: string;
  commentId: string;
  initialBody: string;
};

export default function CommentActions({ postId, commentId, initialBody }: Props) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(initialBody);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
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
    if (!confirm('Supprimer ce commentaire ?')) return;
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Échec de la suppression.');
      return;
    }
    startTransition(() => router.refresh());
  }

  if (editing) {
    return (
      <form onSubmit={handleSave} className="edit-form">
        {error && <div className="error">{error}</div>}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={3000}
          required
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            Enregistrer
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setBody(initialBody);
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
    <div className="author-actions author-actions-inline">
      <button type="button" className="link-btn" onClick={() => setEditing(true)}>
        modifier
      </button>
      <button type="button" className="link-btn link-btn-danger" onClick={handleDelete}>
        supprimer
      </button>
    </div>
  );
}
