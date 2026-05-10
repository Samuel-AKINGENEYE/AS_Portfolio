import express from 'express';
import Profile from '../models/Profile.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/', verifyToken, async (req, res) => {
  try {
    const allowed = [
      'name', 'title', 'bio', 'location', 'email', 
      'avatar', 'resumeUrl', 'availability', 
      'yearsOfExperience', 'socialLinks'
    ];
    const updates = {};
    allowed.forEach(key => {
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
