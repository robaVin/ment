require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Account data
const accounts = [
    // Admin accounts
    {
        username: 'admin1',
        email: 'admin1@restaurant.com',
        password: 'Admin123!',
        role: 'admin'
    },
    {
        username: 'admin2',
        email: 'admin2@restaurant.com',
        password: 'Admin456!',
        role: 'admin'
    },
    {
        username: 'admin3',
        email: 'admin3@restaurant.com',
        password: 'Admin789!',
        role: 'admin'
    },
    // Manager accounts
    {
        username: 'manager1',
        email: 'manager1@restaurant.com',
        password: 'Manager123!',
        role: 'manager'
    },
    {
        username: 'manager2',
        email: 'manager2@restaurant.com',
        password: 'Manager456!',
        role: 'manager'
    },
    {
        username: 'manager3',
        email: 'manager3@restaurant.com',
        password: 'Manager789!',
        role: 'manager'
    },
    // Hoster accounts
    {
        username: 'host1',
        email: 'host1@restaurant.com',
        password: 'Host123!',
        role: 'host'
    },
    {
        username: 'host2',
        email: 'host2@restaurant.com',
        password: 'Host456!',
        role: 'host'
    },
    {
        username: 'host3',
        email: 'host3@restaurant.com',
        password: 'Host789!',
        role: 'host'
    }
];

async function createAccounts() {
    try {
        // Clear existing accounts
        await User.deleteMany({ role: { $in: ['admin', 'manager', 'host'] } });
        console.log('Cleared existing accounts');

        // Create new accounts
        for (const account of accounts) {
            const user = new User({
                username: account.username,
                email: account.email,
                password: account.password, // Let the User model handle password hashing
                role: account.role
            });
            await user.save();
            console.log(`Created account for ${account.username}`);
        }

        console.log('All accounts created successfully');
    } catch (error) {
        console.error('Error creating accounts:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAccounts(); 
