const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Home page
router.get('/', (req, res) => {
  res.render('homepage_al', { title: 'Ballina' });
});

// About page
router.get('/about', (req, res) => {
  res.render('aboutUs_al', { title: 'Për ne' });
});

// Gallery page
router.get('/gallery', (req, res) => {
  const imagesDir = path.join(__dirname, '..', 'public', 'pictures', 'test');
  const images = fs.readdirSync(imagesDir);
  res.render('photos', { title: 'Galeria', images });
});

// English routes
router.get('/en', (req, res) => {
  res.render('homepage', { title: 'Home' });
});

router.get('/en/reservations', (req, res) => {
  res.render('reservations', { title: 'Reservations' });
});

router.get('/en/about', (req, res) => {
  res.render('aboutUs', { title: 'About us' });
});
module.exports = router;
