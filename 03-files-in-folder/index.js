const fs = require('fs/promises');
const path = require('path');

(async () => {
  const folderPath = path.join(__dirname, 'secret-folder');
  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const fileName = path.parse(file.name).name;
      const fileExt = path.extname(file.name).slice(1);
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);
      const fileSize = stats.size;

      console.log(`${fileName} - ${fileExt} - ${fileSize}b`);
    }
  }
})();
