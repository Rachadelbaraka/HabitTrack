import jwt from 'jsonwebtoken';

export const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'development-secret', {
    expiresIn: '7d'
  });
