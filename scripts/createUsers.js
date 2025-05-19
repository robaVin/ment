require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path if needed

const MONGODB_URI = process.env.MONGODB_URI;

async function createUsers() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing users with these usernames to avoid duplicates
    const usernames = ['admin1', 'admin2', 'admin3', 'manager1', 'manager2', 'manager3', 'host1', 'host2', 'host3'];
    await User.deleteMany({ username: { $in: usernames } });

    // Prepare users to insert
    const users = [
      { username: 'admin1', email: process.env.ADMIN1_EMAIL, password: process.env.ADMIN1_PASSWORD, role: 'admin' },
      { username: 'admin2', email: process.env.ADMIN2_EMAIL, password: process.env.ADMIN2_PASSWORD, role: 'admin' },
      { username: 'admin3', email: process.env.ADMIN3_EMAIL, password: process.env.ADMIN3_PASSWORD, role: 'admin' },
      { username: 'manager1', email: process.env.MANAGER1_EMAIL, password: process.env.MANAGER1_PASSWORD, role: 'manager' },
      { username: 'manager2', email: process.env.MANAGER2_EMAIL, password: process.env.MANAGER2_PASSWORD, role: 'manager' },
      { username: 'manager3', email: process.env.MANAGER3_EMAIL, password: process.env.MANAGER3_PASSWORD, role: 'manager' },
      { username: 'host1', email: process.env.HOST1_EMAIL, password: process.env.HOST1_PASSWORD, role: 'host' },
      { username: 'host2', email: process.env.HOST2_EMAIL, password: process.env.HOST2_PASSWORD, role: 'host' },
      { username: 'host3', email: process.env.HOST3_EMAIL, password: process.env.HOST3_PASSWORD, role: 'host' }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      await user.save();
      console.log(`Created user: ${user.username} with role ${user.role}`);
    }

    console.log('All users created successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating users:', error);
  }
}

createUsers();
