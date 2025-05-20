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
const logger = require('morgan');
const { auth } = require('express-openid-connect');
const i18n = require('i18n');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Auth0 Configuration
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
};

app.use(auth(authConfig));

// Middleware
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));

i18n.configure({
  locales: ['en', 'sq'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'sq',
  cookie: 'lang',
});
app.use(i18n.init);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// EJS Setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Expose user data to views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  res.locals.user = req.oidc.user;
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const dashboardRoutes = require('./routes/dashboard');
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/menu', require('./routes/menu'));
app.use('/reservations', require('./routes/reservations'));

// Socket.io Events
io.on('connection', (socket) => {
  console.log('A user connected');

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

app.set('io', io);

// Error Handler
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

// Locale Switching
app.get('/lang/:locale', (req, res) => {
  const locale = req.params.locale;
  res.cookie('lang', locale, { maxAge: 900000, httpOnly: true });
  res.setLocale(locale);
  res.redirect('back');
});

// 404 Handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).send('Page not found');
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
