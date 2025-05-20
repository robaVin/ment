// scripts/seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all existing users.');

    // Define new users to seed
    const users = [
      { username: 'manager1', password: 'password1', role: 'manager' },
      { username: 'manager2', password: 'password2', role: 'manager' },
      { username: 'manager3', password: 'password3', role: 'manager' },
    ];

    // Save each user (passwords will be hashed by pre-save hook)
    for (const u of users) {
      const user = new User(u);
      await user.save();
      console.log(`Created user: ${u.username}`);
    }

    await mongoose.disconnect();
    console.log('Seeding complete. Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedUsers();
