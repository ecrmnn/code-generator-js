'use strict';

const shuffle = require('./shuffle');
const letters = 'abcjdefghijklmnpqrstuvwxyz'.split('');

module.exports = function randomLetter() {
  return shuffle(letters)[0];
}