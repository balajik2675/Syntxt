import { Router } from 'express';
import { createPost, deletePost, getPost, listPosts, updatePost } from '../controllers/posts.js';
import { listComments, createComment } from '../controllers/comments.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(listPosts));
router.get('/:slugOrId', optionalAuth, asyncHandler(getPost));
router.post('/', requireAuth, asyncHandler(createPost));
router.put('/:id', requireAuth, asyncHandler(updatePost));
router.delete('/:id', requireAuth, asyncHandler(deletePost));
router.get('/:postId/comments', asyncHandler(listComments));
router.post('/:postId/comments', requireAuth, asyncHandler(createComment));
export default router;
