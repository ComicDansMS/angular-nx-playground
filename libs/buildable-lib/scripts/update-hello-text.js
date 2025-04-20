const fs = require('fs');
const path = require('path');

// Read hello.txt
const helloTxtPath = path.resolve(__dirname, '../src/lib/buildable-lib/hello.txt');
const helloText = fs.readFileSync(helloTxtPath, 'utf8').trim();

// Generate the TypeScript file
const tsContent = `export const HELLO_TEXT = '${helloText}';\n`;
const tsFilePath = path.resolve(__dirname, '../src/lib/buildable-lib/hello-text.ts');

// Write the TypeScript file
fs.writeFileSync(tsFilePath, tsContent);

console.log('Updated hello-text.ts with content from hello.txt');