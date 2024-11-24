import { UserRow, CategoryRow, QuestionRow, AnswerRow } from './db';

export interface UserRepository {
  findById(userId: number): Promise<UserRow | null>;
  findByUsername(username: string): Promise<UserRow | null>;
  createUser(username: string, password: string): Promise<void>;
}

export interface CategoryRepository {
  getAllCategories(): Promise<CategoryRow[]>;
}

export interface QuestionRepository {
  getQuestionsByCategory(categoryId: number): Promise<QuestionRow[]>;
  createQuestion(
    content: string,
    userId: number,
    categoryId: number,
    createdAt: string
  ): Promise<void>;
  getQuestionDetails(questionId: number): Promise<QuestionRow | null>;
}

export interface AnswerRepository {
  createAnswer(
    content: string,
    userId: number,
    questionId: number,
    createdAt: string
  ): Promise<void>;
  getAnswersByQuestion(questionId: number): Promise<AnswerRow[]>;
}
