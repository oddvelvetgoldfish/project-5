import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

export interface UserRow {
  id: number;
  username: string;
  password: string;
}

export interface CategoryRow {
  id: number;
  name: string;
}

export interface QuestionRow {
  id: number;
  content: string;
  user_id: number;
  category_id: number;
  created_at: string;
}

export interface AnswerRow {
  id: number;
  content: string;
  user_id: number;
  question_id: number;
  created_at: string;
}

export let db: Database;

export const initializeDB = async () => {
  db = await open({
    filename: path.join(__dirname, 'techtalk.sqlite'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Seed initial categories if not already present
  const categoriesCount = await db.get<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  if (categoriesCount && categoriesCount.count === 0) {
    const initialCategories = ['JavaScript', 'React', 'Node.js'];
    const insertCategory = await db.prepare(
      'INSERT INTO categories (name) VALUES (?)'
    );
    for (const name of initialCategories) {
      await insertCategory.run(name);
    }
    await insertCategory.finalize();
  }
};
