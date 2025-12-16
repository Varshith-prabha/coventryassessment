const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const workoutsRouter = require('./routes/workouts');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'Gym beginner API is running' });
});

async function startServer() {
  // Start server even if MongoDB connection fails initially
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log('⚠️  Attempting to connect to MongoDB...');
    
    // Try to connect to MongoDB
    connectDB().catch(err => {
      console.error('❌ MongoDB connection failed:', err.message);
      console.error('⚠️  Server is running but database operations will fail until MongoDB is started');
    });
  });
}

startServer();

