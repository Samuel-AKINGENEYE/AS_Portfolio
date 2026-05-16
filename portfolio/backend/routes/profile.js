import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import Profile from '../models/Profile.js';
import { verifyToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${unique}${path.extname(file.originalname)}`);
  },
});

const resumeFilter = (_req, file, cb) => {
  const allowed = /pdf/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = file.mimetype === 'application/pdf';
  cb(extOk && mimeOk ? null : new Error('Only PDF files are allowed.'), extOk && mimeOk);
};

const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const router = express.Router();

// GET /api/profile  (public)
router.get('/', async (_req, res) => {
  try {
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

// POST /api/profile/resume  (admin) — upload a PDF resume
router.post('/resume', verifyToken, resumeUpload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No PDF file provided.' });
    }

    let resumeUrl;
    if (useCloudinary) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/resume',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true,
      });
      fs.unlink(req.file.path, () => {});
      resumeUrl = result.secure_url;
    } else {
      resumeUrl = `/uploads/${req.file.filename}`;
    }

    const profile = await Profile.findOneAndUpdate(
      {},
      { resumeUrl, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/profile/resume  (admin) — remove the resume URL
router.delete('/resume', verifyToken, async (_req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      {},
      { resumeUrl: '', updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
