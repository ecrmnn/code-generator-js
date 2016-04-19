'use strict';

const shuffle = require('./shuffle');
const numbers = '123456789'.split('');

module.exports = function randomNumber() {
  return shuffle(numbers)[0];
}