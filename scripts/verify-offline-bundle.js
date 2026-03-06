const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const requiredFiles = [
  'www/index.html',
  'www/manifest.webmanifest',
  'www/sw.js',
  'www/icons/icon-192.png',
  'www/icons/icon-512.png',
  'www/fonts/orbitron-v35.woff2',
  'www/fonts/share-tech-mono-v16.woff2'
];

const requiredSwAssets = [
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/fonts/orbitron-v35.woff2',
  '/fonts/share-tech-mono-v16.woff2'
];

const missingFiles = requiredFiles.filter(relPath => {
  const fullPath = path.join(rootDir, relPath);
  return !fs.existsSync(fullPath);
});

if (missingFiles.length > 0) {
  console.error('Missing required offline assets:');
  missingFiles.forEach(file => console.error(`- ${file}`));
  process.exit(1);
}

const swSource = fs.readFileSync(path.join(rootDir, 'www/sw.js'), 'utf8');
const missingSwEntries = requiredSwAssets.filter(asset => {
  return !swSource.includes(`'${asset}'`) && !swSource.includes(`"${asset}"`);
});

if (missingSwEntries.length > 0) {
  console.error('Service Worker ASSETS is missing required entries:');
  missingSwEntries.forEach(asset => console.error(`- ${asset}`));
  process.exit(1);
}

console.log('Offline bundle verification passed.');
