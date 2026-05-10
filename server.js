import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import projectRoutes from './routes/projects.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import certificateRoutes from './routes/certificates.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import profileRoutes from './routes/profile.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import skillRoutes from './routes/skills.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import educationRoutes from './routes/education.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import experienceRoutes from './routes/experience.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import uploadRoutes from './routes/upload.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import analyticsRoutes from './routes/analytics.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import contactRoutes from './routes/contact.js';
import githubProxyRoutes from "./routes/github-proxy.js";
import githubRoutes from './routes/github.js';
import githubProxyRoutes from "./routes/github-proxy.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://samuelak.netlify.app',
  'https://as-portfolio-livid-one.vercel.app',
  'https://samuelak-portfolio.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/projects', projectRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/certificates', certificateRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/skills', skillRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/education', educationRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/experience', experienceRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/github-proxy", githubProxyRoutes);
app.use('/api/github', githubRoutes);
app.use("/api/github-proxy", githubProxyRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
});
