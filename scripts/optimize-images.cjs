/* eslint-disable no-console */
/**
 * Image optimization for InStyle site.
 *
 * Goals:
 * - Convert huge PR*.png files into reasonable-size WebP (used by src/data/prints.js)
 * - Re-encode/resize oversized AVIF/JPG assets used by the site
 * - Ensure required PWA icon exists (apple-touch-icon.png)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');

const IMAGES_DIR = path.join(ROOT, 'images');
const PUBLIC_DIR = path.join(ROOT, 'public');

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function writeTempAndReplace(outPath, pipeline) {
  const tmpPath = `${outPath}.tmp`;
  await pipeline.toFile(tmpPath);
  fs.renameSync(tmpPath, outPath);
}

async function optimizePrints() {
  // The repo includes 32 print PNGs named 1PR.png..32PR.png.
  // For the site we generate 1PR.webp..32PR.webp (same numbering).
  const mapping = Array.from({ length: 32 }, (_, idx) => {
    const num = idx + 1;
    return { in: `${num}PR.png`, out: `${num}PR.webp` };
  });

  const originalsDir = path.join(IMAGES_DIR, 'originals', 'prints');
  ensureDir(originalsDir);

  const findInput = (fileName) => {
    const direct = path.join(IMAGES_DIR, fileName);
    if (exists(direct)) return direct;
    const archived = path.join(originalsDir, fileName);
    if (exists(archived)) return archived;
    return null;
  };

  let converted = 0;
  for (const item of mapping) {
    const inPath = findInput(item.in);
    const outPath = path.join(IMAGES_DIR, item.out);

    if (!inPath) {
      console.warn(`[prints] missing input: ${item.in}`);
      continue;
    }

    console.log(`[prints] ${path.basename(inPath)} -> ${path.basename(outPath)}`);

    const img = sharp(inPath, { failOn: 'none' }).rotate();
    const pipeline = img
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 });

    await writeTempAndReplace(outPath, pipeline);
    converted++;
  }

  // Move any remaining PR PNGs out of the way (huge files). Keep as backups.
  const files = fs.readdirSync(IMAGES_DIR);
  const prPngs = files.filter((f) => /^\d+PR\.png$/i.test(f));
  for (const f of prPngs) {
    const from = path.join(IMAGES_DIR, f);
    const to = path.join(originalsDir, f);
    if (!exists(to)) fs.renameSync(from, to);
  }

  console.log(`[prints] converted: ${converted}, archived originals: ${prPngs.length}`);
}

async function optimizeAvifGlob(dir, fileRegex, maxWidth, avifQuality) {
  if (!exists(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => fileRegex.test(f));
  for (const f of files) {
    const full = path.join(dir, f);
    console.log(`[avif] optimize ${path.relative(ROOT, full)}`);
    const img = sharp(full, { failOn: 'none' }).rotate();
    const pipeline = img
      .resize({ width: maxWidth, withoutEnlargement: true })
      .avif({ quality: avifQuality, effort: 4 });
    await writeTempAndReplace(full, pipeline);
  }
}

async function optimizeJpeg(filePath, maxWidth, jpegQuality) {
  if (!exists(filePath)) return;
  console.log(`[jpeg] optimize ${path.relative(ROOT, filePath)}`);
  const img = sharp(filePath, { failOn: 'none' }).rotate();
  const pipeline = img
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: jpegQuality, progressive: true, mozjpeg: true });
  await writeTempAndReplace(filePath, pipeline);
}

async function ensureAppleTouchIcon() {
  const outPath = path.join(PUBLIC_DIR, 'images', 'apple-touch-icon.png');
  if (exists(outPath)) return;

  const logo = path.join(PUBLIC_DIR, 'images', 'instyle-logo.png');
  if (!exists(logo)) {
    console.warn('[pwa] missing logo to generate apple-touch-icon.png');
    return;
  }

  console.log('[pwa] generating public/images/apple-touch-icon.png');
  ensureDir(path.dirname(outPath));

  const img = sharp(logo, { failOn: 'none' }).rotate();
  await img
    .resize({ width: 180, height: 180, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

async function optimizeNewProductImages() {
  const files = fs.readdirSync(IMAGES_DIR);
  const productPngs = files.filter((f) => /^(Bedroom|Tv|S|Table|C|Dining|CH)_\d+(\.\d+)?\.png$/i.test(f));

  let converted = 0;
  for (const f of productPngs) {
    const inPath = path.join(IMAGES_DIR, f);
    const outPath = path.join(IMAGES_DIR, f.replace(/\.png$/i, '.webp'));

    console.log(`[products] ${f} -> ${path.basename(outPath)}`);

    const img = sharp(inPath, { failOn: 'none' }).rotate();
    const pipeline = img
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 });

    await writeTempAndReplace(outPath, pipeline);

    // Remove the original PNG to save space
    fs.unlinkSync(inPath);
    converted++;
  }
  console.log(`[products] converted: ${converted}`);
}

async function optimizeJpegToWebp() {
  // Convert remaining JPEG files to WebP with proper naming
  const jpegMapping = [
    { in: 'Sofa 7.jpeg', out: 'S_7.webp' },
    { in: 'Sofa 8.jpeg', out: 'S_8.webp' },
    { in: 'Sofa 9.jpeg', out: 'S_9.webp' },
    { in: 'Wall 1.jpeg', out: 'Wall1.webp' },
    { in: 'Wall 2.jpeg', out: 'Wall2.webp' },
  ];

  let converted = 0;
  for (const item of jpegMapping) {
    const inPath = path.join(IMAGES_DIR, item.in);
    const outPath = path.join(IMAGES_DIR, item.out);

    if (!exists(inPath)) {
      // Already converted or missing
      continue;
    }

    console.log(`[jpeg->webp] ${item.in} -> ${item.out}`);

    const img = sharp(inPath, { failOn: 'none' }).rotate();
    const pipeline = img
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 });

    await writeTempAndReplace(outPath, pipeline);

    // Remove original JPEG after successful conversion
    fs.unlinkSync(inPath);
    converted++;
  }
  console.log(`[jpeg->webp] converted: ${converted}`);
}

async function main() {
  // 1) Prints are the biggest offenders.
  await optimizePrints();

  // 2) New product images
  await optimizeNewProductImages();

  // 2b) Convert remaining JPEG files to WebP
  await optimizeJpegToWebp();

  // 3) Paintings AVIF used via imports from /images.
  await optimizeAvifGlob(IMAGES_DIR, /^OP\d+\.avif$/i, 2000, 45);

  // 3) Operations gallery assets served from public.
  await optimizeAvifGlob(path.join(PUBLIC_DIR, 'ops'), /^OP\d+\.avif$/i, 1600, 45);

  // 4) Social share images and hero poster.
  await optimizeAvifGlob(path.join(PUBLIC_DIR, 'images', 'social'), /^post-.*\.avif$/i, 1600, 45);
  await optimizeJpeg(path.join(PUBLIC_DIR, 'images', 'hero-poster.jpg'), 1920, 80);

  // 5) Required icon referenced in index.html.
  await ensureAppleTouchIcon();

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
