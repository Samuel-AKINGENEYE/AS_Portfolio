import express from 'express';
import Experience from '../models/Experience.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const experience = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json({ success: true, data: experience });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json({ success: true, data: exp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: exp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
