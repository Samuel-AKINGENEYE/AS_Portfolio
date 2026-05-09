import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Education', educationSchema);
