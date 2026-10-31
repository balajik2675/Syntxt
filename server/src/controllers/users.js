import User from '../models/User.js';
import Post from '../models/Post.js';

export async function getUser(req, res) {
  const user = await User.findOne({ username: req.params.username }).select('name username bio avatar createdAt');
  if (!user) return res.status(404).json({ message: 'Author not found' });
  const posts = await Post.find({ author: user._id, status: 'published' }).sort({ createdAt: -1 }).populate('author', 'name username avatar');
  res.json({ user, posts });
}

export async function updateMe(req, res) {
  const user = await User.findByIdAndUpdate(req.user._id, { $set: { name: req.body.name, bio: req.body.bio, avatar: req.body.avatar } }, { new: true, runValidators: true }).select('-password');
  res.json({ user });
}

