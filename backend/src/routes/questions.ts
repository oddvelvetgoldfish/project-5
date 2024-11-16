import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db, CategoryRow, QuestionRow, UserRow, AnswerRow } from '../db';

const router = express.Router();

// Get Categories
router.get('/categories/all', authenticate as any, async (req, res) => {
  const categories = await db.all<CategoryRow[]>('SELECT * FROM categories');
  res.json(categories);
});

// Get Questions by Category
router.get('/category/:id', authenticate as any, async (req, res) => {
  const { id } = req.params;
  const questions = await db.all<QuestionRow[]>(
    'SELECT * FROM questions WHERE category_id = ? ORDER BY datetime(created_at) DESC',
    id
  );

  // Fetch user data for each question
  const questionsWithUser = await Promise.all(
    questions.map(async (question) => {
      const user = await db.get<UserRow>(
        'SELECT id, username FROM users WHERE id = ?',
        question.user_id
      );
      return { ...question, user };
    })
  );

  res.json(questionsWithUser);
});

// Create a New Question
router.post('/', authenticate as any, async (req: AuthRequest, res) => {
  const { content, categoryId } = req.body;
  if (
    !content ||
    !categoryId ||
    !content.trim() ||
    !content.trim().endsWith('?')
  ) {
    res.status(400).json({ message: 'Invalid question format' });
    return;
  }
  const createdAt = new Date().toISOString();
  await db.run(
    'INSERT INTO questions (content, user_id, category_id, created_at) VALUES (?, ?, ?, ?)',
    content,
    req.userId,
    categoryId,
    createdAt
  );
  res.status(201).json({ message: 'Question created' });
});

// Get Question Details
router.get('/:id', authenticate as any, async (req, res) => {
  const { id } = req.params;
  const question = await db.get<QuestionRow>(
    'SELECT * FROM questions WHERE id = ?',
    id
  );

  if (!question) {
    res.status(404).json({ message: 'Question not found' });
    return;
  }

  const user = await db.get<UserRow>(
    'SELECT id, username FROM users WHERE id = ?',
    question.user_id
  );
  const questionWithUser = { ...question, user };

  const answers = await db.all<AnswerRow[]>(
    'SELECT * FROM answers WHERE question_id = ? ORDER BY datetime(created_at) DESC',
    id
  );

  const answersWithUser = await Promise.all(
    answers.map(async (answer) => {
      const user = await db.get<UserRow>(
        'SELECT id, username FROM users WHERE id = ?',
        answer.user_id
      );
      return { ...answer, user };
    })
  );

  res.json({ question: questionWithUser, answers: answersWithUser });
});

// Submit an Answer
router.post(
  '/:id/answers',
  authenticate as any,
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      res.status(400).json({ message: 'Answer cannot be empty' });
      return;
    }
    const createdAt = new Date().toISOString();
    await db.run(
      'INSERT INTO answers (content, user_id, question_id, created_at) VALUES (?, ?, ?, ?)',
      content,
      req.userId,
      id,
      createdAt
    );
    res.status(201).json({ message: 'Answer submitted' });
  }
);

export default router;
