import User from '../models/User.js';
import Habit from '../models/Habit.js';
import { isDatabaseReady } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt
});

const createStarterHabits = async (userId) => {
  const existingHabits = await Habit.countDocuments({ user: userId });

  if (existingHabits > 0) {
    return;
  }

  await Habit.insertMany([
    {
      user: userId,
      name: 'Étirement du matin',
      icon: '🧘',
      color: '#8b5cf6',
      frequency: 'daily',
      order: 0
    },
    {
      user: userId,
      name: 'Lire 10 pages',
      icon: '📚',
      color: '#0ea5e9',
      frequency: 'daily',
      order: 1
    },
    {
      user: userId,
      name: 'Bilan hebdomadaire',
      icon: '📝',
      color: '#22c55e',
      frequency: 'weekly',
      order: 2
    }
  ]);
};

export const registerUser = async (req, res) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'Database unavailable. Use offline mode or connect MongoDB.' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Le nom, l’e-mail et le mot de passe sont requis.' });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: 'Un compte existe déjà avec cette adresse e-mail.' });
  }

  const user = await User.create({ name, email, password });
  await createStarterHabits(user._id);

  return res.status(201).json({
    token: generateToken(user._id),
    user: formatUser(user)
  });
};

export const loginUser = async (req, res) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'Database unavailable. Use offline mode or connect MongoDB.' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'L’e-mail et le mot de passe sont requis.' });
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'E-mail ou mot de passe invalide.' });
  }

  return res.json({
    token: generateToken(user._id),
    user: formatUser(user)
  });
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: formatUser(req.user) });
};
