import {
  Answer,
  Category,
  LoginRequest,
  LoginResponse,
  Question,
} from './types';

// Get the API base URL from environment variables, default to empty string
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
  categoryId: string,
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

export const fetchQuestion = async (
  questionId: string,
  token: string
): Promise<{ question: Question; answers: Answer[] }> => {
  const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch question');
  }

  return response.json();
};

export const submitAnswer = async (
  questionId: string,
  content: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/questions/${questionId}/answers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit answer');
  }

  return response.json();
};

export const submitQuestion = async (
  content: string,
  categoryId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, categoryId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit question');
  }
};

export const registerUser = async (
  username: string,
  password: string,
  confirmPassword: string,
  agreeToTerms: boolean
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, confirmPassword, agreeToTerms }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }
};
