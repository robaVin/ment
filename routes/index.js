const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('homepage', { title: 'Homepage' });
});

// About page
router.get('/about', (req, res) => {
  res.render('aboutUs', { title: 'About Us' });
});



// Albanian routes
router.get('/al', (req, res) => {
  res.render('homepage_al', { title: 'Ballina' });
});

router.get('/al/reservations', (req, res) => {
  res.render('reservations_al', { title: 'Rezervime' });
});

router.get('/al/about', (req, res) => {
  res.render('aboutUs_al', { title: 'Per ne' });
});
module.exports = router;
