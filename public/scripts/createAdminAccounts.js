const mongoose = require('mongoose');
const User = require('../models/User'); // adjust path if needed
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-atlas-uri-here';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');

    const existingAdmins = await User.findOne({ role: 'admin' });
    if (existingAdmins) {
        console.log('Admin accounts already exist. Skipping creation.');
        process.exit(0);
    }

    const users = [
        {
            name: "Admin",
            email: "admin@admin.com",
            password: "admin123",
            role: "admin"
        },
        {
            name: "Hoster",
            email: "host@host.com",
            password: "host123",
            role: "host"
        },
        {
            name: "Manager",
            email: "manager@manager.com",
            password: "manager123",
            role: "manager"
        }
    ];

    await User.insertMany(users);
    console.log("Initial accounts created.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
