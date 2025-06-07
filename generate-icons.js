const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we need to install any dependencies
try {
  console.log('Installing required packages...');
  execSync('npm install sharp svg2png -D', { stdio: 'inherit' });
  console.log('Packages installed successfully');
} catch (error) {
  console.error('Failed to install packages:', error);
  process.exit(1);
}

// Dynamically import sharp (after ensuring it's installed)
const sharp = require('sharp');
const svg2png = require('svg2png');

const PUBLIC_DIR = path.join(__dirname, 'public');
const SVG_PATH = path.join(PUBLIC_DIR, 'custom-favicon.svg');
const SVG_CONTENT = fs.readFileSync(SVG_PATH);

// Generate favicon.ico (multiple sizes bundled)
async function generateFavicon() {
  try {
    console.log('Generating favicon.ico...');
    
    // Create different sized PNGs for the favicon (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size => svg2png(SVG_CONTENT, { width: size, height: size }))
    );
    
    // Use sharp to convert to ICO
    const favicon = await sharp(pngBuffers[1]) // Use 32x32 for primary image
      .toFormat('ico')
      .toBuffer();
    
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), favicon);
    console.log('favicon.ico created successfully');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

// Generate PNG app icons (192x192 and 512x512)
async function generateAppIcons() {
  try {
    console.log('Generating app icons...');
    
    // Generate 192x192 icon
    const png192 = await svg2png(SVG_CONTENT, { width: 192, height: 192 });
    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo192.png'), png192);
    console.log('logo192.png created successfully');
    
    // Generate 512x512 icon
    const png512 = await svg2png(SVG_CONTENT, { width: 512, height: 512 });
    fs.writeFileSync(path.join(PUBLIC_DIR, 'logo512.png'), png512);
    console.log('logo512.png created successfully');
  } catch (error) {
    console.error('Error generating app icons:', error);
  }
}

// Run the generation process
async function run() {
  try {
    await generateFavicon();
    await generateAppIcons();
    console.log('All icons generated successfully!');
    
    // Optional: Clean up the SVG file if not needed anymore
    // fs.unlinkSync(SVG_PATH);
    // console.log('Cleaned up temporary SVG file');
  } catch (error) {
    console.error('Error in icon generation process:', error);
  }
}

run();
