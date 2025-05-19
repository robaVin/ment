const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

// Middleware to check role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.session.user.role)) {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  };
};

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Login handler
router.post('/login', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    console.log('Login attempt:', { username, email, userType });

    if (!username || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Find user by username and role
    const user = await User.findOne({ username, role: userType });
    if (!user) {
      console.error('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  console.log('Password from DB:', user.password);
console.log('Input password:', password);
const isMatch = await bcrypt.compare(password, user.password);
console.log('Password match:', isMatch);

    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        res.redirect('/dashboard/admin');
        break;
      case 'manager':
        res.redirect('/dashboard/manager');
        break;
      case 'host':
        res.redirect('/dashboard/hoster');
        break;
      default:
        res.redirect('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Clear all cookies
    res.clearCookie('connect.sid');
    // Set cache control headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.redirect('/');
  });
});

// POST logout handler
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    // Clear all cookies
    res.clearCookie('connect.sid');
    // Set cache control headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.redirect('/');
  });
});

// Export both router and middleware
module.exports = {
  router,
  isAuthenticated,
  checkRole
};
