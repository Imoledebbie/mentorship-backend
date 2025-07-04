import express, { Request, Response } from 'express';
import User from '../models/User';
import authenticate from '../middleware/auth.middleware';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// GET user profile (protected)
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT update user profile (protected)
router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' });
    }

    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
