export type Post = {
  id: string;
  author: string;
  type: string;
  title: string;
  body: string;
  external_id: string | null;
  cover_url: string | null;
  year: number | null;
  photos: string[];
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author: string;
  body: string;
  created_at: string;
};

export const POST_TYPES = [
  { value: 'film', label: 'Film', emoji: '🎬', autocomplete: 'tmdb-movie' },
  { value: 'serie', label: 'Série', emoji: '📺', autocomplete: 'tmdb-tv' },
  { value: 'livre', label: 'Livre', emoji: '📚', autocomplete: 'books' },
  { value: 'jeu', label: 'Jeu vidéo', emoji: '🎮', autocomplete: null },
  { value: 'video', label: 'Vidéo', emoji: '📽️', autocomplete: null },
] as const;

export type PostType = (typeof POST_TYPES)[number]['value'];

export function typeLabel(value: string) {
  return POST_TYPES.find((t) => t.value === value);
}

export const VALID_TYPES = new Set<string>(POST_TYPES.map((t) => t.value));
