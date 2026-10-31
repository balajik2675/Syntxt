import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['post', 'comment', 'user'], required: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ['like', 'reaction', 'bookmark', 'follow'], required: true }
}, { timestamps: true });

interactionSchema.index({ user: 1, targetType: 1, target: 1, type: 1 }, { unique: true });
interactionSchema.index({ targetType: 1, target: 1, type: 1 });
export default mongoose.model('Interaction', interactionSchema);
