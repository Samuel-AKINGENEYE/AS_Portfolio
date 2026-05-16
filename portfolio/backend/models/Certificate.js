import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    credentialUrl: { type: String, trim: true, default: '' },
    imageUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['AI/ML', 'Web Dev', 'Cybersecurity', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
