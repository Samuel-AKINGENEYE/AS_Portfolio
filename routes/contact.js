import express from 'express';
import nodemailer from 'nodemailer';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// Simple in-memory rate limiter (per IP)
const rateMap = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    rateMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (rec.count >= MAX_PER_WINDOW) return true;
  rec.count++;
  return false;
}

// POST /api/contact/send  (public)
router.post('/send', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket?.remoteAddress || '';

    if (isRateLimited(ip)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please wait a minute.' });
    }

    const { name, email, message, honeypot } = req.body;

    // Honeypot: silently accept bot submissions without sending
    if (honeypot) return res.json({ success: true });

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || 'freshtalent491@gmail.com',
        replyTo: email,
        subject: `Portfolio Contact: ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#3B82F6">New Portfolio Contact</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background:#f8fafc;border-left:4px solid #3B82F6;padding:12px 16px;border-radius:4px">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        `,
      });
    } else {
      // No email config — log to console so it's not silently lost
      console.log('[Contact Form]', { name, email, message });
    }

    // Track event
    try {
      await Analytics.create({ event: 'contact_form', ip, page: '/contact' });
    } catch {}

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact send error:', err);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

export default router;
