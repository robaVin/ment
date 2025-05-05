const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'occupied'],
    default: 'available'
  },
  location: {
    type: String,
    enum: ['window', 'center', 'bar', 'outdoor'],
    required: true
  }
});

module.exports = mongoose.model('Table', tableSchema); 