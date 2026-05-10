import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✓ Present' : '✗ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✓ Present' : '✗ Missing');

try {
  // Test with a sample image URL
  const result = await cloudinary.uploader.upload('https://picsum.photos/200/200', {
    folder: 'portfolio/test'
  });
  console.log('✅ Cloudinary works! Test upload successful');
  console.log('Result URL:', result.secure_url);
} catch (err) {
  console.error('❌ Cloudinary error:', err.message);
}
