const fs = require('fs').promises;
const path = require('path');

async function copyDir(source, destination) {
  try {
    const destinationExists = await fs.access(destination)
      .then(() => true)
      .catch(() => false);

    if (!destinationExists) {
      await fs.mkdir(destination, { recursive: true });
    }

    const files = await fs.readdir(source);

    const destinationFiles = await fs.readdir(destination);

    const filesToDelete = destinationFiles.filter(file => !files.includes(file));
    await Promise.all(filesToDelete.map(file => fs.unlink(path.join(destination, file))));

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        await copyDir(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

const sourceFolder = '04-copy-directory/files';
const destinationFolder = '04-copy-directory/files-copy';

copyDir(sourceFolder, destinationFolder);