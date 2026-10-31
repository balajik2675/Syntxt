import { Router } from 'express';
import { getUser, updateMe } from '../controllers/users.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.get('/:username', asyncHandler(getUser));
router.put('/me', requireAuth, asyncHandler(updateMe));
export default router;
