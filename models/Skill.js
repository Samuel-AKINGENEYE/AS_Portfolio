import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Other'],
    default: 'Other',
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
