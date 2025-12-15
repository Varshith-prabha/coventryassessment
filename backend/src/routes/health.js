const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: {
      state: dbState,
      status: dbStates[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
});

module.exports = router;

