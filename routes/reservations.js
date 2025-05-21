const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { isAuthenticated, checkRole } = require('./auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.get('/', (req, res) => {
  res.render('reservations_al', { title: 'Rezervime' });
});

router.get('/tables', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tables/availability', async (req, res) => {
  try {
    const { date, time } = req.query;
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }

    const reservations = await Reservation.find({
      date,
      status: { $ne: 'cancelled' }
    });

    const tables = await Table.find();

    const tablesWithAvailability = tables.map(table => {
      const overlapping = reservations.some(r => {
        return r.tableNumber === table.tableNumber && r.time === time;
      });
      return { ...table.toObject(), status: overlapping ? 'booked' : 'available' };
    });

    res.json(tablesWithAvailability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerName, email, phoneNumber, date, time, guests, specialRequests, tableNumber } = req.body;
    if (!customerName || !email || !phoneNumber || !date || !time || !guests || !tableNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const table = await Table.findOne({ tableNumber });
    if (!table) return res.status(404).json({ message: 'Table not found' });

    const overlapExists = await Reservation.exists({
      tableNumber,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (overlapExists) {
      return res.status(400).json({ message: 'Table already booked for this slot' });
    }

    if (parseInt(guests) > table.capacity) {
      return res.status(400).json({ message: 'Number of guests exceeds table capacity' });
    }

    const reservation = new Reservation({
      customerName,
      email,
      phoneNumber,
      date,
      time,
      guests,
      specialRequests,
      tableNumber
    });

    await reservation.save();

    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Reservation Confirmation',
    //   text: `Hi ${customerName},\n\nYour reservation for ${date} at ${time} for ${guests} guests at Table #${tableNumber} has been confirmed.\n\nSpecial Requests: ${specialRequests}\n\nThank you for choosing our restaurant.`
    // });

    const io = req.app.get('io');
    if (io) {
      io.emit('tableStatusChanged', { tableNumber, status: 'booked', date });
      io.emit('reservationCreated', { reservation: reservation.toObject() });
    }

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    console.error('Reservation creation failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id', isAuthenticated, checkRole(['admin', 'manager', 'host']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!reservation) return res.status(404).json({ message: 'Not found' });

    const io = req.app.get('io');
    if (io) {
      io.emit('reservationUpdated', { reservation });
      if (status === 'cancelled') {
        io.emit('reservationCancelled', { reservationId: reservation._id, tableNumber: reservation.tableNumber });
        io.emit('tableStatusChanged', { tableNumber: reservation.tableNumber, status: 'available' });
      }
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', isAuthenticated, checkRole(['admin', 'manager', 'host']), async (req, res) => {
  try {
    const query = {};
    if (req.query.date) query.date = req.query.date;
    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', isAuthenticated, checkRole(['admin', 'manager']), async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: 'Not found' });

    await Reservation.findByIdAndDelete(id);

    const io = req.app.get('io');
    if (io) {
      io.emit('reservationCancelled', { tableNumber: reservation.tableNumber, reservationId: id });
      io.emit('tableStatusChanged', { tableNumber: reservation.tableNumber, status: 'available' });
    }
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
