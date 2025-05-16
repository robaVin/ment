const mongoose = require('mongoose');
const Table = require('../models/Table'); // adjust path if needed
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-atlas-uri-here';

mongoose.connect(MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');

    const tableCount = await Table.countDocuments();
    if (tableCount > 0) {
        console.log('Tables already initialized. Skipping.');
        process.exit(0);
    }

    const tables = Array.from({ length: 9 }).map((_, i) => ({
        name: `Table ${i + 1}`,
        capacity: 4,
        location: "Main Hall"
    }));

    await Table.insertMany(tables);
    console.log("Initial tables created.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
