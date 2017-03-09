'use strict';

module.exports = function randomLetter() {
  return 97 + Math.floor(Math.random() * 26);
}