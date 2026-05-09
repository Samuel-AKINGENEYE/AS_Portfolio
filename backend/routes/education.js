import express from 'express';
import Education from '../models/Education.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, startDate: -1 });
    res.json({ success: true, data: education });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const edu = new Education(req.body);
    await edu.save();
    res.status(201).json({ success: true, data: edu });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: edu });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
