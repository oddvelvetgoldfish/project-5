export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  content: string;
  userId: string;
  categoryId: string;
  createdAt: string;
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  createdAt: string;
}

export interface UserRepository {
  findById(userId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  createUser(username: string, password: string): Promise<void>;
}

export interface CategoryRepository {
  getAllCategories(): Promise<Category[]>;
  findCategoryById(categoryId: string): Promise<Category | null>;
}

export interface QuestionRepository {
  getQuestionsByCategory(categoryId: string): Promise<Question[]>;
  createQuestion(
    content: string,
    userId: string,
    categoryId: string,
    createdAt: string
  ): Promise<void>;
  getQuestionDetails(questionId: string): Promise<Question | null>;
}

export interface AnswerRepository {
  createAnswer(
    content: string,
    userId: string,
    questionId: string,
    createdAt: string
  ): Promise<void>;
  getAnswersByQuestion(questionId: string): Promise<Answer[]>;
}
