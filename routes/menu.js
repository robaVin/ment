const express = require('express');
const router = express.Router();

// Menu page
router.get('/', (req, res) => {
  res.render('menu', { title: 'Menu' });
});

module.exports = router;