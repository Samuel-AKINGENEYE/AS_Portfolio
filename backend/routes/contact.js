import express from 'express';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// POST /api/contact/send
router.post('/send', async (req, res) => {
  const { name, email, message, honeypot, visitorId = '' } = req.body;

  if (honeypot) return res.json({ success: true });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  console.log(`📬 Contact form — From: ${name} <${email}>`);
  console.log(`   Message: ${message}`);

  // track contact form submission
  Analytics.create({
    event: 'contact_form',
    page: '/contact',
    visitorId,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '',
    userAgent: req.headers['user-agent'] || '',
  }).catch(() => {});

  res.json({ success: true, message: "Message received! I'll get back to you soon." });
});

export default router;
