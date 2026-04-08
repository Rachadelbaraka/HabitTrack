import express from 'express';
import { getEntries, getEntryByDate, upsertEntry } from '../controllers/entryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);
router.get('/', asyncHandler(getEntries));
router.get('/:date', asyncHandler(getEntryByDate));
router.put('/:date', asyncHandler(upsertEntry));

export default router;
