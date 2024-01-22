const fs = require('fs');
const filePath = '02-write-file/output.txt';
const { stdin, stdout } = process;

const writeData = (data) => {
  fs.writeFile(filePath, data, { flag: 'a' }, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

writeData('');

stdout.write('Введи текст\n');

stdin.on('data', (data) => {
  const strData = data.toString().trim();
  if (strData.toLowerCase() === 'exit') {
    process.exit();
  }
  writeData(data);
});

process.on('exit', () => {
  stdout.write('пака');
});

process.on('SIGINT', () => {
  process.exit();
});