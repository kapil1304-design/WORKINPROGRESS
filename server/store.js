import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/** Durable, indexed pilot records. All write commands execute atomically. */
export class Store {
  constructor(path = ':memory:') {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS records (
        kind TEXT NOT NULL, id TEXT NOT NULL, project TEXT, user TEXT,
        data TEXT NOT NULL CHECK(json_valid(data)), PRIMARY KEY(kind,id)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS record_project ON records(kind,project);
      CREATE INDEX IF NOT EXISTS record_user ON records(kind,user);
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;
      INSERT OR IGNORE INTO metadata VALUES('schema_version','1');`);
  }
  get(kind, id) {
    const row = this.db.prepare('SELECT data FROM records WHERE kind=? AND id=?').get(kind, id);
    return row ? JSON.parse(row.data) : null;
  }
  all(kind) { return this.db.prepare('SELECT data FROM records WHERE kind=? ORDER BY rowid').all(kind).map(r => JSON.parse(r.data)); }
  put(kind, item) {
    this.db.prepare(`INSERT INTO records(kind,id,project,user,data) VALUES(?,?,?,?,?)
      ON CONFLICT(kind,id) DO UPDATE SET project=excluded.project,user=excluded.user,data=excluded.data`)
      .run(kind, item.id, item.project ?? null, item.user ?? null, JSON.stringify(item));
    return item;
  }
  remove(kind, id) { this.db.prepare('DELETE FROM records WHERE kind=? AND id=?').run(kind, id); }
  tx(fn) {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  close() { this.db.close(); }
}
