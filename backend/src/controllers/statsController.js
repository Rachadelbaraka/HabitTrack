import Habit from '../models/Habit.js';
import Entry from '../models/Entry.js';
import { isDatabaseReady } from '../config/db.js';

const ensureDatabase = (res) => {
  if (!isDatabaseReady()) {
    res.status(503).json({ message: 'Database unavailable. Please use offline mode.' });
    return false;
  }

  return true;
};

const toDayKey = (date) => {
  const clone = new Date(date);
  return clone.toISOString().split('T')[0];
};

const getTrackingKey = (dateValue, frequency = 'daily') => {
  const date = new Date(`${dateValue}T12:00:00`);

  if (frequency === 'weekly') {
    const currentDay = date.getDay() || 7;
    date.setDate(date.getDate() - currentDay + 1);
  }

  return toDayKey(date);
};

const buildDaySnapshot = (habits, dateKey) => {
  const total = habits.length;
  const completed = habits.filter((habit) =>
    habit.completions.some((item) => item.date === getTrackingKey(dateKey, habit.frequency))
  ).length;

  return {
    date: dateKey,
    completed,
    total,
    rate: total ? Math.round((completed / total) * 100) : 0
  };
};

const addDays = (date, amount) => {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
};

export const getStatsOverview = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const habits = await Habit.find({ user: req.user._id }).sort({ order: 1 });
  const journalCount = await Entry.countDocuments({ user: req.user._id });

  const trend = [];
  for (let offset = 29; offset >= 0; offset -= 1) {
    trend.push(buildDaySnapshot(habits, toDayKey(addDays(new Date(), -offset))));
  }

  let streak = 0;
  for (let index = trend.length - 1; index >= 0; index -= 1) {
    if (trend[index].rate === 100 && trend[index].total > 0) {
      streak += 1;
    } else {
      break;
    }
  }

  const completionRate =
    trend.length > 0
      ? Math.round(trend.reduce((sum, item) => sum + item.rate, 0) / trend.length)
      : 0;

  res.json({
    streak,
    completionRate,
    journalCount,
    totalHabits: habits.length,
    trend
  });
};
