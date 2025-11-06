import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db!: Database;

  async init(): Promise<void> {
    const SQL = await initSqlJs({
      locateFile: (file:string) => `https://sql.js.org/dist/${file}`
    });

    // load from localStorage if exists
    const saved = localStorage.getItem('weatherDb');
    if (saved) {
      const bytes = new Uint8Array(JSON.parse(saved));
      this.db = new SQL.Database(bytes);
    } else {
      this.db = new SQL.Database();
    }

    this.createSchema();
  }

  private createSchema(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      );

      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS weather_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        city TEXT,
        last_called INTEGER
      );
    `);
    this.save();
  }

  private save(): void {
    const data = this.db.export();
    localStorage.setItem('weatherDb', JSON.stringify(Array.from(data)));
  }

  run(query: string, params: (string|number|null)[] = []): void {
    const stmt = this.db.prepare(query);
    stmt.bind(params);
    while (stmt.step()) { /* exhaust */ }
    stmt.free();
    this.save();
  }

  // returns array of rows as objects
  all(query: string, params: (string|number|null)[] = []): any[] {
    const stmt = this.db.prepare(query);
    stmt.bind(params);
    const rows: any[] = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  one(query: string, params: (string|number|null)[] = []): any | null {
    const rows = this.all(query, params);
    return rows.length ? rows[0] : null;
  }
}
