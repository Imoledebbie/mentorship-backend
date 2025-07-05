import express, { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import authenticate from '../middleware/auth.middleware';  // fixed import

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// ✅ POST: Submit feedback for a session (mentees only)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, rating, comments } = req.body;
    const menteeId = req.user?.userId; // ✅ Fixed: use userId from token

    console.log('📝 Feedback Body:', req.body);
    console.log('👤 Mentee ID:', menteeId);

    if (!sessionId || !rating) {
      return res.status(400).json({ message: 'sessionId and rating are required' });
    }

    const feedback = new Feedback({ sessionId, menteeId, rating, comments });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('❌ Error in feedback POST:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ GET: View feedback for a session
router.get('/:sessionId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const feedbacks = await Feedback.find({ sessionId }).populate('menteeId', 'name');

    res.json(feedbacks);
  } catch (error) {
    console.error('❌ Error in feedback GET:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
