import mongoose from 'mongoose';
import Interaction from '../models/Interaction.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

export async function getPostInteractions(req, res) {
  const post = await Post.findOne(/^[a-f\d]{24}$/i.test(req.params.postId) ? { _id: req.params.postId } : { slug: req.params.postId });
  if (!post) return res.status(404).json({ message: 'Article not found' });
  const interactions = await Interaction.find({ targetType: 'post', target: post._id }).lean();
  const own = req.user ? interactions.filter(item => String(item.user) === String(req.user._id)) : [];
  res.json({
    likes: interactions.filter(item => item.type === 'like').length,
    liked: own.some(item => item.type === 'like'),
    bookmarked: own.some(item => item.type === 'bookmark'),
    bookmarks: interactions.filter(item => item.type === 'bookmark').length
  });
}

export async function togglePostInteraction(req, res) {
  const { type } = req.body;
  if (!['like', 'bookmark'].includes(type)) return res.status(400).json({ message: 'Invalid article interaction' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ message: 'Article not found' });
  const filter = { user: req.user._id, targetType: 'post', target: post._id, type };
  const existing = await Interaction.findOne(filter);
  if (existing) await existing.deleteOne();
  else await Interaction.create(filter);
  res.json({ active: !existing });
}

export async function toggleCommentReaction(req, res) {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  const filter = { user: req.user._id, targetType: 'comment', target: comment._id, type: 'reaction' };
  const existing = await Interaction.findOne(filter);
  if (existing) await existing.deleteOne();
  else await Interaction.create(filter);
  const count = await Interaction.countDocuments({ targetType: 'comment', target: comment._id, type: 'reaction' });
  res.json({ active: !existing, count });
}

export async function toggleFollow(req, res) {
  if (!mongoose.isValidObjectId(req.params.userId) || String(req.user._id) === req.params.userId) return res.status(400).json({ message: 'Invalid author' });
  if (!await User.exists({ _id: req.params.userId })) return res.status(404).json({ message: 'Author not found' });
  const filter = { user: req.user._id, targetType: 'user', target: req.params.userId, type: 'follow' };
  const existing = await Interaction.findOne(filter);
  if (existing) await existing.deleteOne();
  else await Interaction.create(filter);
  res.json({ active: !existing });
}

export async function getFollowStatus(req, res) {
  const active = req.user ? Boolean(await Interaction.exists({ user: req.user._id, targetType: 'user', target: req.params.userId, type: 'follow' })) : false;
  const count = await Interaction.countDocuments({ targetType: 'user', target: req.params.userId, type: 'follow' });
  res.json({ active, count });
}
