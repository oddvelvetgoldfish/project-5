import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import {
  CategoryRepository,
  QuestionRepository,
  AnswerRepository,
  UserRepository,
} from '../db/interfaces';

export default function createQuestionsRoutes(
  categoryRepo: CategoryRepository,
  questionRepo: QuestionRepository,
  answerRepo: AnswerRepository,
  userRepo: UserRepository
) {
  const router = express.Router();

  // Get Categories
  router.get('/categories/all', authenticate as any, async (req, res) => {
    try {
      const categories = await categoryRepo.getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Get Questions by Category
  router.get('/category/:id', authenticate as any, async (req, res) => {
    const { id } = req.params;

    try {
      const questions = await questionRepo.getQuestionsByCategory(Number(id));

      // Fetch user data for each question
      const questionsWithUser = await Promise.all(
        questions.map(async (question) => {
          const user = await userRepo.findById(question.user_id);
          return {
            ...question,
            user: user ? { id: user.id, username: user.username } : null,
          };
        })
      );

      res.json(questionsWithUser);
    } catch (err) {
      console.error('Error fetching questions:', err);
      res.status(500).json({ message: 'Failed to fetch questions' });
    }
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

    try {
      const createdAt = new Date().toISOString();
      await questionRepo.createQuestion(
        content,
        req.userId!,
        categoryId,
        createdAt
      );
      res.status(201).json({ message: 'Question created' });
    } catch (err) {
      console.error('Error creating question:', err);
      res.status(500).json({ message: 'Failed to create question' });
    }
  });

  // Get Question Details
  router.get('/:id', authenticate as any, async (req, res) => {
    const { id } = req.params;

    try {
      const question = await questionRepo.getQuestionDetails(Number(id));
      if (!question) {
        res.status(404).json({ message: 'Question not found' });
        return;
      }

      const user = await userRepo.findById(question.user_id);
      const questionWithUser = {
        ...question,
        user: user ? { id: user.id, username: user.username } : null,
      };

      const answers = await answerRepo.getAnswersByQuestion(Number(id));
      const answersWithUser = await Promise.all(
        answers.map(async (answer) => {
          const user = await userRepo.findById(answer.user_id);
          return {
            ...answer,
            user: user ? { id: user.id, username: user.username } : null,
          };
        })
      );

      res.json({ question: questionWithUser, answers: answersWithUser });
    } catch (err) {
      console.error('Error fetching question details:', err);
      res.status(500).json({ message: 'Failed to fetch question details' });
    }
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

      try {
        const createdAt = new Date().toISOString();
        await answerRepo.createAnswer(
          content,
          req.userId!,
          Number(id),
          createdAt
        );
        res.status(201).json({ message: 'Answer submitted' });
      } catch (err) {
        console.error('Error submitting answer:', err);
        res.status(500).json({ message: 'Failed to submit answer' });
      }
    }
  );

  return router;
}
