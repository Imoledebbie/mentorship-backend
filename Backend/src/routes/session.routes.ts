import express from 'express';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Session from '../models/Session';
import User from '../models/User';
import authenticate from '../middleware/auth.middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// POST /api/sessions – Book a new session with validation
router.post(
  '/',
  authenticate,
  [
    body('mentorId').isMongoId().withMessage('Valid mentorId is required'),
    body('date').isISO8601().toDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('notes').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { mentorId, date, time, topic, notes } = req.body;
      const menteeId = req.user?.userId;

      if (!menteeId) {
        return res.status(401).json({ message: 'Unauthorized: No user info' });
      }

      const mentor = await User.findById(mentorId);
      if (!mentor || mentor.role !== 'mentor') {
        return res.status(400).json({ message: 'Invalid mentor selected' });
      }

      const session = await Session.create({
        mentor: mentorId,
        mentee: menteeId,
        date,
        time,
        topic,
        notes,
      });

      res.status(201).json({
        message: 'Session booked successfully',
        session,
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to book session', error });
    }
  }
);

// ✅ UPDATED: GET /api/sessions – Now includes admin access
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    let sessions;

    if (userRole === 'admin') {
      sessions = await Session.find()
        .populate('mentor', 'name email')
        .populate('mentee', 'name email');
    } else if (userRole === 'mentor') {
      sessions = await Session.find({ mentor: userId }).populate('mentee', 'name email');
    } else if (userRole === 'mentee') {
      sessions = await Session.find({ mentee: userId }).populate('mentor', 'name email');
    } else {
      return res.status(403).json({ message: 'Forbidden: Unknown role' });
    }

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve sessions', error });
  }
});

// GET /api/sessions/:id – Get specific session
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.userId;

    const session = await Session.findById(sessionId)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (
      session.mentor._id.toString() !== userId &&
      session.mentee._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Access denied: Not your session' });
    }

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve session', error });
  }
});

// PUT /api/sessions/:id – Approve/reject session (mentor only)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const { status } = req.body;

    if (userRole !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can update session status' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "approved" or "rejected".' });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.mentor.toString() !== userId) {
      return res.status(403).json({ message: 'You can only update your own session' });
    }

    session.status = status;
    await session.save();

    res.status(200).json({
      message: `Session ${status} successfully`,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update session', error });
  }
});

export default router;
