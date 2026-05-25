import puppeteer from 'puppeteer-core';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import { writeFileSync } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function upload(buffer, slug, max = 5) {
  const uri = 'data:image/jpeg;base64,' + buffer.toString('base64');
  for (let i = 1; i <= max; i++) {
    try {
      const r = await cloudinary.uploader.upload(uri, {
        public_id: `portfolio/projects/final-${slug}`, overwrite: true,
      });
      return r.secure_url;
    } catch (e) {
      const msg = e?.error?.message || e?.message || 'unknown';
      if (i < max) { console.log(`  retry ${i}: ${msg}`); await new Promise(r => setTimeout(r, 4000)); }
      else throw new Error(msg);
    }
  }
}

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  headless: true,
});

const results = {};

// ── Fresh Talent: click on a product with a good image to show detail page ────
{
  console.log('\n[1] Fresh Talent – product detail page');
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
  await page.goto('https://fresh-talent-store.vercel.app/products', {
    waitUntil: 'domcontentloaded', timeout: 30000,
  }).catch(() => {});
  await new Promise(r => setTimeout(r, 7000));

  // Wait for loaded product images
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('img')).filter(i => i.naturalHeight > 0).length >= 3,
    { timeout: 10000 }
  ).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));

  // Click "View Details" on the first product with a loaded image (not the broken one)
  const clicked = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    // Find the first product image that actually loaded
    const goodImg = imgs.find(i => i.naturalHeight > 0 && i.src && !i.src.includes('favicon') && !i.src.includes('logo'));
    if (!goodImg) return null;
    // Walk up to find the product card and click its "View Details" button
    let card = goodImg;
    for (let i = 0; i < 8; i++) {
      card = card.parentElement;
      if (!card) break;
      const btn = card.querySelector('a[href*="product"], a[href*="/p/"], button');
      if (btn && btn.textContent?.toLowerCase().includes('view')) {
        btn.click();
        return btn.textContent.trim();
      }
    }
    // Fallback: find any "View Details" link
    const links = Array.from(document.querySelectorAll('a, button'));
    const viewBtn = links.find(l => l.textContent?.toLowerCase().includes('view detail'));
    if (viewBtn) { viewBtn.click(); return viewBtn.textContent.trim(); }
    return null;
  });
  console.log('  Clicked:', clicked, '→ url:', page.url());
  await new Promise(r => setTimeout(r, 5000));

  // Wait for product detail image to load
  await page.waitForFunction(
    () => Array.from(document.querySelectorAll('img')).filter(i => i.naturalHeight > 50).length >= 1,
    { timeout: 8000 }
  ).catch(() => {});
  await new Promise(r => setTimeout(r, 1500));

  const finalUrl = page.url();
  console.log('  Final URL:', finalUrl);
  const buf = await page.screenshot({ type: 'jpeg', quality: 88 });
  writeFileSync('/tmp/fresh-detail.jpg', buf);
  console.log('  size:', buf.length);
  try {
    const url = await upload(buf, 'fresh-talent-store');
    console.log('  ✓', url);
    results['Fresh talent store'] = url;
  } catch (e) { console.error('  ✗', e.message); }
  await page.close();
}

// ── Nexus: try logging in with previously registered credentials ──────────────
{
  console.log('\n[2] Nexus – try login with registered credentials');
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
  await page.goto('https://nexus-chat-opal.vercel.app/', {
    waitUntil: 'domcontentloaded', timeout: 20000,
  }).catch(() => {});
  await new Promise(r => setTimeout(r, 4000));

  // Dark mode
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const topBtns = btns.filter(b => { const r = b.getBoundingClientRect(); return r.top < 60 && r.left > 900 && r.left < 1100; });
    if (topBtns[0]) topBtns[0].click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Open Sign In modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a'));
    const signIn = btns.find(b => b.textContent?.trim() === 'Sign In');
    if (signIn) signIn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Make sure we're on the Sign In tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent?.trim() === 'Sign In');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Check what inputs are available
  const inputs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('input')).map(i => ({ id: i.id, placeholder: i.placeholder, type: i.type }))
  );
  console.log('  Login inputs:', JSON.stringify(inputs.filter(i => i.id?.includes('login'))));

  // Type credentials using page.type()
  await page.focus('#loginEmail');
  await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type('#loginEmail', 'nexusview2025@gmail.com', { delay: 30 });

  await page.focus('#loginPw');
  await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.type('#loginPw', 'SecurePass123!', { delay: 30 });

  await new Promise(r => setTimeout(r, 400));

  // Click Sign In submit button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    // Find the submit Sign In button (type=submit or text "Sign In — Welcome Back" etc.)
    const submit = btns.find(b =>
      (b.type === 'submit' && b.textContent?.toLowerCase().includes('sign in')) ||
      b.textContent?.toLowerCase().includes('welcome back') ||
      b.textContent?.toLowerCase().includes("sign in —")
    );
    const fallback = btns.find(b => b.type === 'submit');
    const btn = submit || fallback;
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 7000));

  const state = await page.evaluate(() => ({
    text: document.body.innerText.slice(0, 400),
    url: location.href,
  }));
  const loggedIn = state.text.toLowerCase().includes('sign out') || state.text.toLowerCase().includes('logout');
  console.log('  LoggedIn:', loggedIn, '| text:', state.text.replace(/\n/g, ' ').slice(0, 150));

  const buf = await page.screenshot({ type: 'jpeg', quality: 88 });
  writeFileSync('/tmp/nexus-login.jpg', buf);
  console.log('  size:', buf.length);
  try {
    const url = await upload(buf, 'nexus-chat-community');
    console.log('  ✓', url);
    results['Nexus Chat Community'] = url;
  } catch (e) { console.error('  ✗', e.message); }
  await page.close();
}

await browser.close();

console.log('\nUpdating MongoDB...');
if (Object.keys(results).length) {
  await mongoose.connect(process.env.MONGODB_URI);
  const Project = (await import('./models/Project.js')).default;
  for (const [title, imageUrl] of Object.entries(results)) {
    const r = await Project.findOneAndUpdate({ title }, { $set: { imageUrl } }, { new: true });
    console.log(r ? `  DB ✓ ${title}` : `  DB ✗ ${title}`);
  }
  await mongoose.disconnect();
}
console.log('\nDone.');
