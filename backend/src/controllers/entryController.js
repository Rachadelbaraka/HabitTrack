import Entry from '../models/Entry.js';
import { isDatabaseReady } from '../config/db.js';

const ensureDatabase = (res) => {
  if (!isDatabaseReady()) {
    res.status(503).json({ message: 'Database unavailable. Please use offline mode.' });
    return false;
  }

  return true;
};

export const getEntryByDate = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const entry = await Entry.findOne({ user: req.user._id, date: req.params.date });

  res.json(
    entry || {
      date: req.params.date,
      content: '',
      mood: 'reflective'
    }
  );
};

export const upsertEntry = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const entry = await Entry.findOneAndUpdate(
    {
      user: req.user._id,
      date: req.params.date
    },
    {
      content: req.body.content || '',
      mood: req.body.mood || 'reflective'
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  res.json(entry);
};

export const getEntries = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { month, start, end } = req.query;
  const query = { user: req.user._id };

  if (month) {
    query.date = new RegExp(`^${month}`);
  } else if (start && end) {
    query.date = { $gte: start, $lte: end };
  }

  const entries = await Entry.find(query).sort({ date: 1 });
  const byDate = Object.fromEntries(entries.map((entry) => [entry.date, entry]));

  res.json(byDate);
};
