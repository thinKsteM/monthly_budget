const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const bundleAssets = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'fonts/orbitron-v35.woff2',
  'fonts/share-tech-mono-v16.woff2',
];

const nativeRequiredFiles = [
  'ios/App/App/capacitor.config.json',
  'ios/App/App/config.xml',
];

const missingFiles = [];
const mismatchedFiles = [];

for (const relativePath of bundleAssets) {
  const webPath = path.join(rootDir, 'www', relativePath);
  const iosPath = path.join(rootDir, 'ios', 'App', 'App', 'public', relativePath);

  if (!fs.existsSync(webPath)) {
    missingFiles.push(`missing web asset: www/${relativePath}`);
    continue;
  }

  if (!fs.existsSync(iosPath)) {
    missingFiles.push(`missing iOS asset: ios/App/App/public/${relativePath}`);
    continue;
  }

  const webContent = fs.readFileSync(webPath);
  const iosContent = fs.readFileSync(iosPath);

  if (!webContent.equals(iosContent)) {
    mismatchedFiles.push(relativePath);
  }
}

for (const relativePath of nativeRequiredFiles) {
  const fullPath = path.join(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    missingFiles.push(`missing iOS config: ${relativePath}`);
  }
}

if (missingFiles.length > 0 || mismatchedFiles.length > 0) {
  console.error('iOS bundle is out of sync with www.');
  if (missingFiles.length > 0) {
    console.error('\nMissing files:');
    missingFiles.forEach((file) => console.error(`- ${file}`));
  }
  if (mismatchedFiles.length > 0) {
    console.error('\nMismatched files:');
    mismatchedFiles.forEach((file) => console.error(`- ${file}`));
  }
  console.error('\nRun: npx cap copy ios');
  process.exit(1);
}

console.log('iOS bundle sync verification passed.');
