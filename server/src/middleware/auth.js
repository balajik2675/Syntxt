import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(payload.id).select('-password');
    }
  } catch {
    // Invalid optional credentials are treated as anonymous access.
  }
  next();
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Authentication required' });
  }
}
