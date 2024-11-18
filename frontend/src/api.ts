import { LoginRequest, LoginResponse, Category, Question } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};

export const fetchCategories = async (token: string): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/questions/categories/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch categories');
  }

  return response.json();
};

export const fetchQuestionsByCategory = async (
  categoryId: number,
  token: string
): Promise<Question[]> => {
  const response = await fetch(
    `${API_BASE_URL}/questions/category/${categoryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch questions');
  }

  return response.json();
};
