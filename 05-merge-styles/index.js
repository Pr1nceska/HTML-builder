const fs = require('fs/promises');
const path = require('path');

(async () => {
  const distPath = path.join(__dirname, 'project-dist');
  await fs.mkdir(distPath, { recursive: true });

  const stylesPath = path.join(__dirname, 'styles');
  const files = await fs.readdir(stylesPath, { withFileTypes: true });

  const cssContents = await Promise.all(
    files
      .filter(
        (file) =>
          file.isFile() && path.extname(file.name).toLowerCase() === '.css',
      )
      .map((file) => fs.readFile(path.join(stylesPath, file.name), 'utf-8')),
  );

  const bundlePath = path.join(distPath, 'bundle.css');
  const bundleContent = cssContents.join('\n');
  await fs.writeFile(bundlePath, bundleContent, 'utf-8');
})();
