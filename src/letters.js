'use strict';

const letters = 'abcjdefghijklmnpqrstuvwxyz'.split('').map(char => char.charCodeAt(0));
const len = letters.length;

module.exports = function randomLetter() {
  const pos = Math.floor(Math.random() * len);
  return letters[pos];
}