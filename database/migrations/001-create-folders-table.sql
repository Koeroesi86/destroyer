CREATE TABLE IF NOT EXISTS library (
  path TEXT PRIMARY KEY,
  artist TEXT,
  album TEXT,
  title TEXT,
  year TEXT,
  track TEXT,
  disk TEXT,
  genre TEXT,
  picture TEXT,
  duration REAL
);
