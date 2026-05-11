import { setCors, handleOptions } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, message, honeypot } = req.body;

    // Honeypot anti-spam check
    if (honeypot) return res.status(200).json({ success: true });

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    // If SMTP env vars are set, send email; otherwise log and return success
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? '587'),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
        replyTo: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    } else {
      console.log(`Contact form submission — Name: ${name}, Email: ${email}, Message: ${message}`);
    }

    return res.status(200).json({ success: true, message: 'Message received!' });
  } catch (err) {
    console.error('Contact send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send message' });
  }
}
