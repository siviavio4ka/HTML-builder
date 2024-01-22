const fs = require('fs');
const path = require('path');

const folderPath = '03-files-in-folder/secret-folder';

const displayFiles = (filePath) => {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(filePath);
      return;
    }

    if (stats.isFile()) {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).slice(1);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = fileSizeInBytes / 1024;

      console.log(`${fileName.replace(/\.[^.]+$/, '')} - ${fileExtension} - ${fileSizeInKB.toFixed(3)}kb`);
    }
  });
}

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(folderPath);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    displayFiles(filePath);
  });
});
