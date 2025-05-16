require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('../models/Table');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant';
console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Table data
const tables = [
    { tableNumber: 1, capacity: 4, location: 'window', status: 'available' },
    { tableNumber: 2, capacity: 4, location: 'window', status: 'available' },
    { tableNumber: 3, capacity: 4, location: 'window', status: 'available' },
    { tableNumber: 4, capacity: 4, location: 'window', status: 'available' },
    { tableNumber: 5, capacity: 6, location: 'center', status: 'available' },
    { tableNumber: 6, capacity: 6, location: 'center', status: 'available' },
    { tableNumber: 7, capacity: 6, location: 'center', status: 'available' },
    { tableNumber: 8, capacity: 6, location: 'center', status: 'available' },
    { tableNumber: 9, capacity: 2, location: 'bar', status: 'available' },
    { tableNumber: 10, capacity: 2, location: 'bar', status: 'available' },
    { tableNumber: 11, capacity: 2, location: 'bar', status: 'available' },
    { tableNumber: 12, capacity: 2, location: 'bar', status: 'available' },
    { tableNumber: 13, capacity: 8, location: 'outdoor', status: 'available' },
    { tableNumber: 14, capacity: 8, location: 'outdoor', status: 'available' },
    { tableNumber: 15, capacity: 8, location: 'outdoor', status: 'available' },
    { tableNumber: 16, capacity: 8, location: 'outdoor', status: 'available' }
];

async function initTables() {
    try {
        // Clear existing tables
        console.log('Clearing existing tables...');
        await Table.deleteMany({});
        console.log('Cleared existing tables');

        // Create new tables
        console.log('Creating new tables...');
        for (const tableData of tables) {
            try {
                const table = new Table(tableData);
                await table.save();
                console.log(`Created table ${table.tableNumber}`);
            } catch (tableError) {
                console.error(`Error creating table ${tableData.tableNumber}:`, tableError);
            }
        }

        console.log('All tables created successfully');
    } catch (error) {
        console.error('Error initializing tables:', error);
        if (error.name === 'MongoError') {
            console.error('MongoDB Error:', error.message);
        }
    } finally {
        mongoose.connection.close();
    }
}

initTables(); 