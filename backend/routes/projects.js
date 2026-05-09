import express from 'express';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects  (public — ?featured=true for homepage)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.featured === 'true' ? { featured: true } : {};
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch projects.' });
  }
});

// GET /api/projects/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch project.' });
  }
});

// POST /api/projects  (admin)
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/projects/:id  (admin)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/projects/:id  (admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found.' });
    res.json({ success: true, data: { message: 'Project deleted.' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

export default router;
