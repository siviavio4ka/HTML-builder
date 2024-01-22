const fs = require('fs').promises;
const path = require('path');

async function copyDir(source, destination) {
  try {
    const files = await fs.readdir(source);

    await fs.mkdir(destination, { recursive: true });

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

async function copyStyles(source, destination) {
  try {
    const files = await fs.readdir(source);

    await fs.mkdir(destination, { recursive: true });

    const cssFiles = files.filter(file => path.extname(file) === '.css');

    const stylesArray = await Promise.all(cssFiles.map(async file => {
      const filePath = path.join(source, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      return fileContent;
    }));

    const outputPath = path.join(destination, 'style.css');
    await fs.writeFile(outputPath, stylesArray.join('\n'));
  } catch (error) {
    console.error(error.message);
  }
}

async function buildPage() {
  const templatePath = '06-build-page/template.html';
  const componentsFolder = '06-build-page/components';
  const stylesFolder = '06-build-page/styles';
  const assetsFolder = '06-build-page/assets';
  const distFolder = '06-build-page/project-dist';

  try {
    await fs.mkdir(distFolder, { recursive: true });

    const templateContent = await fs.readFile(templatePath, 'utf8');
    const templateTags = templateContent.match(/{{\w+}}/g) || [];

    let modifiedContent = templateContent;
    for (const tag of templateTags) {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(componentsFolder, `${componentName}.html`);

      try {
        const componentContent = await fs.readFile(componentPath, 'utf8');
        modifiedContent = modifiedContent.replace(tag, componentContent);
      } catch (error) {
        console.error(`${componentName}: ${error.message}`);
      }
    }

    const indexPath = path.join(distFolder, 'index.html');
    await fs.writeFile(indexPath, modifiedContent);

    await copyStyles(stylesFolder, distFolder);
    await copyDir(assetsFolder, path.join(distFolder, 'assets'));
  } catch (error) {
    console.error(error.message);
  }
}

buildPage();