import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Samuel AKINGENEYE' },
  title: { type: String, default: 'Software Engineer' },
  bio: { type: String, default: '' },
  location: { type: String, default: 'Kigali, Rwanda' },
  email: { type: String, default: '' },
  availability: { type: String, default: 'Available Now' },
  yearsOfExperience: { type: Number, default: 2 },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  resumeUrl: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Profile', profileSchema);
