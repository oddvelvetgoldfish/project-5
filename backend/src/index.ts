import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDB } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
