const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

function mergeFunc(folderArg, distArg) {
  let folder = folderArg;
  let dist = distArg;

  const files = readdir(folder);
  let arr = [];

  files.then(resolve => resolve.forEach(item => {
    fs.stat(path.join(folder, item), (err, data) => {
      if (err) throw err;

      if (data.isFile() && path.extname(item) === '.css') {
        const readStream = fs.createReadStream(path.join(folder, item));
        const writeStream = fs.createWriteStream(dist, 'utf-8');

        let fullData = '';
        readStream.on('data', data => fullData += data);
        readStream.on('end', () => {
          arr.push(fullData);

          arr.forEach(styles => writeStream.write(styles));
        });
      }
    });
  }));
}

mergeFunc(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));
