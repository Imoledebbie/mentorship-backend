import express from 'express';
import User from '../models/User';

const router = express.Router();

// GET /api/mentees - get all mentees
router.get('/', async (req, res) => {
  try {
    const mentees = await User.find({ role: 'mentee' }).select('-password');
    res.status(200).json({ mentees });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentees', error: err });
  }
});

export default router;
