import Habit from '../models/Habit.js';
import { isDatabaseReady } from '../config/db.js';

const ensureDatabase = (res) => {
  if (!isDatabaseReady()) {
    res.status(503).json({ message: 'Database unavailable. Please use offline mode.' });
    return false;
  }

  return true;
};

const normalizeDate = (value) => {
  const date = value ? new Date(`${value}T12:00:00`) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getTrackingKey = (dateValue, frequency = 'daily') => {
  const date = normalizeDate(dateValue);

  if (frequency === 'weekly') {
    const currentDay = date.getDay() || 7;
    date.setDate(date.getDate() - currentDay + 1);
  }

  return date.toISOString().split('T')[0];
};

export const getHabits = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const habits = await Habit.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
  res.json(habits);
};

export const createHabit = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { name, icon, color, frequency, reminderTime, order, completions } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Habit name is required.' });
  }

  const lastHabit = await Habit.findOne({ user: req.user._id }).sort({ order: -1 });
  const normalizedOrder = Number.isFinite(Number(order)) ? Number(order) : lastHabit ? lastHabit.order + 1 : 0;

  const habit = await Habit.create({
    user: req.user._id,
    name,
    icon: icon || '✨',
    color: color || '#8b5cf6',
    frequency: frequency || 'daily',
    reminderTime: reminderTime || '',
    order: normalizedOrder,
    completions: Array.isArray(completions) ? completions : []
  });

  res.status(201).json(habit);
};

export const updateHabit = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  Object.assign(habit, {
    name: req.body.name ?? habit.name,
    icon: req.body.icon ?? habit.icon,
    color: req.body.color ?? habit.color,
    frequency: req.body.frequency ?? habit.frequency,
    reminderTime: req.body.reminderTime ?? habit.reminderTime,
    order: req.body.order ?? habit.order,
    completions: Array.isArray(req.body.completions) ? req.body.completions : habit.completions
  });

  await habit.save();
  res.json(habit);
};

export const deleteHabit = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  res.json({ message: 'Habit deleted successfully.' });
};

export const toggleHabitCompletion = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  const trackingKey = getTrackingKey(req.body.date, habit.frequency);
  const completionIndex = habit.completions.findIndex((item) => item.date === trackingKey);

  if (completionIndex >= 0) {
    habit.completions.splice(completionIndex, 1);
  } else {
    habit.completions.push({ date: trackingKey, completedAt: new Date() });
  }

  await habit.save();
  res.json(habit);
};

export const reorderHabits = async (req, res) => {
  if (!ensureDatabase(res)) {
    return;
  }

  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ message: 'orderedIds must be an array.' });
  }

  await Promise.all(
    orderedIds.map((habitId, index) =>
      Habit.updateOne({ _id: habitId, user: req.user._id }, { order: index })
    )
  );

  const habits = await Habit.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
  res.json(habits);
};
