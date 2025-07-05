// src/routes/admin.routes.ts
import express from 'express';
import User from '../models/User';
import Session from '../models/Session';
import authenticate from '../middleware/auth.middleware';

const router = express.Router();

// ✅ Middleware to allow only admin users
const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// ✅ Apply middlewares
router.use(authenticate);  // Protect all routes
router.use(adminOnly);     // Admin-only access

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET all sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().populate('mentor mentee', 'name email');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET all matches (skip if Match model is not used)
router.get('/matches', async (req, res) => {
  try {
    res.status(200).json({ message: 'Match feature not implemented yet.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
