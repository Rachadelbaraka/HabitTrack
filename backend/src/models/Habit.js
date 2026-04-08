import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      default: '✨'
    },
    color: {
      type: String,
      default: '#8b5cf6'
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily'
    },
    reminderTime: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    completions: {
      type: [completionSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
