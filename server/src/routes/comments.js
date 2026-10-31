import { Router } from 'express';
import { deleteComment, updateComment } from '../controllers/comments.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
const router = Router();
router.put('/:id', requireAuth, asyncHandler(updateComment));
router.delete('/:id', requireAuth, asyncHandler(deleteComment));
export default router;
