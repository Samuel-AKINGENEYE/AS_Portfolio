import puppeteer from 'puppeteer-core';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Each entry targets the most representative internal page of each project
const TARGETS = [
  {
    title: 'SpeakSmart – AI Language Tutor',
    url: 'https://speak-smart-rouge.vercel.app/',
    // Scroll past hero to the pronunciation practice interface
    scrollY: 600,
    waitFor: 4000,
  },
  {
    title: 'Smart citizen request system',
    // Show the actual request dashboard with the table and filters
    url: 'https://smart-citizen-service-request-syste.vercel.app/',
    scrollY: 0,
    waitFor: 4000,
    // Click through to see the dashboard content (it's a SPA — try admin view)
    postLoad: async (page) => {
      // Navigate to admin view if possible
      try {
        await page.goto('https://smart-citizen-service-request-syste.vercel.app/admin', {
          waitUntil: 'networkidle2', timeout: 10000,
        });
      } catch (_) {}
      await new Promise(r => setTimeout(r, 2000));
    },
  },
  {
    title: 'Doctor appointment booking system',
    // Show the book-appointment page with doctor selection
    url: 'https://doctor-appointment-booking-system-w.vercel.app/book-appointment.html',
    scrollY: 0,
    waitFor: 3000,
  },
  {
    title: 'Fresh talent store',
    // Products / shop page showing product catalog
    url: 'https://fresh-talent-store.vercel.app/products',
    scrollY: 0,
    waitFor: 3500,
  },
  {
    title: 'Nexus Chat Community',
    // Explore page showing spaces/communities
    url: 'https://nexus-chat-opal.vercel.app/',
    scrollY: 300,
    waitFor: 4000,
  },
];

async function uploadToCloudinary(buffer, publicId) {
  const dataUri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: `portfolio/projects/${publicId}`,
    overwrite: true,
    resource_type: 'image',
  });
  return result.secure_url;
}

async function takeScreenshot(browser, target) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    console.log(`  Navigating to ${target.url}`);
    await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, target.waitFor));

    if (target.postLoad) {
      await target.postLoad(page);
    }

    if (target.scrollY) {
      await page.evaluate(y => window.scrollTo(0, y), target.scrollY);
      await new Promise(r => setTimeout(r, 1200));
    }

    return await page.screenshot({ type: 'jpeg', quality: 75, fullPage: false });
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    headless: true,
  });

  const results = {};

  for (const target of TARGETS) {
    console.log(`\nScreenshotting: ${target.title}`);
    try {
      const buffer = await takeScreenshot(browser, target);
      const slug = target.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      console.log(`  Uploading to Cloudinary as "${slug}"...`);
      const url = await uploadToCloudinary(buffer, `v2-${slug}`);
      console.log(`  ✓ ${url}`);
      results[target.title] = url;
    } catch (err) {
      console.error(`  ✗ Failed:`, err);
    }
  }

  await browser.close();

  console.log('\nUpdating MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  const Project = (await import('./models/Project.js')).default;

  for (const [title, imageUrl] of Object.entries(results)) {
    const res = await Project.findOneAndUpdate(
      { title },
      { $set: { imageUrl } },
      { new: true }
    );
    if (res) {
      console.log(`  ✓ Updated "${title}"`);
    } else {
      console.log(`  ✗ Project not found in DB: "${title}"`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
