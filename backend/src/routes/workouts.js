const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

// Start a new workout session
router.post('/start', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
      });
    }

    const { workoutPlan } = req.body;

    if (!workoutPlan || !workoutPlan.exercises || !Array.isArray(workoutPlan.exercises)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout plan data',
      });
    }

    // Create workout log
    const workoutLog = new WorkoutLog({
      userId: req.userId,
      workoutPlan: {
        title: workoutPlan.title,
        description: workoutPlan.description,
        difficulty: workoutPlan.difficulty,
        duration: workoutPlan.duration,
        color: workoutPlan.color,
      },
      exercises: workoutPlan.exercises.map(exercise => ({
        name: exercise,
        completed: false,
      })),
      totalExercises: workoutPlan.exercises.length,
      startedAt: new Date(),
    });

    await workoutLog.save();

    res.status(201).json({
      success: true,
      message: 'Workout session started',
      workoutLogId: workoutLog._id,
      workoutLog,
    });
  } catch (error) {
    console.error('Start workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting workout session',
      error: error.message,
    });
  }
});

// Update exercise completion
router.patch('/exercise/:workoutLogId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
      });
    }

    const { workoutLogId } = req.params;
    const { exerciseIndex, completed } = req.body;

    const workoutLog = await WorkoutLog.findOne({
      _id: workoutLogId,
      userId: req.userId,
    });

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found',
      });
    }

    if (exerciseIndex >= 0 && exerciseIndex < workoutLog.exercises.length) {
      workoutLog.exercises[exerciseIndex].completed = completed !== false;
      
      if (completed !== false) {
        workoutLog.exercises[exerciseIndex].completedAt = new Date();
        workoutLog.completedExercises = workoutLog.exercises.filter(ex => ex.completed).length;
      } else {
        workoutLog.exercises[exerciseIndex].completedAt = null;
        workoutLog.completedExercises = workoutLog.exercises.filter(ex => ex.completed).length;
      }

      // Check if all exercises are completed
      if (workoutLog.completedExercises === workoutLog.totalExercises) {
        workoutLog.isCompleted = true;
        workoutLog.completedAt = new Date();
      }

      await workoutLog.save();

      res.status(200).json({
        success: true,
        message: 'Exercise status updated',
        workoutLog,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid exercise index',
      });
    }
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating exercise',
      error: error.message,
    });
  }
});

// Update workout duration
router.patch('/duration/:workoutLogId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
      });
    }

    const { workoutLogId } = req.params;
    const { duration } = req.body; // duration in seconds

    const workoutLog = await WorkoutLog.findOneAndUpdate(
      {
        _id: workoutLogId,
        userId: req.userId,
      },
      {
        workoutDuration: duration,
      },
      { new: true }
    );

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout duration updated',
      workoutLog,
    });
  } catch (error) {
    console.error('Update duration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating workout duration',
      error: error.message,
    });
  }
});

// Complete workout
router.patch('/complete/:workoutLogId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
      });
    }

    const { workoutLogId } = req.params;
    const { duration } = req.body;

    const workoutLog = await WorkoutLog.findOneAndUpdate(
      {
        _id: workoutLogId,
        userId: req.userId,
      },
      {
        isCompleted: true,
        completedAt: new Date(),
        workoutDuration: duration || 0,
      },
      { new: true }
    );

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Workout completed',
      workoutLog,
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing workout',
      error: error.message,
    });
  }
});

// Get user's workout history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected',
      });
    }

    const workoutLogs = await WorkoutLog.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: workoutLogs.length,
      workoutLogs,
    });
  } catch (error) {
    console.error('Get workout history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching workout history',
      error: error.message,
    });
  }
});

module.exports = router;

