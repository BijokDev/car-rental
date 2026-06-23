import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, '../public/car-rental-images');

const optimizeImages = async () => {
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg)$/i)) {
        const inputPath = path.join(directoryPath, file);
        const outputPath = path.join(directoryPath, `${path.parse(file).name}.webp`);

        // Skip if the .webp version already exists
        if (fs.existsSync(outputPath)) {
          console.log(`Skipping ${file}, webp version already exists.`);
          continue;
        }

        console.log(`Optimizing ${file}...`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`Successfully created ${path.parse(file).name}.webp`);
      }
    }
    console.log('Image optimization complete.');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
};

optimizeImages();
