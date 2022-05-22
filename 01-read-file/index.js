const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let fullContent = '';
readStream.on('data', chunk => fullContent += chunk);
readStream.on('end', () => process.stdout.write(fullContent));
