import {
  UserRepository,
  CategoryRepository,
  QuestionRepository,
  AnswerRepository,
} from './interfaces';
import { db, UserRow, CategoryRow, QuestionRow, AnswerRow } from './db';

export class SQLiteUserRepository implements UserRepository {
  async findById(userId: number): Promise<UserRow | null> {
    return db
      .get<UserRow>('SELECT * FROM users WHERE id = ?', userId)
      .then((user) => {
        return user || null;
      });
  }

  async findByUsername(username: string): Promise<UserRow | null> {
    return db
      .get<UserRow>('SELECT * FROM users WHERE username = ?', username)
      .then((user) => {
        return user || null;
      });
  }

  async createUser(username: string, password: string): Promise<void> {
    await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      username,
      password
    );
  }
}

export class SQLiteCategoryRepository implements CategoryRepository {
  async getAllCategories(): Promise<CategoryRow[]> {
    return db.all<CategoryRow[]>('SELECT * FROM categories');
  }
}

export class SQLiteQuestionRepository implements QuestionRepository {
  async getQuestionsByCategory(categoryId: number): Promise<QuestionRow[]> {
    return db.all<QuestionRow[]>(
      'SELECT * FROM questions WHERE category_id = ? ORDER BY datetime(created_at) DESC',
      categoryId
    );
  }

  async createQuestion(
    content: string,
    userId: number,
    categoryId: number,
    createdAt: string
  ): Promise<void> {
    await db.run(
      'INSERT INTO questions (content, user_id, category_id, created_at) VALUES (?, ?, ?, ?)',
      content,
      userId,
      categoryId,
      createdAt
    );
  }

  async getQuestionDetails(questionId: number): Promise<QuestionRow | null> {
    return db
      .get<QuestionRow>('SELECT * FROM questions WHERE id = ?', questionId)
      .then((question) => {
        return question || null;
      });
  }
}

export class SQLiteAnswerRepository implements AnswerRepository {
  async createAnswer(
    content: string,
    userId: number,
    questionId: number,
    createdAt: string
  ): Promise<void> {
    await db.run(
      'INSERT INTO answers (content, user_id, question_id, created_at) VALUES (?, ?, ?, ?)',
      content,
      userId,
      questionId,
      createdAt
    );
  }

  async getAnswersByQuestion(questionId: number): Promise<AnswerRow[]> {
    return db.all<AnswerRow[]>(
      'SELECT * FROM answers WHERE question_id = ? ORDER BY datetime(created_at) DESC',
      questionId
    );
  }
}
