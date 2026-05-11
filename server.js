import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './lib/supabase-admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://as-portfolio-livid-one.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API running with Supabase' });
});

// Auth Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Compare password using bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, data: { token, user: { id: user.id, email: user.email } } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    let query = supabaseAdmin.from('projects').select('*').order('created_at', { ascending: false });
    if (req.query.featured === 'true') {
      query = query.eq('featured', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get profile
app.get('/api/profile', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('*').single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get skills
app.get('/api/skills', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('skills').select('*').order('category');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('certificates').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get education
app.get('/api/education', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('education').select('*').order('start_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get experience
app.get('/api/experience', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('experience').select('*').order('start_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Using Supabase as database`);
});
