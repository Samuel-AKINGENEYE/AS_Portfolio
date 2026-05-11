import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../lib/supabase-admin.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Find user in Supabase
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    console.log('User found, comparing password...');
    
    // Check if password needs hashing (if stored as plain text)
    let isValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Already hashed
      isValid = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password - check directly
      isValid = (password === user.password);
      // If valid, hash it for next time
      if (isValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await supabaseAdmin.from('users').update({ password: hashedPassword }).eq('email', email);
      }
    }
    
    if (!isValid) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    console.log('Login successful for:', email);
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, email: user.email } 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

export default router;
