import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://imoleayodebbieolumoye:mangoleaf@cluster0.x3cstdv.mongodb.net/mentorship';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Drop the 'users' collection if it exists
    const collections = await db.listCollections().toArray();
    const exists = collections.some(col => col.name === 'users');

    if (exists) {
      await db.dropCollection('users');
      console.log('🗑️ Dropped users collection');
    } else {
      console.log('ℹ️ users collection does not exist');
    }

    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
