'use strict';

const numbers = '123456789'.split('').map(char => char.charCodeAt(0));

const len = numbers.length;

module.exports = function randomLetter() {
  const pos = Math.floor(Math.random() * len);
  return numbers[pos];
}