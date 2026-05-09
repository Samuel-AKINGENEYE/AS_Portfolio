import express from 'express';
import Certificate from '../models/Certificate.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/certificates  (public — ?category=AI/ML for filtering)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const certificates = await Certificate.find(filter).sort({ issueDate: -1 });
    res.json({ success: true, data: certificates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch certificates.' });
  }
});

// POST /api/certificates  (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json({ success: true, data: certificate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/certificates/:id  (admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!certificate) return res.status(404).json({ success: false, error: 'Certificate not found.' });
    res.json({ success: true, data: certificate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/certificates/:id  (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ success: false, error: 'Certificate not found.' });
    res.json({ success: true, data: { message: 'Certificate deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete certificate.' });
  }
});

export default router;
