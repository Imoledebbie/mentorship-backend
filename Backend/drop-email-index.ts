import mongoose from 'mongoose';
import User from './src/models/user';

mongoose.connect('mongodb+srv://imoleayodebbieolumoye:mangoleaf@cluster0.x3cstdv.mongodb.net/mentorship')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await User.collection.dropIndex('email_1');
    console.log('✅ Dropped email index');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
