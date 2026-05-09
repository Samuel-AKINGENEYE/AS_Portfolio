import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  achievements: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
