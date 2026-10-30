import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const BACKUP_DIR = path.join(ROOT_DIR, 'backup/images');
const PUBLIC_DIR = path.join(ROOT_DIR, 'client/public');
const ASSETS_DIR = path.join(ROOT_DIR, 'client/src/assets');
const GALLERY_DIR = path.join(PUBLIC_DIR, 'gallery');

// Ensure backups exist
if (!fs.existsSync(BACKUP_DIR)) {
  console.error('Backup directory does not exist! Please ensure backup is created first.');
  process.exit(1);
}

const stats = {
  beforeTotal: 0,
  afterTotal: 0,
  files: [],
};

async function optimizeFile({ inputPath, outputPath, webpPath, maxWidth, maxHeight, quality = 78, isLogo = false }) {
  const originalSize = fs.statSync(inputPath).size;
  stats.beforeTotal += originalSize;

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  let resizeOpts = null;
  if (maxWidth && metadata.width && metadata.width > maxWidth) {
    resizeOpts = { width: maxWidth, withoutEnlargement: true };
  } else if (maxHeight && metadata.height && metadata.height > maxHeight) {
    resizeOpts = { height: maxHeight, withoutEnlargement: true };
  }

  // 1. Generate WebP version if webpPath is provided
  if (webpPath) {
    let webpPipeline = sharp(inputPath);
    if (resizeOpts) webpPipeline = webpPipeline.resize(resizeOpts);
    await webpPipeline.webp({ quality }).toFile(webpPath);
  }

  // 2. Optimize original format (JPG / PNG)
  let optPipeline = sharp(inputPath);
  if (resizeOpts) optPipeline = optPipeline.resize(resizeOpts);

  if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
    await optPipeline.jpeg({ quality, mozjpeg: true }).toFile(outputPath + '.tmp');
  } else if (metadata.format === 'png') {
    if (isLogo) {
      await optPipeline.png({ quality: 85, compressionLevel: 9 }).toFile(outputPath + '.tmp');
    } else {
      await optPipeline.png({ quality, compressionLevel: 9, palette: true }).toFile(outputPath + '.tmp');
    }
  } else if (metadata.format === 'webp') {
    await optPipeline.webp({ quality }).toFile(outputPath + '.tmp');
  }

  fs.renameSync(outputPath + '.tmp', outputPath);
  const newSize = fs.statSync(outputPath).size;
  stats.afterTotal += newSize;

  stats.files.push({
    file: path.relative(ROOT_DIR, outputPath),
    beforeKB: Math.round(originalSize / 1024),
    afterKB: Math.round(newSize / 1024),
    webpKB: webpPath && fs.existsSync(webpPath) ? Math.round(fs.statSync(webpPath).size / 1024) : null,
  });
}

async function run() {
  console.log('🚀 Starting image optimization pipeline...\n');

  // --- 1. FAVICONS & ICONS ---
  console.log('📦 Optimizing Favicons...');
  const favSource = path.join(BACKUP_DIR, 'public/favicon.png');
  
  // 32x32
  await sharp(favSource).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  // 64x64
  await sharp(favSource).resize(64, 64).png().toFile(path.join(PUBLIC_DIR, 'favicon-64x64.png'));
  // 180x180 apple-touch-icon
  await sharp(favSource).resize(180, 180).png().toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  // Update public/favicon.png to small 64x64 for backward compatibility (< 5 KB)
  await sharp(favSource).resize(64, 64).png().toFile(path.join(PUBLIC_DIR, 'favicon.png'));

  // --- 2. LOGOS (Navbar & Footer) ---
  console.log('📦 Optimizing Logos...');
  // Logo in assets
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'assets/logo.png'),
    outputPath: path.join(ASSETS_DIR, 'logo.png'),
    webpPath: path.join(ASSETS_DIR, 'logo.webp'),
    maxWidth: 320,
    quality: 85,
    isLogo: true,
  });
  // Logo in public
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'public/logo.png'),
    outputPath: path.join(PUBLIC_DIR, 'logo.png'),
    webpPath: path.join(PUBLIC_DIR, 'logo.webp'),
    maxWidth: 320,
    quality: 85,
    isLogo: true,
  });

  // --- 3. HERO & BANNER IMAGES ---
  console.log('📦 Optimizing Hero & Large Banners...');
  // hero-bg in assets
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'assets/hero-bg.jpg'),
    outputPath: path.join(ASSETS_DIR, 'hero-bg.jpg'),
    webpPath: path.join(ASSETS_DIR, 'hero-bg.webp'),
    maxWidth: 1600,
    quality: 78,
  });
  // hero-bg in public
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'public/hero-bg.jpg'),
    outputPath: path.join(PUBLIC_DIR, 'hero-bg.jpg'),
    webpPath: path.join(PUBLIC_DIR, 'hero-bg.webp'),
    maxWidth: 1600,
    quality: 78,
  });
  // hero-banner in public
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'public/hero-banner.jpg'),
    outputPath: path.join(PUBLIC_DIR, 'hero-banner.jpg'),
    webpPath: path.join(PUBLIC_DIR, 'hero-banner.webp'),
    maxWidth: 1600,
    quality: 78,
  });
  // panna-home in assets & public
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'assets/panna-home.jpg'),
    outputPath: path.join(ASSETS_DIR, 'panna-home.jpg'),
    webpPath: path.join(ASSETS_DIR, 'panna-home.webp'),
    maxWidth: 1600,
    quality: 78,
  });
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'public/panna-home.jpg'),
    outputPath: path.join(PUBLIC_DIR, 'panna-home.jpg'),
    webpPath: path.join(PUBLIC_DIR, 'panna-home.webp'),
    maxWidth: 1600,
    quality: 78,
  });
  // Also optimize panna-home.png (was 5.4MB)
  if (fs.existsSync(path.join(BACKUP_DIR, 'public/panna-home.png'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'public/panna-home.png'),
      outputPath: path.join(PUBLIC_DIR, 'panna-home.png'),
      maxWidth: 1600,
      quality: 78,
    });
  }
  if (fs.existsSync(path.join(BACKUP_DIR, 'assets/panna-home.png'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'assets/panna-home.png'),
      outputPath: path.join(ASSETS_DIR, 'panna-home.png'),
      maxWidth: 1600,
      quality: 78,
    });
  }
  if (fs.existsSync(path.join(BACKUP_DIR, 'public/hero-bg.png'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'public/hero-bg.png'),
      outputPath: path.join(PUBLIC_DIR, 'hero-bg.png'),
      maxWidth: 1600,
      quality: 78,
    });
  }
  if (fs.existsSync(path.join(BACKUP_DIR, 'assets/hero-bg.png'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'assets/hero-bg.png'),
      outputPath: path.join(ASSETS_DIR, 'hero-bg.png'),
      maxWidth: 1600,
      quality: 78,
    });
  }

  // --- 4. TOURS CARD & SAFARI DESTINATION PHOTOS ---
  console.log('📦 Optimizing Tour Cards & Destination Images...');
  // gir-tours-card in assets
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'assets/gir-tours-card.jpg'),
    outputPath: path.join(ASSETS_DIR, 'gir-tours-card.jpg'),
    webpPath: path.join(ASSETS_DIR, 'gir-tours-card.webp'),
    maxWidth: 1200,
    quality: 78,
  });
  // gir-tours-card in public
  await optimizeFile({
    inputPath: path.join(BACKUP_DIR, 'public/gir-tours-card.jpg'),
    outputPath: path.join(PUBLIC_DIR, 'gir-tours-card.jpg'),
    webpPath: path.join(PUBLIC_DIR, 'gir-tours-card.webp'),
    maxWidth: 1200,
    quality: 78,
  });

  const safariPhotos = [
    { name: 'gir-safari.png', maxWidth: 1000 },
    { name: 'gir-home.jpg', maxWidth: 1000 },
    { name: 'gir-home.png', maxWidth: 1000 },
    { name: 'corbett-safari.png', maxWidth: 800 },
    { name: 'bandhavgarh-safari.png', maxWidth: 600 },
    { name: 'kanha-safari.png', maxWidth: 600 },
    { name: 'pench-safari.jpg', maxWidth: 1000 },
    { name: 'tadoba-safari.jpg', maxWidth: 1000 },
  ];

  for (const item of safariPhotos) {
    const pubPath = path.join(BACKUP_DIR, 'public', item.name);
    if (fs.existsSync(pubPath)) {
      const ext = path.extname(item.name);
      const baseName = path.basename(item.name, ext);
      await optimizeFile({
        inputPath: pubPath,
        outputPath: path.join(PUBLIC_DIR, item.name),
        webpPath: path.join(PUBLIC_DIR, `${baseName}.webp`),
        maxWidth: item.maxWidth,
        quality: 78,
      });
    }
  }

  // Assets versions of gir-home
  if (fs.existsSync(path.join(BACKUP_DIR, 'assets/gir-home.jpg'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'assets/gir-home.jpg'),
      outputPath: path.join(ASSETS_DIR, 'gir-home.jpg'),
      webpPath: path.join(ASSETS_DIR, 'gir-home.webp'),
      maxWidth: 1000,
      quality: 78,
    });
  }
  if (fs.existsSync(path.join(BACKUP_DIR, 'assets/gir-home.png'))) {
    await optimizeFile({
      inputPath: path.join(BACKUP_DIR, 'assets/gir-home.png'),
      outputPath: path.join(ASSETS_DIR, 'gir-home.png'),
      maxWidth: 1000,
      quality: 78,
    });
  }

  // --- 5. GALLERY IMAGES (gallery-01.jpg to gallery-41.jpg) ---
  console.log('📦 Optimizing Gallery Images...');
  const galleryFiles = fs.readdirSync(GALLERY_DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
  for (const gf of galleryFiles) {
    const backupFilePath = path.join(BACKUP_DIR, 'public/gallery', gf);
    const targetFilePath = path.join(GALLERY_DIR, gf);
    const ext = path.extname(gf);
    const baseName = path.basename(gf, ext);
    const webpTarget = path.join(GALLERY_DIR, `${baseName}.webp`);

    if (fs.existsSync(backupFilePath)) {
      await optimizeFile({
        inputPath: backupFilePath,
        outputPath: targetFilePath,
        webpPath: webpTarget,
        maxWidth: 1200,
        quality: 78,
      });
    }
  }

  console.log('\n=============================================================');
  console.log('✅ IMAGE OPTIMIZATION COMPLETE');
  console.log(`Original Total: ${(stats.beforeTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized Total: ${(stats.afterTotal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Savings: ${((1 - stats.afterTotal / stats.beforeTotal) * 100).toFixed(1)}% reduction!`);
  console.log('=============================================================\n');

  // Write JSON summary of before/after for reporting
  fs.writeFileSync(
    path.join(ROOT_DIR, 'scripts/image-optimization-report.json'),
    JSON.stringify(stats, null, 2)
  );
}

run().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
