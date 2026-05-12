import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const memStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: memStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files (jpg, png, gif, webp) are allowed'), ok);
  },
});

const fileUpload = multer({
  storage: memStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

async function storeBuffer(buffer, originalname, folder, resourceType = 'auto') {
  if (useCloudinary) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType, use_filename: true, unique_filename: true },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });
    return result.secure_url;
  }
  const ext = path.extname(originalname) || '';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  fs.writeFileSync(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

// POST /api/upload/avatar  (image file, field name: avatar)
router.post('/avatar', verifyToken, imageUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image provided' });
    const url = await storeBuffer(req.file.buffer, req.file.originalname, 'portfolio/avatars', 'image');
    res.json({ success: true, data: { url } });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload/resume  (any file, field name: resume)
router.post('/resume', verifyToken, fileUpload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' });
    const url = await storeBuffer(req.file.buffer, req.file.originalname, 'portfolio/resumes', 'raw');
    res.json({ success: true, data: { url } });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload/image  (image file, field name: image — for certs, projects, etc.)
router.post('/image', verifyToken, imageUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image provided' });
    const folder = req.query.folder || 'portfolio/images';
    const url = await storeBuffer(req.file.buffer, req.file.originalname, folder, 'image');
    res.json({ success: true, data: { url } });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload/file  (any file, field name: file — generic)
router.post('/file', verifyToken, fileUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file provided' });
    const folder = req.query.folder || 'portfolio/files';
    const url = await storeBuffer(req.file.buffer, req.file.originalname, folder, 'auto');
    res.json({ success: true, data: { url } });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
