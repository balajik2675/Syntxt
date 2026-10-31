import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function publicUser(user) {
  return { id: user._id, name: user.name, username: user.username, email: user.email, bio: user.bio, avatar: user.avatar };
}

function setToken(res, userId) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function register(req, res) {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, username, email, and an 8-character password are required' });
  if (!/^[a-z0-9_]+$/i.test(username)) return res.status(400).json({ message: 'Username may contain only letters, numbers, and underscores' });
  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
  if (existing) return res.status(409).json({ message: 'Email or username is already registered' });
  const user = await User.create({ name, username, email, password: await bcrypt.hash(password, 12) });
  setToken(res, user._id);
  res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  setToken(res, user._id);
  res.json({ user: publicUser(user) });
}

export function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
