import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema-sqlite';

const DATABASE_URL = process.env.DATABASE_URL || 'file:./database.sqlite';

// Extract the file path from the URL
const dbPath = DATABASE_URL.replace('file:', '');

export const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');
