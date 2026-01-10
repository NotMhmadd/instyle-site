/* eslint-disable */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Source images folder (project root images/)
const SRC_DIR = path.resolve(__dirname, '..', 'images');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'lqip');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC_DIR).filter(f => /\.(jpe?g|png|avif)$/i.test(f));

Promise.all(files.map(async (file) => {
  const inPath = path.join(SRC_DIR, file);
  const name = path.parse(file).name;
  const outPath = path.join(OUT_DIR, name + '.webp');

  try {
    await sharp(inPath)
      .resize(16)
      .blur()
      .toFormat('webp')
      .toFile(outPath);
    console.log('wrote', outPath);
  } catch (err) {
    console.error('failed', inPath, err.message);
  }
}))
.then(() => console.log('LQIP generation complete'))
.catch(err => console.error(err));
