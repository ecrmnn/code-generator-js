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
  .parse(process.argv);

const codes = [];

for (let i = 0; i < program.length; i++) {
  let code = '';

  program.pattern.split('').forEach(character => {
    if (character === 'l') {
      if (program.case === 'upper') {
        code += randomLetter().toUpperCase();
      } else {
        code += randomLetter();
      }
    } else if (character === 'n') {
      code += randomNumber();
    } else {
      code += '-';
    }
  });

  if (codes.indexOf(code) === -1) {
    codes.push(code);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('Generated: ' + codes.length + '/' + program.length + ' codes');
  }
}

fs.writeFile('codes.txt', codes.join('\n'), function (err) {
  if (err) {
    return console.log(err);
  }

  console.log('\nDone. Codes saved to codes.txt');
  console.timeEnd('Generation took');
});