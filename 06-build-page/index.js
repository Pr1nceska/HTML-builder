const fs = require('fs/promises');
const path = require('path');

const PATHS = {
  dist: path.join(__dirname, 'project-dist'),
  template: path.join(__dirname, 'template.html'),
  components: path.join(__dirname, 'components'),
  styles: path.join(__dirname, 'styles'),
  assets: path.join(__dirname, 'assets'),
};

async function copyDir(source, destination) {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    entry.isDirectory()
      ? await copyDir(sourcePath, destPath)
      : await fs.copyFile(sourcePath, destPath);
  }
}

async function mergeStyles(stylesDir, outputFile) {
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  const cssContents = await Promise.all(
    files
      .filter(
        (file) =>
          file.isFile() && path.extname(file.name).toLowerCase() === '.css',
      )
      .map((file) => fs.readFile(path.join(stylesDir, file.name), 'utf-8')),
  );

  await fs.writeFile(outputFile, cssContents.join('\n'), 'utf-8');
}

async function processTemplate(templatePath, componentsDir, outputPath) {
  const template = await fs.readFile(templatePath, 'utf-8');
  let result = template;
  const componentRegex = /\{\{(\w+)\}\}/g;

  for (const match of template.matchAll(componentRegex)) {
    const componentName = match[1];
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    result = result.replace(`{{${componentName}}}`, componentContent);
  }

  await fs.writeFile(outputPath, result, 'utf-8');
}

(async () => {
  await fs.mkdir(PATHS.dist, { recursive: true });

  await Promise.all([
    processTemplate(
      PATHS.template,
      PATHS.components,
      path.join(PATHS.dist, 'index.html'),
    ),
    mergeStyles(PATHS.styles, path.join(PATHS.dist, 'style.css')),
    copyDir(PATHS.assets, path.join(PATHS.dist, 'assets')),
  ]);
})();
