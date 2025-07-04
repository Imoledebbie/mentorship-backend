import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log('MONGO_URI:', mongoURI);  // DEBUG: Check what's read
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined');
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
