const path = require('path');
const fs = require('fs');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');

function copyDir(folderArg, destArg) {
  const folder = folderArg;
  const dest = destArg;

  function copyFiles() {
    const files = readdir(path.join(folder));

    files.then(resolve => resolve.forEach(item => {
      fs.stat(path.join(folder, item), (err, data) => {
        if (err) throw err;

        if (data.isDirectory()) {
          copyDir(path.join(folder, item), path.join(dest, item));
        } else {
          copyFile(path.join(folder, item), path.join(dest, item));
        }
      });
    }));
  }

  mkdir(path.join(dest), {recursive: true})
    .then(resolve => {
      if (!resolve) {
        rm(path.join(dest), {recursive: true})
          .then(() => {
            mkdir(path.join(dest));
            copyFiles();
          });
      } else {
        copyFiles();
      }
    });
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));

console.log('Files copied successfully!');
