-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS server;

CREATE TABLE server (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL
);
