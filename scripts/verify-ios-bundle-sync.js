const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'www');
const iosPublicDir = path.join(rootDir, 'ios', 'App', 'App', 'public');
const iosConfigFiles = [
  path.join(rootDir, 'ios', 'App', 'App', 'capacitor.config.json'),
  path.join(rootDir, 'ios', 'App', 'App', 'config.xml'),
];

const iosExtraAllowed = new Set([
  'cordova.js',
  'cordova_plugins.js',
]);

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function collectFiles(baseDir) {
  const files = [];

  function walk(currentDir, relativeDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = relativeDir
        ? path.join(relativeDir, entry.name)
        : entry.name;

      if (entry.isDirectory()) {
        walk(absolutePath, relativePath);
      } else if (entry.isFile()) {
        files.push(toPosix(relativePath));
      }
    }
  }

  walk(baseDir, '');
  return files.sort();
}

if (!fs.existsSync(webDir)) {
  console.error('Missing web directory: www');
  process.exit(1);
}

if (!fs.existsSync(iosPublicDir)) {
  console.error('Missing iOS bundle directory: ios/App/App/public');
  console.error('Run: npx cap copy ios');
  process.exit(1);
}

const webFiles = collectFiles(webDir);
const iosFiles = collectFiles(iosPublicDir).filter((filePath) => !iosExtraAllowed.has(filePath));

const webFileSet = new Set(webFiles);
const iosFileSet = new Set(iosFiles);

const missingInIos = webFiles.filter((filePath) => !iosFileSet.has(filePath));
const extraInIos = iosFiles.filter((filePath) => !webFileSet.has(filePath));
const contentMismatches = [];

for (const filePath of webFiles) {
  if (!iosFileSet.has(filePath)) {
    continue;
  }

  const webContent = fs.readFileSync(path.join(webDir, filePath));
  const iosContent = fs.readFileSync(path.join(iosPublicDir, filePath));
  if (!webContent.equals(iosContent)) {
    contentMismatches.push(filePath);
  }
}

const missingConfigFiles = iosConfigFiles
  .filter((filePath) => !fs.existsSync(filePath))
  .map((filePath) => path.relative(rootDir, filePath).split(path.sep).join('/'));

if (missingInIos.length > 0 || extraInIos.length > 0 || contentMismatches.length > 0 || missingConfigFiles.length > 0) {
  console.error('iOS bundle is out of sync with www.');

  if (missingInIos.length > 0) {
    console.error('\nMissing in iOS bundle:');
    missingInIos.forEach((filePath) => console.error(`- ${filePath}`));
  }

  if (extraInIos.length > 0) {
    console.error('\nUnexpected extra files in iOS bundle:');
    extraInIos.forEach((filePath) => console.error(`- ${filePath}`));
  }

  if (contentMismatches.length > 0) {
    console.error('\nContent mismatches:');
    contentMismatches.forEach((filePath) => console.error(`- ${filePath}`));
  }

  if (missingConfigFiles.length > 0) {
    console.error('\nMissing iOS config files:');
    missingConfigFiles.forEach((filePath) => console.error(`- ${filePath}`));
  }

  console.error('\nRun: npx cap copy ios');
  process.exit(1);
}

console.log('iOS bundle sync verification passed.');
