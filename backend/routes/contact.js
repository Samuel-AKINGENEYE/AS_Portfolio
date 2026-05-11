import express from 'express';

const router = express.Router();

// POST /api/contact/send
router.post('/send', (req, res) => {
  const { name, email, message, honeypot } = req.body;

  // Silently discard bot submissions
  if (honeypot) return res.json({ success: true });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  console.log(`📬 Contact form — From: ${name} <${email}>`);
  console.log(`   Message: ${message}`);

  res.json({ success: true, message: "Message received! I'll get back to you soon." });
});

export default router;
