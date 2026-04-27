const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./utils/logger');
const { connectMongoDB } = require('./db/mongo');
const { connectRedis } = require('./db/redis');

const chatRoutes = require('./routes/chat');
const electionRoutes = require('./routes/election');
const agentRoutes = require('./routes/agents');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier deployment of external scripts/styles
}));
app.use(cors()); // Allow all origins for the API in production

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip, 
    userAgent: req.get('user-agent') 
  });
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/agents', agentRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

// Health check with DB status
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    databases: dbStatus
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  // For any request that doesn't match an API route, send back index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

// Connection status tracking
let dbStatus = { mongo: 'connecting', redis: 'connecting' };

async function connectDatabases() {
  try {
    await connectMongoDB();
    dbStatus.mongo = 'connected';
    logger.info('MongoDB connected successfully');
  } catch (error) {
    dbStatus.mongo = 'failed';
    logger.error('MongoDB connection failed', { error: error.message });
  }
  
  try {
    await connectRedis();
    dbStatus.redis = 'connected';
    logger.info('Redis connected successfully');
  } catch (error) {
    dbStatus.redis = 'failed';
    logger.error('Redis connection failed', { error: error.message });
  }
}

// Start HTTP server immediately
console.log(`[DEBUG] Starting server on port ${PORT}...`);
const server = app.listen(PORT, () => {
  console.log(`[DEBUG] Server is now listening on port ${PORT}`);
  logger.info(`Server running on port ${PORT}`);
  logger.info('Multi-Agent Election Education System is starting...');
});

server.on('error', (err) => {
  console.error('[DEBUG] Server error:', err.message);
});

// Connect to databases in background
console.log('[DEBUG] Connecting to databases...');
connectDatabases().then(() => {
  console.log('[DEBUG] Database connections attempted');
  logger.info('Database connections attempted');
}).catch(err => {
  console.error('[DEBUG] Database connection error:', err.message);
});
