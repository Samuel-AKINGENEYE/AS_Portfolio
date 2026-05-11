import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './backend/routes/auth.js';
import projectRoutes from './backend/routes/projects.js';
import certificateRoutes from './backend/routes/certificates.js';
import profileRoutes from './backend/routes/profile.js';
import skillRoutes from './backend/routes/skills.js';
import educationRoutes from './backend/routes/education.js';
import experienceRoutes from './backend/routes/experience.js';
import uploadRoutes from './backend/routes/upload.js';
import analyticsRoutes from './backend/routes/analytics.js';
import contactRoutes from './backend/routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://samuelak.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  const maxRetries = 5;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
      return;
    } catch (err) {
      console.error(`Attempt ${i}/${maxRetries} failed:`, err.message);
      if (i === maxRetries) process.exit(1);
      await new Promise((res) => setTimeout(res, 5000 * i));
    }
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
