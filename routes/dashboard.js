const express = require('express');
const router = express.Router();
const { isAuthenticated, checkRole } = require('./auth');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Middleware to prevent caching
const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

// Apply noCache middleware to all dashboard routes
router.use(noCache);

// Admin Dashboard
router.get('/admin', isAuthenticated, checkRole(['admin']), async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        const tables = await Table.find();
        res.render('dashboard/admin', { 
            title: 'Admin Dashboard',
            reservations,
            tables,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Manager Dashboard
router.get('/manager', isAuthenticated, checkRole(['admin', 'manager']), async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        const tables = await Table.find();
        res.render('dashboard/manager', { 
            title: 'Manager Dashboard',
            reservations,
            tables,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Host Dashboard
router.get('/host', isAuthenticated, checkRole(['host']), async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        const tables = await Table.find();
        res.render('dashboard/host', { 
            title: 'Host Dashboard',
            reservations,
            tables,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Redirect to appropriate dashboard based on role
router.get('/', isAuthenticated, (req, res) => {
    const role = req.session.user.role;
    res.redirect(`/dashboard/${role}`);
});

// Hoster dashboard
router.get('/hoster', isAuthenticated, checkRole(['host']), (req, res) => {
    res.render('dashboard/hoster', { 
        title: 'Hoster Dashboard',
        user: req.session.user
    });
});

// Manager reservations page
router.get('/manager/reservations', isAuthenticated, checkRole(['admin', 'manager']), (req, res) => {
    res.render('dashboard/manager/reservations', { title: 'Manage Reservations' });
});

module.exports = router; 