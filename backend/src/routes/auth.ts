import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, UserRow } from '../db';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  // Validate input
  if (!username || !password || !confirmPassword) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }
  // Check if user exists
  const existingUser = await db.get<UserRow>(
    'SELECT * FROM users WHERE username = ?',
    username
  );
  if (existingUser) {
    res.status(400).json({ message: 'Username already exists' });
    return;
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Insert user
  await db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    username,
    hashedPassword
  );
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  // Find user
  const user = await db.get<UserRow>(
    'SELECT * FROM users WHERE username = ?',
    username
  );
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }
  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }
  // Generate token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '2d',
    }
  );
  res.json({ token, username: user.username });
});

export default router;
