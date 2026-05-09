import express from 'express';
import Analytics from '../models/Analytics.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/track  (public — lightweight event tracking)
router.post('/track', async (req, res) => {
  try {
    const { page = '/', visitorId = '', event = 'pageview' } = req.body;
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await Analytics.create({ page, visitorId, ip, userAgent, event });
    res.json({ success: true });
  } catch (err) {
    // Never fail on analytics errors
    res.json({ success: false });
  }
});

// GET /api/analytics/stats  (admin only)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalViews, allVisitorIds, resumeDownloads, contactForms, dailyViews] =
      await Promise.all([
        Analytics.countDocuments({ event: 'pageview', timestamp: { $gte: since } }),
        Analytics.distinct('visitorId', { event: 'pageview', timestamp: { $gte: since } }),
        Analytics.countDocuments({ event: 'resume_download', timestamp: { $gte: since } }),
        Analytics.countDocuments({ event: 'contact_form', timestamp: { $gte: since } }),
        Analytics.aggregate([
          { $match: { event: 'pageview', timestamp: { $gte: since } } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const uniqueVisitors = allVisitorIds.filter(Boolean).length;

    res.json({
      success: true,
      data: { totalViews, uniqueVisitors, resumeDownloads, contactForms, dailyViews },
    });
  } catch (err) {
    console.error('Analytics stats error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
