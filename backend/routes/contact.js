import express from 'express';
import nodemailer from 'nodemailer';
import Analytics from '../models/Analytics.js';
import Message from '../models/Message.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SERVICE } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;

  if (SMTP_SERVICE) {
    return nodemailer.createTransport({ service: SMTP_SERVICE, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  }
  return nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// POST /api/contact/send
router.post('/send', async (req, res) => {
  const { name, email, message, honeypot, visitorId = '' } = req.body;

  if (honeypot) return res.json({ success: true });

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';

  // Track analytics first so we can link the _id to the message
  const analyticsDoc = await Analytics.create({
    event: 'contact_form',
    page: '/contact',
    visitorId,
    ip,
    userAgent,
  }).catch(() => null);

  // Save to MongoDB with the analytics reference
  const saved = await Message.create({ name, email, message, ip, userAgent, analyticsId: analyticsDoc?._id ?? null }).catch(err => {
    console.error('Failed to save message:', err.message);
    return null;
  });

  // Send email notification
  const transporter = createTransporter();
  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || 'freshtalent491@gmail.com';

  if (transporter) {
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: notifyEmail,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
          <h2 style="color:#1e293b;margin-bottom:4px;">New Portfolio Message</h2>
          <p style="color:#64748b;margin-top:0;font-size:14px;">Someone filled out your contact form</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;width:80px;"><b>Name</b></td><td style="padding:8px 0;color:#1e293b;font-size:14px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:14px;"><b>Email</b></td><td style="padding:8px 0;color:#1e293b;font-size:14px;"><a href="mailto:${email}" style="color:#3b82f6;">${email}</a></td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e2e8f0;">
            <p style="color:#64748b;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:.05em;">Message</p>
            <p style="color:#1e293b;font-size:15px;line-height:1.6;margin:0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    }).catch(err => console.error('Email send error:', err.message));
  } else {
    console.log(`📬 Contact [NO SMTP configured] — From: ${name} <${email}>\n   ${message}`);
  }

  res.json({ success: true, message: "Message received! I'll get back to you soon.", id: saved?._id });
});

// GET /api/contact/messages  (admin — list all messages)
router.get('/messages', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
  }
});

// PATCH /api/contact/messages/:id/read  (admin — mark as read)
router.patch('/messages/:id/read', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update message.' });
  }
});

// DELETE /api/contact/messages/:id  (admin)
router.delete('/messages/:id', verifyToken, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, error: 'Message not found.' });
    if (msg.analyticsId) {
      await Analytics.findByIdAndDelete(msg.analyticsId).catch(() => {});
    }
    res.json({ success: true, data: { message: 'Deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete message.' });
  }
});

export default router;
