import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDatabaseReady } from '../config/db.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Missing token.' });
  }

  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'Database unavailable. Please use offline mode.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found for this token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};
