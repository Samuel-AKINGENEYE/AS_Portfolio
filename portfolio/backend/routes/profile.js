import express from 'express';
import Profile from '../models/Profile.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile  (public)
router.get('/', async (_req, res) => {
  try {
    // Singleton pattern — always exactly one profile document
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({});
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile  (admin)
router.put('/', verifyToken, async (req, res) => {
  try {
    const allowed = ['name', 'title', 'bio', 'location', 'email', 'socialLinks', 'availability', 'yearsOfExperience'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date();

    let profile = await Profile.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
