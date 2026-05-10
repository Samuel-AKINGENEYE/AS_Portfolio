import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// Upload avatar
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'portfolio/avatars', width: 400, height: 400, crop: 'fill' });
    res.json({ success: true, data: { url: result.secure_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload certificate image
router.post('/certificate', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'portfolio/certificates', width: 400, height: 300, crop: 'fill' });
    res.json({ success: true, data: { url: result.secure_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload project image
router.post('/project', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'portfolio/projects', width: 600, height: 400, crop: 'fill' });
    res.json({ success: true, data: { url: result.secure_url } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
