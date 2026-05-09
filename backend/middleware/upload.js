import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Cloudinary when all three credentials are set; otherwise fall back to local disk
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

// Ensure local uploads dir exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  cb(extOk && mimeOk ? null : new Error('Only image files (jpg, png, gif, webp) are allowed.'), extOk && mimeOk);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/**
 * After multer writes to disk, call this to either:
 * - Upload to Cloudinary and get a CDN URL, or
 * - Return a local /uploads/<filename> path as fallback
 */
export const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
  if (!useCloudinary) {
    return `/uploads/${path.basename(filePath)}`;
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: true,
  });

  // Remove local copy after successful Cloudinary upload
  fs.unlink(filePath, () => {});
  return result.secure_url;
};
