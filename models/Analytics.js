import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  page: { type: String, default: '/' },
  visitorId: { type: String, default: '' },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  event: {
    type: String,
    enum: ['pageview', 'resume_download', 'contact_form'],
    default: 'pageview',
  },
  timestamp: { type: Date, default: Date.now },
});

analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ event: 1 });
analyticsSchema.index({ visitorId: 1 });

export default mongoose.model('Analytics', analyticsSchema);
