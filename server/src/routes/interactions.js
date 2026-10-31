import { Router } from 'express';
import { getFollowStatus, getPostInteractions, toggleCommentReaction, toggleFollow, togglePostInteraction } from '../controllers/interactions.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/posts/:postId', optionalAuth, asyncHandler(getPostInteractions));
router.post('/posts/:postId', requireAuth, asyncHandler(togglePostInteraction));
router.post('/comments/:commentId/reaction', requireAuth, asyncHandler(toggleCommentReaction));
router.get('/users/:userId/follow', optionalAuth, asyncHandler(getFollowStatus));
router.post('/users/:userId/follow', requireAuth, asyncHandler(toggleFollow));
export default router;
