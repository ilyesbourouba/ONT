require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const activitiesRoutes = require('./routes/activitiesRoutes');
const unescoRoutes = require('./routes/unescoRoutes');
const destinationsRoutes = require('./routes/destinationsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const virtualTourRoutes = require('./routes/virtualTourRoutes');
const translationsRoutes = require('./routes/translationsRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ===================
// MIDDLEWARE
// ===================

// CORS - Allow frontend and admin requests
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from public and uploads
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================
// API ROUTES
// ===================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ONT Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/unesco', unescoRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/virtual-tours', virtualTourRoutes);
app.use('/api/translations', translationsRoutes);

// ===================
// ERROR HANDLING
// ===================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// ===================
// START SERVER
// ===================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     ONT Backend API Server Started        ║
╠═══════════════════════════════════════════╣
║  Port: ${PORT}                               ║
║  Mode: ${process.env.NODE_ENV || 'development'}                      ║
║  API:  http://localhost:${PORT}/api          ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
