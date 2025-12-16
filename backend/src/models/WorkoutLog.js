const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  workoutPlan: {
    title: {
      type: String,
      required: true,
    },
    description: String,
    difficulty: String,
    duration: String,
    color: String,
  },
  exercises: [{
    name: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  }],
  completedExercises: {
    type: Number,
    default: 0,
  },
  totalExercises: {
    type: Number,
    required: true,
  },
  workoutDuration: {
    type: Number, // in seconds
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

// Index for faster queries
workoutLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);

