const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const projects = require('./routes/projects');
const skills = require('./routes/skills');
const services = require('./routes/services');
const timeline = require('./routes/timeline');
const about = require('./routes/about');
const contact = require('./routes/contact');
const auth = require('./routes/auth');
const dashboard = require('./routes/dashboard');
const cv = require('./routes/cv');
const settings = require('./routes/settings');
const approach = require('./routes/approach');
const upload = require('./routes/upload');

const app = express();

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Enable CORS - allow common local dev origins and env-configured origin
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Allow exact matches from allowedOrigins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow all Vercel preview/prod subdomains (e.g., https://*.vercel.app)
    try {
      const { hostname } = new URL(origin);
      if (hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (_) {}

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Compression middleware
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Stricter rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: 'Too many contact form submissions, please try again later.',
});

// Mount routers
app.use('/api/projects', projects);
app.use('/api/skills', skills);
app.use('/api/services', services);
app.use('/api/timeline', timeline);
app.use('/api/about', about);
app.use('/api/approach', approach);
app.use('/api/contact', contactLimiter, contact);
app.use('/api/auth', auth);
app.use('/api/dashboard', dashboard);
app.use('/api/cv', cv);
app.use('/api/settings', settings);
app.use('/api/upload', upload);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      skills: '/api/skills',
      services: '/api/services',
      timeline: '/api/timeline',
      about: '/api/about',
      contact: '/api/contact',
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      cv: '/api/cv',
      health: '/api/health'
    }
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;

