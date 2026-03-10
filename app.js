const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected on every serverless invocation
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MedHa Clinic Backend API' });
});

app.use('/api/auth', require('./routes/userroutes'));
app.use('/api/auth', require('./routes/dailyimmunity'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;
