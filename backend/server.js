const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
// CORS - Allow multiple origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://sukumarbeverages.netlify.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Sukumar Beverages API is running!',
    status: 'OK',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      billing: '/api/billing',
      referral: '/api/referral',
      admin: '/api/admin',
      chatbot: '/api/chatbot',
    }
  });
});

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/billing',  require('./routes/billing'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/chatbot',  require('./routes/chatbot'));

// MongoDB Connection
let mongoServer;
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ Atlas Connection Error:', err.message);
    console.log('⚠️ Falling back to In-Memory MongoDB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to In-Memory MongoDB (Data will reset on restart)');
    } catch (memErr) {
      console.error('❌ Failed to start In-Memory MongoDB:', memErr.message);
    }
  }
}
connectDB().then(() => {
  require('./utils/seedAdmin')();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
