import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (db) return db; // Return existing connection

  const dbPath = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.resolve(__dirname, "../../database/fleet.db");

  // Ensure the database directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);

  // Performance + safety pragmas

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = NORMAL");

  initializeSchema(db);

  console.log(`Database connected: ${dbPath}`);
  return db;
}

// Schema
function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagnostic_events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp   TEXT    NOT NULL,
      vehicle_id  TEXT    NOT NULL,
      level       TEXT    NOT NULL CHECK(level IN ('ERROR', 'WARN', 'INFO')),
      code        TEXT    NOT NULL,
      message     TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    -- Indexes for fast filtering on commonly queried columns
    CREATE INDEX IF NOT EXISTS idx_vehicle_id ON diagnostic_events(vehicle_id);
    CREATE INDEX IF NOT EXISTS idx_level      ON diagnostic_events(level);
    CREATE INDEX IF NOT EXISTS idx_code       ON diagnostic_events(code);
    CREATE INDEX IF NOT EXISTS idx_timestamp  ON diagnostic_events(timestamp);

    -- Composite index for time-range queries combined with vehicle filter
    CREATE INDEX IF NOT EXISTS idx_vehicle_timestamp
      ON diagnostic_events(vehicle_id, timestamp);
  `);

  console.log("Schema initialized");
}

//  Graceful shutdown
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log("Database connection closed");
  }
}
