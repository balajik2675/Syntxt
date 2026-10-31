import Post from '../models/Post.js';
import { createSlug } from '../utils/slug.js';

const shape = post => post;

export async function listPosts(req, res) {
  const { search, category, tag, page = 1, limit = 9 } = req.query;
  const filter = { status: 'published' };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };
  const safeLimit = Math.min(Math.max(Number(limit) || 9, 1), 30);
  const pageNumber = Math.max(Number(page) || 1, 1);
  const [posts, total] = await Promise.all([
    Post.find(filter).populate('author', 'name username avatar').sort({ createdAt: -1 }).skip((pageNumber - 1) * safeLimit).limit(safeLimit),
    Post.countDocuments(filter)
  ]);
  res.json({ posts: posts.map(shape), page: pageNumber, pages: Math.ceil(total / safeLimit), total });
}

export async function getPost(req, res) {
  const filter = req.params.slugOrId.match(/^[a-f\d]{24}$/i) ? { _id: req.params.slugOrId } : { slug: req.params.slugOrId };
  const post = await Post.findOne(filter).populate('author', 'name username avatar bio');
  if (!post || (post.status === 'draft' && (!req.user || String(post.author._id) !== String(req.user._id)))) return res.status(404).json({ message: 'Article not found' });
  res.json({ post });
}

export async function createPost(req, res) {
  const { title, excerpt, content, coverImage, category, tags, status } = req.body;
  if (!title || !excerpt || !content || !category) return res.status(400).json({ message: 'Title, excerpt, content, and category are required' });
  const post = await Post.create({ title, slug: `${createSlug(title)}-${Date.now().toString(36)}`, excerpt, content, coverImage, category, tags: Array.isArray(tags) ? tags.slice(0, 10) : [], status: status === 'published' ? 'published' : 'draft', author: req.user._id });
  res.status(201).json({ post: await post.populate('author', 'name username avatar') });
}

async function ownedPost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404).json({ message: 'Article not found' }); return null; }
  if (String(post.author) !== String(req.user._id)) { res.status(403).json({ message: 'You do not own this article' }); return null; }
  return post;
}

export async function updatePost(req, res) {
  const post = await ownedPost(req, res);
  if (!post) return;
  const allowed = ['title', 'excerpt', 'content', 'coverImage', 'category', 'tags', 'status'];
  allowed.forEach(key => { if (req.body[key] !== undefined) post[key] = req.body[key]; });
  await post.save();
  res.json({ post: await post.populate('author', 'name username avatar') });
}

export async function deletePost(req, res) {
  const post = await ownedPost(req, res);
  if (!post) return;
  await post.deleteOne();
  res.json({ message: 'Article deleted' });
}
