require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const teamRoutes = require('./routes/team');
const uploadRoutes = require('./routes/upload');

// Initialize app
const app = express();

// ==================== PROXY SETTINGS ====================

// Trust proxy - Required for rate limiting to work correctly behind a reverse proxy (e.g., Render, Heroku, AWS)
// This allows Express to read the X-Forwarded-For header sent by the proxy
app.set('trust proxy', 1);

// ==================== SECURITY MIDDLEWARE ====================

// Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'https://res.cloudinary.com', 'http://localhost:5000'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'http://localhost:5000', 'http://localhost:3000', 'https://bee-5veq.vercel.app'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// CORS - Restricted origin (not allow all)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600 // 10 minutes
};
app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== RATE LIMITING ====================

// General rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Trop de demandes, veuillez réessayer plus tard',
    messageEn: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health' // Don't rate limit health checks
});
app.use(generalLimiter);

// Strict rate limiter for auth endpoints - 50 requests per 15 minutes (for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Trop de tentatives, veuillez réessayer dans 15 minutes',
    messageEn: 'Too many attempts, please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Upload rate limiter - 10 requests per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Limite de téléchargement atteinte, veuillez réessayer plus tard',
    messageEn: 'Upload limit reached, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ==================== TEMP UPLOADS DIRECTORY ====================

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Répertoire uploads créé');
}

// Create temp uploads directory if it doesn't exist
const tempUploadDir = path.join(__dirname, 'temp-uploads');
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
  console.log('✓ Répertoire temp-uploads créé');
}

// ==================== DATABASE CONNECTION ====================

// MongoDB Connection with error handling
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bees', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => {
    console.log('MongoDB connecté avec succès');
  })
  .catch(err => {
    console.error('Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });

// MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB déconnecté, tentative de reconnexion...');
});

mongoose.connection.on('error', (err) => {
  console.error('Erreur MongoDB:', err.message);
});

// ==================== STATIC FILES ====================

// Serve uploads directory as static files with explicit CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  etag: false
}));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.json(healthcheck);
});

// Apply strict rate limiter to auth routes
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/team', teamRoutes);

// Upload routes with upload limiter
app.use('/api/upload', uploadLimiter, uploadRoutes);

// ==================== 404 HANDLING ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ressource non trouvée',
    messageEn: 'Resource not found',
    path: req.path,
    method: req.method
  });
});

// ==================== ERROR HANDLING MIDDLEWARE ====================

// Multer error handling
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Fichier trop volumineux',
      messageEn: 'File too large',
      maxSize: '5MB'
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message: 'Trop de fichiers',
      messageEn: 'Too many files',
      maxFiles: 10
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Erreur JSON invalide',
      messageEn: 'Invalid JSON',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  if (err.message === 'CORS not allowed') {
    return res.status(403).json({
      success: false,
      message: 'Origine non autorisée',
      messageEn: 'Origin not allowed'
    });
  }

  next(err);
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle different error types
  const statusCode = err.statusCode || err.status || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
    messageEn: 'Internal server error',
    ...(isDevelopment && { stack: err.stack, details: err.details }),
    timestamp: new Date().toISOString(),
    requestId: req.id // If request ID middleware is added
  });
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  ========================================
  Serveur en cours d'exécution sur le port ${PORT}
  Environnement: ${process.env.NODE_ENV || 'development'}
  ========================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt gracieux...');
  server.close(() => {
    console.log('Serveur fermé');
    mongoose.connection.close(false, () => {
      console.log('Connexion MongoDB fermée');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt gracieux...');
  server.close(() => {
    console.log('Serveur fermé');
    mongoose.connection.close(false, () => {
      console.log('Connexion MongoDB fermée');
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Exception non interceptée:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesse rejetée non gérée:', reason);
});

module.exports = app;
