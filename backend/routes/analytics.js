import express from 'express';
import Analytics from '../models/Analytics.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/track  (public)
router.post('/track', async (req, res) => {
  try {
    const { event = 'pageview', page = '/', visitorId = '' } = req.body;
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    await Analytics.create({ event, page, visitorId, ip, userAgent });
  } catch {
    // never let tracking errors surface to the visitor
  }
  res.json({ success: true });
});

// GET /api/analytics/stats  (admin)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const since = new Date(Date.now() - days * 86_400_000);

    const [
      totalViews,
      uniqueIds,
      profileViews,
      contactForms,
      dailyViews,
      returnVisitorsResult,
      hourlyPeak,
      recentEvents,
    ] = await Promise.all([
      Analytics.countDocuments({ event: 'pageview', createdAt: { $gte: since } }),

      Analytics.distinct('visitorId', { event: 'pageview', visitorId: { $ne: '' }, createdAt: { $gte: since } }),

      Analytics.countDocuments({ event: 'profile_view', createdAt: { $gte: since } }),

      Analytics.countDocuments({ event: 'contact_form', createdAt: { $gte: since } }),

      // Daily pageview counts for the bar chart
      Analytics.aggregate([
        { $match: { event: 'pageview', createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Visitors with more than one visit (return visitors)
      Analytics.aggregate([
        { $match: { event: 'pageview', visitorId: { $ne: '' }, createdAt: { $gte: since } } },
        { $group: { _id: '$visitorId', visits: { $sum: 1 } } },
        { $match: { visits: { $gt: 1 } } },
        { $count: 'count' },
      ]),

      // Hour of day with most traffic
      Analytics.aggregate([
        { $match: { event: 'pageview', createdAt: { $gte: since } } },
        { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      // Last 15 events for the activity feed
      Analytics.find({ createdAt: { $gte: since } })
        .sort({ createdAt: -1 })
        .limit(15)
        .select('event page createdAt')
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: uniqueIds.length,
        profileViews,
        contactForms,
        dailyViews,
        returnVisitors: returnVisitorsResult[0]?.count ?? 0,
        peakHour: hourlyPeak[0]?._id ?? null,
        recentEvents,
      },
    });
  } catch (err) {
    console.error('Analytics stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics.' });
  }
});

export default router;
