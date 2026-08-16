import * as schema from "./schema";

let db: any;

if (process.env.NODE_ENV === "test") {
  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const sqlite = new Database(":memory:");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      modified_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL REFERENCES programs(id),
      title TEXT NOT NULL,
      week INTEGER,
      exercises TEXT DEFAULT '[]',
      order_index INTEGER,
      created_at TEXT NOT NULL,
      modified_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL REFERENCES workouts(id),
      name TEXT NOT NULL,
      sets INTEGER,
      reps INTEGER,
      description TEXT,
      order_index INTEGER,
      created_at TEXT NOT NULL,
      modified_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id),
      weight REAL,
      logged_at TEXT NOT NULL,
      modified_at TEXT NOT NULL
    );
  `);
  db = drizzle(sqlite, { schema });
} else {
  const { drizzle } = require("drizzle-orm/expo-sqlite");
  const { openDatabaseSync } = require("expo-sqlite");
  const sqlite = openDatabaseSync("uplift.db", { enableChangeListener: true });
  db = drizzle(sqlite, { schema });
}

export { db };