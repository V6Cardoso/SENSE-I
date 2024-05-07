-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS server;
DROP TABLE IF EXISTS experiments;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS device_experiments;


CREATE TABLE server (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE experiments (
  id TEXT PRIMARY KEY,
  name TEXT,
  incubator TEXT,
  temperature REAL,
  temperatureLowThreshold REAL,
  temperatureHighThreshold REAL,
  humidity REAL,
  humidityLowThreshold REAL,
  humidityHighThreshold REAL,
  startTimestamp INTEGER,
  endTimestamp INTEGER,
  createdTimestamp INTEGER,
  observation TEXT,
  owner TEXT
);

CREATE TABLE devices(
  pushToken TEXT PRIMARY KEY
);

CREATE TABLE device_experiments(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER,
  experiment_id INTEGER,
  FOREIGN KEY(device_id) REFERENCES devices(pushToken) ON DELETE CASCADE,
  FOREIGN KEY(experiment_id) REFERENCES experiments(id) ON DELETE CASCADE
);
