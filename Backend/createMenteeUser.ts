import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

async function createMentee() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');

    const existingMentee = await User.findOne({ email: 'mentee.test@example.com' });
    if (existingMentee) {
      console.log('Mentee user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('MenteePass123', 10);

    const menteeUser = new User({
      name: 'Mentee Test',
      email: 'mentee.test@example.com',
      password: hashedPassword,
      role: 'mentee',
    });

    await menteeUser.save();

    console.log('Mentee user created successfully!');
    console.log('Email: mentee.test@example.com');
    console.log('Password: MenteePass123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating mentee user:', error);
    process.exit(1);
  }
}

createMentee();
