const fs = require('fs');
const path = require('path');

// Path to the image directory
// Ref: https://github.com/faezetta/VMMRdb
// Contains 10GB+ of images so I will not include the data source in the repo.
// However, filter image set ./selected_images can be included (300+ MB).
const imageDir = path.join(__dirname, '../../VMMRdb');

// Output directory to save selected images
const outputDir = path.join(__dirname, './selected_images');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Execute the function
// Since dataset is not included in github repo, this function will not be executed.
// Output of this function is included in selected_images folder
// processFolders();
syncImagesWithDatabase();
// After the script, manually upload images to google cloud.



// Function to process subfolders and copy one image from each. Just the first one is good enough for our purposes.
function processFolders() {
  const subfolders = fs.readdirSync(imageDir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

  subfolders.forEach(subfolder => {
    const subfolderPath = path.join(imageDir, subfolder.name);
    const files = fs.readdirSync(subfolderPath);

    if (files.length > 0) {
      const selectedImage = files[0]; // Select the first image
      const sourcePath = path.join(subfolderPath, selectedImage);
      const destinationPath = path.join(outputDir, `${subfolder.name.replace(/ /g, '_')}.jpg`);

      fs.copyFileSync(sourcePath, destinationPath);
      console.log(`Copied ${selectedImage} from ${subfolder.name}`);
    }
  });
  const totalImages = fs.readdirSync(outputDir).length;
  console.log(`Total images copied: ${totalImages}`);
}

async function syncImagesWithDatabase() {
  try {
    const images = fs.readdirSync(outputDir);
    const cars = await prisma.car.findMany();

    const imageMap = new Map();
    images.forEach(image => {
      const [make, model] = image.split('_');
      const key = `${make}_${model}`;
      if (imageMap.has(key)) {
        // just keep one
        fs.unlinkSync(path.join(outputDir, image));
      } else {
        imageMap.set(key, image);
      }
    });
    console.log(cars.length);
    console.log(images.length);
    console.log('Remaining images in the map:', imageMap.size);

    for (const car of cars) {
      const key = `${car.make}_${car.model}`;
      if (imageMap.has(key)) {
        await prisma.car.update({
          where: { id: car.id },
          data: { car_image_path: imageMap.get(key) },
        });
        console.log(`Updated car entry: ${car.id} with image: ${imageMap.get(key)}`);
        imageMap.delete(key);
      } else {
        await prisma.car.delete({ where: { id: car.id } });
        console.log(`Deleted car entry: ${car.id}`);
      }
    }
    console.log('Remaining images in the map:', imageMap.size);

    for (const remainingImage of imageMap.values()) {
      const imagePath = path.join(outputDir, remainingImage);
      fs.unlinkSync(imagePath);
      console.log(`Deleted image: ${remainingImage}`);
    }
    
    const images2 = fs.readdirSync(outputDir);
    console.log('Remaining images:', images2.length);

    console.log('Database and images synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing images with database:', error);
  } finally {
    await prisma.$disconnect();
  }
}