import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import entryRoutes from './routes/entryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { connectDB, isDatabaseReady } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: [allowedOrigin, 'http://localhost:5173'],
    credentials: true
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// The frontend uses this endpoint to decide whether to stay online or rely on offline fallback.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isDatabaseReady() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

connectDB().finally(() => {
  app.listen(port, () => {
    console.log(`HabitTrack API listening on port ${port}`);
  });
});
