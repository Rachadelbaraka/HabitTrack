import express from 'express';
import {
  createHabit,
  deleteHabit,
  getHabits,
  reorderHabits,
  toggleHabitCompletion,
  updateHabit
} from '../controllers/habitController.js';
import { protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);
router.get('/', asyncHandler(getHabits));
router.post('/', asyncHandler(createHabit));
router.post('/reorder', asyncHandler(reorderHabits));
router.post('/:id/toggle', asyncHandler(toggleHabitCompletion));
router.put('/:id', asyncHandler(updateHabit));
router.delete('/:id', asyncHandler(deleteHabit));

export default router;
