export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  content: string;
  user_id: number;
  category_id: number;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}

export interface Answer {
  id: number;
  content: string;
  user_id: number;
  question_id: number;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}
