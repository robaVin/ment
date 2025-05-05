require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const i18n = require('i18n');

// Performance middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
}));


i18n.configure({
  locales: ['en', 'sq'], // languages available
  directory: __dirname + '/locales', // where your files are
  defaultLocale: 'sq', // default language
  cookie: 'lang', // save language preference in cookie
});

app.use(i18n.init);



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
const authRoutes = require('./routes/auth');

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', authRoutes.router);
app.use('/menu', require('./routes/menu'));
app.use('/reservations', require('./routes/reservations'));
app.use('/dashboard', require('./routes/dashboard'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle table status updates
  socket.on('tableStatusChanged', (data) => {
    console.log('Broadcasting table status change:', data);
    io.emit('tableStatusChanged', data);
  });

  socket.on('reservationCreated', (data) => {
    console.log('Broadcasting reservation created:', data);
    io.emit('reservationCreated', data);
  });

  socket.on('reservationCancelled', (data) => {
    console.log('Broadcasting reservation cancelled:', data);
    io.emit('reservationCancelled', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Attach io to app for use in routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  
  if (req.xhr || req.headers.accept.includes('application/json')) {
    res.status(500).json({ 
      error: 'Server Error',
      message: err.message || 'An unexpected error occurred'
    });
  } else {
    res.status(500).render('error', { 
      message: 'An error occurred while processing your request',
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
});

app.get('/lang/:locale', (req, res) => {
  const locale = req.params.locale;
  res.cookie('lang', locale, { maxAge: 900000, httpOnly: true });
  res.setLocale(locale);
  res.redirect('back'); // Redirect back to previous page
});


// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 