import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDB } from './db/db';
import createAuthRoutes from './routes/auth';
import createQuestionsRoutes from './routes/questions';
import {
  SQLiteUserRepository,
  SQLiteCategoryRepository,
  SQLiteQuestionRepository,
  SQLiteAnswerRepository,
} from './db/sqlite';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize repositories
const userRepository = new SQLiteUserRepository();
const categoryRepository = new SQLiteCategoryRepository();
const questionRepository = new SQLiteQuestionRepository();
const answerRepository = new SQLiteAnswerRepository();

// Register routes
app.use('/api/auth', createAuthRoutes(userRepository));
app.use(
  '/api/questions',
  createQuestionsRoutes(
    categoryRepository,
    questionRepository,
    answerRepository,
    userRepository
  )
);

const PORT = process.env.PORT || 5000;

// Initialize the database and start the server
initializeDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize the database:', error);
    process.exit(1);
  });
