import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    techStack: [{ type: String, trim: true }],
    liveUrl: { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    imageUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
