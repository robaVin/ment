// File: routes/dashboard.js
const express = require('express');
const router = express.Router();
const requireManager = require('../middleware/requireManager');

router.get('/manager', requireManager, (req, res) => {
  res.render('manager', { user: req.oidc.user });
});

router.get('/manager/reservations', requireManager, (req, res) => {
  res.render('reservations', { user: req.oidc.user });
});

module.exports = router;
