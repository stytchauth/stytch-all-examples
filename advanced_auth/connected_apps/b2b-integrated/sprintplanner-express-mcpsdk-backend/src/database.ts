import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function initializeDatabase(dbPath: string = 'tickets.db'): void {
  db = new Database(dbPath);

  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON');

  // Create organizations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create tickets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      assignee TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'backlog',
      description TEXT,
      organization_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
    )
  `);

  // Create trigger to update updated_at timestamp for organizations
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS organizations_updated_at 
    AFTER UPDATE ON organizations 
    FOR EACH ROW 
    BEGIN
      UPDATE organizations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Create trigger to update updated_at timestamp for tickets
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS tickets_updated_at 
    AFTER UPDATE ON tickets 
    FOR EACH ROW 
    BEGIN
      UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  console.log(`✅ Database initialized at ${dbPath}`);
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
    console.log('✅ Database connection closed');
  }
}

export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
