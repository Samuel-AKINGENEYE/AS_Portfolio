import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import Certificate from '../models/Certificate.js';
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

const pdfStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cert-${unique}${path.extname(file.originalname)}`);
  },
});

const pdfFilter = (_req, file, cb) => {
  const extOk = /pdf/.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = file.mimetype === 'application/pdf';
  cb(extOk && mimeOk ? null : new Error('Only PDF files are allowed.'), extOk && mimeOk);
};

const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFilter, limits: { fileSize: 15 * 1024 * 1024 } });

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

// POST /api/certificates/:id/pdf  (admin) — upload a PDF for a certificate
router.post('/:id/pdf', verifyToken, pdfUpload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file provided.' });

    let pdfUrl;
    if (useCloudinary) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio/certificates',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true,
      });
      fs.unlink(req.file.path, () => {});
      pdfUrl = result.secure_url;
    } else {
      pdfUrl = `/uploads/${req.file.filename}`;
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, { pdfUrl }, { new: true });
    if (!certificate) return res.status(404).json({ success: false, error: 'Certificate not found.' });
    res.json({ success: true, data: certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/certificates/:id/pdf  (admin) — remove PDF from a certificate
router.delete('/:id/pdf', verifyToken, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, { pdfUrl: '' }, { new: true });
    if (!certificate) return res.status(404).json({ success: false, error: 'Certificate not found.' });
    res.json({ success: true, data: certificate });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to remove PDF.' });
  }
});

export default router;
