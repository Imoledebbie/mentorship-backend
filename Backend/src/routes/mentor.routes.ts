import express from 'express';
import User from '../models/User';

const router = express.Router();

// GET /api/mentors - get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.status(200).json({ mentors });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentors', error: err });
  }
});

export default router;
