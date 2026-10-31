import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, maxlength: 320 },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, trim: true, maxlength: 40 },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
export default mongoose.model('Post', postSchema);

