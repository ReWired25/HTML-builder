const fs = require('fs');
const path = require('path');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');

// ~~~~~ function from 04 task ~~~~~ //

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

// ~~~~~ function from 05 task ~~~~~ //

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

// ~~~~~ actual functional ~~~~~ //

mkdir(path.join(__dirname, 'project-dist'), {recursive: true})
  .then(resolve => {
    if (!resolve) {
      rm(path.join(__dirname, 'project-dist'), {recursive: true})
        .then(() => {
          mkdir(path.join(__dirname, 'project-dist'));
          buildFunc();
        });
    } else {
      buildFunc();
    }
  });

function buildFunc() {
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'));

  let templateData = '';
  readStream.on('data', data => templateData += data);
  readStream.on('end', () => {
    let reg = templateData.match(/{{[a-z]*}}/gi);

    const compFiles = readdir(path.join(__dirname, 'components'));
    compFiles.then(resolve => {

      // console.log(resolve); // path.extname(item) === '.html'
      // console.log(reg);     // item.slice(2, -2);
      let finalHtml = templateData;
      let count = 0;

      reg.forEach(regName => {
        resolve.forEach(compItem => {
          if (path.extname(compItem) === '.html' && compItem.slice(0, -5) === regName.slice(2, -2)) {

            const readComp = fs.createReadStream(path.join(__dirname, 'components', compItem));
            let strComp = '';
            readComp.on('data', data => strComp += data);
            readComp.on('end', () => {
              const regArg = new RegExp(`${regName}`);

              finalHtml = finalHtml.replace(regArg, strComp);
              count++;

              if (count === reg.length) {
                const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                writeStream.write(finalHtml);
              }
            });
          }
        });
      });
    });
  });

  mergeFunc(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'style.css'));
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

// console.log(templateData.match(/\{{[a-z]*}}$/));