import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'app.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

const db = global.__db ?? new Database(dbPath);
if (!global.__db) {
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at);
  `);
  global.__db = db;
}

export default db;

export type Post = {
  id: string;
  author: string;
  type: string;
  title: string;
  body: string;
  created_at: number;
};

export type Comment = {
  id: string;
  post_id: string;
  author: string;
  body: string;
  created_at: number;
};

export const POST_TYPES = [
  { value: 'film', label: 'Film', emoji: '🎬' },
  { value: 'serie', label: 'Série', emoji: '📺' },
  { value: 'livre', label: 'Livre', emoji: '📚' },
  { value: 'jeu', label: 'Jeu vidéo', emoji: '🎮' },
  { value: 'video', label: 'Vidéo', emoji: '📽️' },
] as const;

export function typeLabel(value: string) {
  return POST_TYPES.find((t) => t.value === value);
}
