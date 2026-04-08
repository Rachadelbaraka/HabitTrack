import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    content: {
      type: String,
      default: ''
    },
    mood: {
      type: String,
      default: 'reflective'
    }
  },
  {
    timestamps: true
  }
);

entrySchema.index({ user: 1, date: 1 }, { unique: true });

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
