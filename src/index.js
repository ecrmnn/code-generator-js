#! /usr/bin/env node

'use strict';

console.time('Generation took');


var fs = require('fs');
var path = require('path');
var program = require('commander');
var readline = require('readline');
var pckg = require('../package.json');
var randomLetter = require('./letters');
var randomNumber = require('./numbers');

program
  .version(pckg.version, '-v --version')
  .option('-p, --pattern <p>', 'Code pattern l for letter, n for number and - for dash', 'll-nn-llnn')
  .option('-l, --length <l>', 'Number of codes to generate', 1)
  .option('-c, --case <c>', 'Number of codes to generate [upper] [lower]', 'lower')
  .option('-q, --quiet', 'When specified, does not log progress to the console when processing.')
  .parse(process.argv);

var codes = new Set();
var charsLength = program.pattern.length;
var lines = new Array(charsLength);

var programLength = program.length;
var upper = program.case === 'upper';
var quiet = program.quiet;

var buffer = new Buffer((charsLength + 1) * programLength);
var offset = 0;

var makeCode;

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
    var hash = 0;
    var letter = 0;
    ${lines.join('\n')}
    return hash;
  `);
}
else {
  makeCode = (buffer, offset, randomLetter, randomNumber) => {
    var hash = 0;
    var letter = 0;
    for (var j = 0; j < charsLength; j++) {
      var line;
      var character = program.pattern.charCodeAt(j);
      if (character === 108) {
        if (upper) {
          letter = randomLetter() - 32;
        } else {
          letter = randomLetter();
        }
      } else if (character === 110) {
        letter = randomNumber();
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

var run;
if (quiet) {
  run = function () {
    for (var i = 0; i < programLength; i++) {
      var hash = makeCode(buffer, offset, randomLetter, randomNumber);
      if (codes.has(hash)) {
        // try again.
        i--;
      }
      else {
        codes.add(hash);
        offset += charsLength;
        buffer[offset++] = 10;
      }
    }
  };
}
else {
  run = function () {
    for (var i = 0; i < programLength; i++) {
      var hash = makeCode(buffer, offset, randomLetter, randomNumber);
      if (codes.has(hash)) {
        // try again.
        i--;
      }
      else {
        codes.add(hash);
        offset += charsLength;
        buffer[offset++] = 10;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('Generated: ' + (i + 1) + '/' + programLength + ' codes');
      }
    }
  };
}

run();

// Remove the trailing newline.
offset--;

if (offset > 0 && offset < buffer.length) {
  buffer = buffer.slice(0, offset);
}

fs.writeFile('codes.txt', buffer, function (err) {
  if (err) {
    return console.log(err);
  }

  console.log('\nDone. Codes saved to codes.txt');
  console.timeEnd('Generation took');
});
