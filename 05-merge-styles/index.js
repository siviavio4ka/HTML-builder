const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  const stylesFolder = '05-merge-styles/styles';
  const distFolder = '05-merge-styles/project-dist';
  const outputFile = 'bundle.css';

  try {
    const files = await fs.readdir(stylesFolder);

    await fs.mkdir(distFolder, { recursive: true });

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(stylesFolder, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      return fileContent;
    }));

    const outputPath = path.join(distFolder, outputFile);
    await fs.writeFile(outputPath, stylesArray.join('\n'));
  } catch (error) {
    console.error(error.message);
  }
}

mergeStyles();