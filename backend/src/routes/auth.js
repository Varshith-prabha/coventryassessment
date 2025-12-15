const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', dbState); // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (dbState !== 1) {
      console.error('MongoDB is not connected. State:', dbState);
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please make sure MongoDB is running and restart the backend server.',
        dbState: dbState,
      });
    }

    console.log('Registration request received:', { 
      name: req.body.name, 
      email: req.body.email, 
      age: req.body.age,
      hasPassword: !!req.body.password 
    });

    const { name, email, password, age, fitnessLevel } = req.body;

    // Validation
    if (!name || !email || !password || !age) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Validate age is a number
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Age must be a valid number between 13 and 100',
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      age: ageNum,
      fitnessLevel: fitnessLevel || 'beginner',
    });

    try {
      await user.save();
      console.log('User saved successfully:', user.email);
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      throw saveError;
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000 || error.code === 11001) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError' || error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please check if MongoDB is running and restart the backend server.',
        error: error.message,
        errorName: error.name,
      });
    }

    // Handle connection state errors
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. MongoDB connection state: ' + mongoose.connection.readyState,
        error: 'Please make sure MongoDB is running and restart the backend server',
      });
    }

    // Handle bcrypt errors
    if (error.message && error.message.includes('bcrypt')) {
      return res.status(500).json({
        success: false,
        message: 'Password encryption error',
        error: 'Unable to process password',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message || 'Unknown error occurred',
      errorType: error.name || 'Unknown',
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again later.',
      });
    }

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message || 'Unknown error occurred',
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please try again later.',
      });
    }

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message || 'Unknown error occurred',
    });
  }
});

module.exports = router;

