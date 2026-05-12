import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  event: { type: String, required: true, index: true }, // 'pageview' | 'resume_download' | 'contact_form'
  page: { type: String, default: '/' },
  visitorId: { type: String, default: '' },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('Analytics', analyticsSchema);
