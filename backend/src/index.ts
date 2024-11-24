import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDB } from './db/mongodb';
import createAuthRoutes from './routes/auth';
import createQuestionsRoutes from './routes/questions';
import { MongoDBUserRepository } from './db/repos/user';
import { MongoDBCategoryRepository } from './db/repos/category';
import { MongoDBQuestionRepository } from './db/repos/question';
import { MongoDBAnswerRepository } from './db/repos/answer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize repositories
const userRepository = new MongoDBUserRepository();
const categoryRepository = new MongoDBCategoryRepository();
const questionRepository = new MongoDBQuestionRepository();
const answerRepository = new MongoDBAnswerRepository();

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

// Serve static frontend files
const clientBuildPath = path.join(__dirname, '../client');
app.use(express.static(clientBuildPath));

// Fallback for single-page application
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

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
