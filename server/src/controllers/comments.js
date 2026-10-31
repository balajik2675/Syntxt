import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Interaction from '../models/Interaction.js';

export async function listComments(req, res) {
  const identifier = req.params.postId;
  const filter = /^[a-f\d]{24}$/i.test(identifier) ? { _id: identifier } : { slug: identifier };
  const post = await Post.findOne(filter);
  if (!post) return res.status(404).json({ message: 'Article not found' });
  const comments = await Comment.find({ post: post._id }).populate('author', 'name username avatar').sort({ createdAt: 1 }).lean();
  const ids = comments.map(comment => comment._id);
  const reactions = await Interaction.find({ targetType: 'comment', target: { $in: ids }, type: 'reaction' }).lean();
  res.json({ comments: comments.map(comment => ({ ...comment, reactionCount: reactions.filter(item => String(item.target) === String(comment._id)).length })) });
}

export async function createComment(req, res) {
  const { content, parentComment } = req.body;
  if (!content?.trim() || content.length > 1000) return res.status(400).json({ message: 'Comment must be between 1 and 1000 characters' });
  const post = await Post.findOne({ _id: req.params.postId, status: 'published' });
  if (!post) return res.status(404).json({ message: 'Article not found' });
  const comment = await Comment.create({ content: content.trim(), post: post._id, author: req.user._id, parentComment: parentComment || null });
  res.status(201).json({ comment: await comment.populate('author', 'name username avatar') });
}

export async function updateComment(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (String(comment.author) !== String(req.user._id)) return res.status(403).json({ message: 'You do not own this comment' });
  if (!req.body.content?.trim() || req.body.content.length > 1000) return res.status(400).json({ message: 'Invalid comment' });
  comment.content = req.body.content.trim();
  await comment.save();
  res.json({ comment: await comment.populate('author', 'name username avatar') });
}

export async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (String(comment.author) !== String(req.user._id)) return res.status(403).json({ message: 'You do not own this comment' });
  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
}
