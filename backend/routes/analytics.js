import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/track  (public — silently accepts tracking events)
router.post('/track', (_req, res) => {
  res.json({ success: true });
});

// GET /api/analytics/stats  (admin)
router.get('/stats', verifyToken, (_req, res) => {
  res.json({ success: true, data: { pageviews: 0, contacts: 0, resumeDownloads: 0 } });
});

export default router;
