'use strict';

const fs = require('fs');
const chai = require('chai');
const expect = require('chai').expect;
const execa = require('execa');

describe('Generate a single code', function () {
  let result;

  before(function (done) {
    execa.shell('node ./src/index.js').then(response => {
      result = response.stdout;
      done();
    }).catch(error => {
      console.log(error);
      done();
    });
  });

  it('should give success message', function () {
    const resultContainsSuccessMessage = result.indexOf('Generated: 1/1 codes\nDone. Codes saved to codes.txt');

    expect(resultContainsSuccessMessage).to.above(1);
  });

  it('should have generated one code', function () {
    const codes = fs.readFileSync('codes.txt', 'utf-8');
    const numberOfLines = codes.split('\n').length;

    expect(numberOfLines).to.be.equal(1);
  });
});

describe('Generate a thousand codes', function () {
  let result;

  before(function (done) {
    execa.shell('node ./src/index.js --length 1000').then(response => {
      result = response.stdout;
      done();
    }).catch(error => {
      console.log(error);
      done();
    });
  });

  it('should give success message', function () {
    const resultContainsSuccessMessage = result.indexOf('Generated: 1000/1000 codes\nDone. Codes saved to codes.txt');

    expect(resultContainsSuccessMessage).to.be.above(1);
  });

  it('should have generated one thousand codes', function () {
    const codes = fs.readFileSync('codes.txt', 'utf-8');
    const numberOfLines = codes.split('\n').length;

    expect(numberOfLines).to.be.equal(1000);
  });
});

describe('Generate a fifty codes using --pattern nnnnnn', function () {
  let result;

  before(function (done) {
    execa.shell('node ./src/index.js --pattern nnnnnn --length 50').then(response => {
      result = response.stdout;
      done();
    }).catch(error => {
      console.log(error);
      done();
    });
  });

  it('should give success message', function () {
    const resultContainsSuccessMessage = result.indexOf('Generated: 50/50 codes\nDone. Codes saved to codes.txt');

    expect(resultContainsSuccessMessage).to.be.above(1);
  });

  let contentOfSingleCode = '';

  it('should have generated fifty codes', function () {
    const codes = fs.readFileSync('codes.txt', 'utf-8');
    const numberOfLines = codes.split('\n').length;

    contentOfSingleCode = codes.split('\n')[0];

    expect(numberOfLines).to.be.equal(50);
  });

  it('codes should have a length of 6', function () {
    expect(contentOfSingleCode.length).to.be.equal(6);
  });

  it('should consist of 6 numbers', function () {
    let containsNumbers = true;
    contentOfSingleCode.split('').forEach(function (char) {
      if (isNaN(char)) {
        containsNumbers = false;
      }
    });

    expect(containsNumbers).to.be.equal(true);
  });
});