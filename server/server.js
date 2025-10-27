import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';
import passport from 'passport';
import session from 'express-session';

dotenv.config();

// Environment Variables Debug
console.log('\n🔐 Environment Variables Debug:');
console.log('================================');
console.log('✓ PORT:', process.env.PORT);
console.log('✓ NODE_ENV:', process.env.NODE_ENV);
console.log('✓ CLIENT_URL:', process.env.CLIENT_URL);
console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Present' : '❌ Missing');
console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? '✅ Present' : '❌ Missing');
console.log('✓ GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');

// Add Amadeus debug
console.log('✓ AMADEUS_CLIENT_ID:', process.env.AMADEUS_CLIENT_ID ? '✅ Present' : '❌ Missing');
console.log('✓ AMADEUS_CLIENT_SECRET:', process.env.AMADEUS_CLIENT_SECRET ? '✅ Present' : '❌ Missing');
console.log('✓ AMADEUS_HOSTNAME:', process.env.AMADEUS_HOSTNAME || 'test');

if (process.env.AMADEUS_CLIENT_ID) {
  console.log('  - Client ID starts with:', process.env.AMADEUS_CLIENT_ID.substring(0, 10) + '...');
  console.log('  - Client ID length:', process.env.AMADEUS_CLIENT_ID.length);
} else {
  console.log('  ❌ AMADEUS_CLIENT_ID IS NOT LOADED!');
}

if (process.env.GEMINI_API_KEY) {
  console.log('  - Gemini Key starts with:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  console.log('  - Key length:', process.env.GEMINI_API_KEY.length);
  console.log('  - Key format valid:', process.env.GEMINI_API_KEY.startsWith('AIza') ? '✅ Yes' : '❌ No');
} else {
  console.log('  ❌ GEMINI_API_KEY IS NOT LOADED!');
  console.log('  📍 Check if .env file exists in the server directory');
}
console.log('================================\n');


// Import configs
import { connectDatabase } from './src/config/database.js';
import { configurePassport } from './src/config/passport.js';

// Import middleware
import { apiLimiter } from './src/middleware/rateLimiter.js';
import { handleError } from './src/utils/errorHandler.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import tripRoutes from './src/routes/trip.routes.js';
import destinationRoutes from './src/routes/destination.routes.js';
import activityRoutes from './src/routes/activity.routes.js';
import hotelRoutes from './src/routes/hotel.routes.js';
import aiRoutes from './src/routes/ai.routes.js';
import budgetRoutes from './src/routes/budget.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import weatherRoutes from './src/routes/weather.routes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Connect to Database
connectDatabase();

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('join-trip', (tripId) => {
    socket.join(tripId);
    console.log(`User joined trip room: ${tripId}`);
  });

  socket.on('leave-trip', (tripId) => {
    socket.leave(tripId);
    console.log(`User left trip room: ${tripId}`);
  });

  socket.on('trip-update', (data) => {
    socket.to(data.tripId).emit('trip-updated', data);
  });

  socket.on('activity-added', (data) => {
    socket.to(data.tripId).emit('activity-updated', data);
  });

  socket.on('budget-update', (data) => {
    socket.to(data.tripId).emit('budget-updated', data);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// API rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Travel Planner API is running',
    timestamp: new Date().toISOString(),
    environment: {
      node: process.version,
      platform: process.platform,
      geminiApiConfigured: !!process.env.GEMINI_API_KEY
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use(handleError);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL}`);
});
