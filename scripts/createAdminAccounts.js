require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Database connection
mongoose.connect(process.env.MONGODB_URI);

const accounts = [
    // Admin accounts
    {
        email: process.env.ADMIN1_EMAIL,
        username: 'admin1',
        password: process.env.ADMIN1_PASSWORD,
        role: 'admin'
    },
    {
        email: process.env.ADMIN2_EMAIL,
        username: 'admin2',
        password: process.env.ADMIN2_PASSWORD,
        role: 'admin'
    },
    {
        email: process.env.ADMIN3_EMAIL,
        username: 'admin3',
        password: process.env.ADMIN3_PASSWORD,
        role: 'admin'
    },
    // Manager accounts
    {
        email: process.env.MANAGER1_EMAIL,
        username: 'manager1',
        password: process.env.MANAGER1_PASSWORD,
        role: 'manager'
    },
    {
        email: process.env.MANAGER2_EMAIL,
        username: 'manager2',
        password: process.env.MANAGER2_PASSWORD,
        role: 'manager'
    },
    {
        email: process.env.MANAGER3_EMAIL,
        username: 'manager3',
        password: process.env.MANAGER3_PASSWORD,
        role: 'manager'
    },
    // Hoster accounts
    {
        email: process.env.HOST1_EMAIL,
        username: 'host1',
        password: process.env.HOST1_PASSWORD,
        role: 'host'
    },
    {
        email: process.env.HOST2_EMAIL,
        username: 'host2',
        password: process.env.HOST2_PASSWORD,
        role: 'host'
    },
    {
        email: process.env.HOST3_EMAIL,
        username: 'host3',
        password: process.env.HOST3_PASSWORD,
        role: 'host'
    }
];

async function createAccounts() {
    try {
        // Clear existing admin, manager, and hoster accounts
        await User.deleteMany({ role: { $in: ['admin', 'manager', 'hoster'] } });
        console.log('Cleared existing admin, manager, and hoster accounts');

        // Create new accounts
        for (const account of accounts) {
            if (!account.email || !account.password || !account.username) {
                console.error('Missing required fields for an account');
                continue;
            }
            
            const hashedPassword = await bcrypt.hash(account.password, 10);
            const user = new User({
                email: account.email,
                username: account.username,
                password: hashedPassword,
                role: account.role
            });
            await user.save();
            console.log(`Created ${account.role} account: ${account.email}`);
        }

        console.log('All accounts created successfully');
    } catch (error) {
        console.error('Error creating accounts:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAccounts(); 