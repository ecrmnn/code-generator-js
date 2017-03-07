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
  .parse(process.argv);

var codes = new Set();
var chars = program.pattern;
var charsLength = chars.length;
var programLength = program.length;
var upper = program.case === 'upper';
for (var i = 0; i < programLength; i++) {
  var code = new Array(charsLength);

  for (var j = 0; j < charsLength; j++) {
    var character = chars.charCodeAt(j);
    if (character === 108) {
      if (upper) {
        code[j] = randomLetter() - 32;
      } else {
        code[j] = randomLetter();
      }
    } else if (character === 110) {
      code[j] = randomNumber();
    } else {
      code[j] = 45; // '-'
    }
  }
  if (codes.add(String.fromCharCode.apply(String, code))) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write('Generated: ' + codes.size + '/' + program.length + ' codes');
  }
}

fs.writeFile('codes.txt', Array.from(codes).join('\n'), function (err) {
  if (err) {
    return console.log(err);
  }

  console.log('\nDone. Codes saved to codes.txt');
  console.timeEnd('Generation took');
});