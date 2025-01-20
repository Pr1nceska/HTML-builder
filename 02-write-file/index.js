const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const closeProgram = () => {
  writeStream.end(() => {
    console.log('Goodbye!');
    rl.close();
    process.exit();
  });
};

console.log(
  'Welcome! Enter the text to write to the file (to exit, type "exit" or press Ctrl+C):',
);

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    closeProgram();
  }

  writeStream.write(input + '\n');
});

rl.on('close', closeProgram);
