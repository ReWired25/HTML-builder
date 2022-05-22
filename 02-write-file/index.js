const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

stdout.write('Please write something on the command line!\n');
const writeStream = fs.createWriteStream(path.join(__dirname, 'final.txt'), 'utf-8');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  writeStream.write(data);
});

process.on('exit', () => stdout.write('Your inputs are written to final.txt! Have a nice day!'));
process.on('SIGINT', () => process.exit());
