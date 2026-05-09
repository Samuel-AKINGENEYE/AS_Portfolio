import express from 'express';
import Skill from '../models/Skill.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
