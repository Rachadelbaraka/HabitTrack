import express from 'express';
import { getStatsOverview } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);
router.get('/overview', asyncHandler(getStatsOverview));

export default router;
