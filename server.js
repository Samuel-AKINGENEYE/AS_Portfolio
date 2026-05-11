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

// Admin Login
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
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user.id, email: user.email } } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

// Create project (admin only)
app.post('/api/projects', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('projects').insert(req.body).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update project (admin only)
app.put('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete project (admin only)
app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('skills')
      .select('*')
      .order('category')
      .order('order');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all education
app.get('/api/education', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('education')
      .select('*')
      .order('order')
      .order('start_date', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all experience
app.get('/api/experience', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('experience')
      .select('*')
      .order('order')
      .order('start_date', { ascending: false });
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

// Update profile (admin only)
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(req.body)
      .eq('id', req.body.id || (await supabaseAdmin.from('profiles').select('id').single()).data.id)
      .select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify token middleware
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Using Supabase as database`);
});
