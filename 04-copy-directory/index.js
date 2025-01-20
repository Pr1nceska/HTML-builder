const fs = require('fs/promises');
const path = require('path');

(async () => {
  const folderPath = path.join(__dirname, 'files-copy');
  await fs.mkdir(folderPath, { recursive: true });

  const existingFiles = await fs.readdir(path.join(__dirname, 'files-copy'));
  for (const file of existingFiles) {
    await fs.unlink(path.join(__dirname, 'files-copy', file));
  }

  const files = await fs.readdir(path.join(__dirname, 'files'));

  const copyPromises = files.map((file) => {
    const sourcePath = path.join(__dirname, 'files', file);
    const destPath = path.join(__dirname, 'files-copy', file);
    return fs.copyFile(sourcePath, destPath);
  });

  await Promise.all(copyPromises);
})();
