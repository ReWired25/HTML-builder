const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const files = readdir(path.join(__dirname, '/secret-folder'));

files.then(resolve => resolve.forEach(item => {
  fs.stat(path.join(__dirname, '/secret-folder', item), (err, data) => {
    if (err) throw err;

    if (data.isFile()) {
      console.log(`${item} - ${path.extname(item).slice(1)} - ${Math.ceil(data.size / 1024)}Kb`);
    }
  });
}));