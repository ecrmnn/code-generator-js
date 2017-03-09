#! /usr/bin/env node

'use strict';

console.time('Generation took');


const fs = require('fs');
const path = require('path');
const program = require('commander');
const readline = require('readline');
const pckg = require('../package.json');
const randomLetter = require('./letters');
const randomNumber = require('./numbers');

program
  .version(pckg.version, '-v --version')
  .option('-p, --pattern <p>', 'Code pattern l for letter, n for number and - for dash', 'll-nn-llnn')
  .option('-l, --length <l>', 'Number of codes to generate', 1)
  .option('-c, --case <c>', 'Number of codes to generate [upper] [lower]', 'lower')
  .option('-q, --quiet', 'When specified, does not log progress to the console when processing.')
  .parse(process.argv);

const codes = new Set();
const charsLength = program.pattern.length;
const lines = new Array(charsLength);

const programLength = program.length;
const upper = program.case === 'upper';
const quiet = program.quiet;

let buffer = new Buffer((charsLength + 1) * programLength);
let offset = 0;

let makeCode;

if (programLength > 100) {
  // it's worth making a dedicated function.
  for (var j = 0; j < charsLength; j++) {
    var line;
    var character = program.pattern.charCodeAt(j);
    if (character === 108) {
      if (upper) {
        line = 'letter = randomLetter() - 32;';
      } else {
        line = 'letter = randomLetter();';
      }
    } else if (character === 110) {
      line = 'letter = randomNumber();';
    } else {
      line = 'letter = 45;'; // '-'`
    }
    lines[j] = `
      ${line}
      buffer[offset++] = letter;
      hash = ((hash << 5) - hash) + letter;
      hash |= 0;
    `;
  }
  makeCode = new Function('buffer', 'offset', 'randomLetter', 'randomNumber', `
    'use strict';
    let hash = 0;
    let letter = 0;
    ${lines.join('\n')}
    return hash;
  `);
}
else {
  makeCode = function (buffer, offset, randomLetter, randomNumber) {
    let hash = 0;
    let letter = 0;
    for (var j = 0; j < charsLength; j++) {
      var line;
      var character = program.pattern.charCodeAt(j);
      if (character === 108) {
        if (upper) {
          letter = randomLetter() - 32;;
        } else {
          letter = randomLetter();;
        }
      } else if (character === 110) {
        letter = randomNumber();;
      } else {
        letter = 45; // '-'
      }
      buffer[offset++] = letter;
      hash = ((hash << 5) - hash) + letter;
      hash |= 0;
    }
    return hash;
  };
}


for (var i = 0; i < programLength; i++) {
  var hash = makeCode(buffer, offset, randomLetter, randomNumber);
  if (codes.has(hash)) {
    // try again.
    i--;
  }
  else {
    codes.add(hash);
    offset += charsLength;
    if (i < programLength - 1) {
      buffer[offset++] = 10;
    }
    if (!quiet) {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('Generated: ' + (i + 1) + '/' + programLength + ' codes');
    }
  }
}

if (offset < buffer.length) {
  buffer = buffer.slice(0, offset);
}

fs.writeFile('codes.txt', buffer, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log('\nDone. Codes saved to codes.txt');
  console.timeEnd('Generation took');
});
