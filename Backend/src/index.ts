import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import mentorRoutes from './routes/mentor.routes';
import menteeRoutes from './routes/mentee.routes';
import sessionRoutes from './routes/session.routes'; // ✅ Session routes

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true               // Needed if using cookies (optional here)
}));

app.use(express.json()); // To parse JSON request bodies

// ✅ Route registration
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/mentees', menteeRoutes);
app.use('/api/sessions', sessionRoutes); // ✅ Session routes

// ✅ Test route (optional)
app.get('/', (req, res) => {
  res.send('Mentorship API is working!');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
