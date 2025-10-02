import Database from 'better-sqlite3';
import { getDatabase } from './database';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export class TaskListService {
  private readonly userID: string;

  constructor(userID: string) {
    this.userID = userID;
  }

  private async withDatabase<T>(operation: (db: Database.Database) => T): Promise<T> {
    const db = getDatabase();
    return operation(db);
  }

  async get(): Promise<Task[]> {
    return this.withDatabase((db) => {
      const stmt = db.prepare(`
        SELECT id, text, completed 
        FROM tasks 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);

      const rows = stmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map((row) => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
      }));
    });
  }

  async add(taskText: string): Promise<Task[]> {
    return this.withDatabase((db) => {
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
      };

      const stmt = db.prepare(`
        INSERT INTO tasks (id, user_id, text, completed)
        VALUES (?, ?, ?, ?)
      `);

      stmt.run(newTask.id, this.userID, newTask.text, newTask.completed ? 1 : 0);

      // Get updated tasks in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM tasks 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);

      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map((row) => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
      }));
    });
  }

  async delete(taskID: string): Promise<Task[]> {
    return this.withDatabase((db) => {
      const stmt = db.prepare(`
        DELETE FROM tasks 
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(taskID, this.userID);

      // Get updated tasks in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM tasks 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);

      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map((row) => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
      }));
    });
  }

  async markCompleted(taskID: string): Promise<Task[]> {
    return this.withDatabase((db) => {
      const stmt = db.prepare(`
        UPDATE tasks 
        SET completed = 1 
        WHERE id = ? AND user_id = ?
      `);

      stmt.run(taskID, this.userID);

      // Get updated tasks in the same connection
      const selectStmt = db.prepare(`
        SELECT id, text, completed 
        FROM tasks 
        WHERE user_id = ? 
        ORDER BY completed ASC, id ASC
      `);

      const rows = selectStmt.all(this.userID) as Array<{
        id: string;
        text: string;
        completed: number;
      }>;

      return rows.map((row) => ({
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed),
      }));
    });
  }
}
