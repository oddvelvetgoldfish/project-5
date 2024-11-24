export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
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
  user: {
    id: string;
    username: string;
  };
}

export interface Answer {
  id: string;
  content: string;
  userId: string;
  questionId: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
}
