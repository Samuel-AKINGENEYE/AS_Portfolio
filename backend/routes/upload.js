import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// POST /api/upload/avatar  (admin, base64 JSON body)
router.post('/avatar', verifyToken, async (req, res) => {
  try {
    const { data: base64Data, mimeType } = req.body;
    if (!base64Data) return res.status(400).json({ success: false, error: 'No image data provided' });

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(503).json({ success: false, error: 'Cloudinary not configured on server' });
    }

    const dataUri = `data:${mimeType ?? 'image/jpeg'};base64,${base64Data}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio/avatars',
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    res.json({ success: true, data: { url: result.secure_url } });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload/resume  (admin, base64 JSON body)
router.post('/resume', verifyToken, async (req, res) => {
  try {
    const { data: base64Data } = req.body;
    if (!base64Data) return res.status(400).json({ success: false, error: 'No file data provided' });

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(503).json({ success: false, error: 'Cloudinary not configured on server' });
    }

    const dataUri = `data:application/pdf;base64,${base64Data}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio/resumes',
      resource_type: 'raw',
    });

    res.json({ success: true, data: { url: result.secure_url } });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
