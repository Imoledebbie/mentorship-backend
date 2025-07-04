import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://imoleayodebbieolumoye:mangoleaf@cluster0.x3cstdv.mongodb.net/mentorship';

(async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = conn.connection.db;

    const indexes = await db.collection('users').indexes();
    console.log('📋 Existing Indexes:', indexes);

    // Drop the email index if it exists
    const hasEmailIndex = indexes.find((idx) => idx.name === 'email_1');

    if (hasEmailIndex) {
      await db.collection('users').dropIndex('email_1');
      console.log('🗑️ Dropped email_1 index');
    } else {
      console.log('ℹ️ No email_1 index to drop');
    }

    process.exit();
  } catch (error) {
    console.error('❌ Error dropping index:', error);
    process.exit(1);
  }
})();
