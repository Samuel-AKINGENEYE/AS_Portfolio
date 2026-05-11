import { setCors, handleOptions, verifyAdmin } from '../../lib/auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    verifyAdmin(req);

    const { data: base64Data, mimeType } = req.body;
    if (!base64Data) return res.status(400).json({ success: false, error: 'No image data provided' });

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(503).json({ success: false, error: 'Cloudinary not configured' });
    }

    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const dataUri = `data:${mimeType ?? 'image/jpeg'};base64,${base64Data}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio/avatars',
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    return res.status(200).json({ success: true, data: { url: result.secure_url } });
  } catch (err) {
    if (err.message === 'Unauthorized') return res.status(401).json({ success: false, error: 'Unauthorized' });
    console.error('Avatar upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
