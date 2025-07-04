import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User'; // Adjust path if different

dotenv.config();

async function createMentor() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');

    // Check if mentor user already exists
    const existingMentor = await User.findOne({ email: 'mentor.test@example.com' });
    if (existingMentor) {
      console.log('Mentor user already exists');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('MentorPass123', 10);

    // Create new mentor user
    const mentorUser = new User({
      name: 'Mentor Test',
      email: 'mentor.test@example.com',
      password: hashedPassword,
      role: 'mentor',
    });

    await mentorUser.save();

    console.log('Mentor user created successfully!');
    console.log('Email: mentor.test@example.com');
    console.log('Password: MentorPass123');

    process.exit(0);
  } catch (error) {
    console.error('Error creating mentor user:', error);
    process.exit(1);
  }
}

createMentor();
