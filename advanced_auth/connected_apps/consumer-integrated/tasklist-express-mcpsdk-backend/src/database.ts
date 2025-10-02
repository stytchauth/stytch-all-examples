import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function initializeDatabase(): Database.Database {
  if (db) {
    return db;
  }

  console.log('🗄️  Initializing SQLite database...');

  const dbPath = path.join(process.cwd(), 'tasks.db');
  db = new Database(dbPath);

  // Create tasks table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      text TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index on user_id for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)
  `);

  console.log('✅ Database initialized successfully');
  return db;
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('🗄️  Database connection closed');
  }
}
