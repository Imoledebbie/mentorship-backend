import mongoose from 'mongoose';

export type UserRole = 'admin' | 'mentor' | 'mentee';

interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  goals?: string;

  // Mentor-specific
  expertise?: string[];
  availability?: string;
  experience?: string;

  // Mentee-specific
  interests?: string[];
  learningStyle?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'mentor', 'mentee'], required: true },
  bio: String,
  skills: [String],
  goals: String,

  // Mentor-specific fields
  expertise: [String],
  availability: String,
  experience: String,

  // Mentee-specific fields
  interests: [String],
  learningStyle: String,
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
