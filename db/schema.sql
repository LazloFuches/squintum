CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS password_resets (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  artist TEXT DEFAULT '',
  category TEXT DEFAULT '',
  date_text TEXT DEFAULT '',
  period TEXT DEFAULT '',
  medium TEXT DEFAULT '',
  dimensions TEXT DEFAULT '',
  condition_text TEXT DEFAULT '',
  description TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  is_placeholder INTEGER DEFAULT 0,
  images_json TEXT DEFAULT '[]',
  specs_json TEXT DEFAULT '[]',
  provenance_json TEXT DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
