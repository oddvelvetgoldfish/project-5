import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../db/interfaces';

export default function createAuthRoutes(userRepo: UserRepository) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }

    const existingUser = await userRepo.findByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepo.createUser(username, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const user = await userRepo.findByUsername(username);
    console.log(user);
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1w' }
    );
    res.json({ token, username: user.username });
  });

  return router;
}
