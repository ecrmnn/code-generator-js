# code-generator-js
> JavaScript implementation of [code-generator](https://github.com/ecrmnn/code-generator)

[![Travis](https://img.shields.io/travis/ecrmnn/code-generator-js.svg?style=flat-square)](https://travis-ci.org/ecrmnn/code-generator-js.svg?branch=master)
[![npm version](https://img.shields.io/npm/v/code-generator-js.svg?style=flat-square)](http://badge.fury.io/js/code-generator-js)
[![npm downloads](https://img.shields.io/npm/dm/code-generator-js.svg?style=flat-square)](http://badge.fury.io/js/code-generator-js)
[![npm license](https://img.shields.io/npm/l/code-generator-js.svg?style=flat-square)](http://badge.fury.io/js/code-generator-js)

### Installation
```bash
npm install -g code-generator-js
```

### Tip
This implementation is very slow compared to the [original package](https://github.com/ecrmnn/code-generator) written in Go.
The only reason for building this package was to compare performance.
When generating 100.000 codes Go performs 530 % faster than this implementation.

### Options
```bash
-h, --help         output usage information
-v --version       output the version number
-p, --pattern <p>  Code pattern l for letter, n for number and - for dash
-l, --length <l>   Number of codes to generate
-c, --case <c>     Number of codes to generate [upper] [lower]
```

### Usage
Generate a single code. (``codes.txt`` is saved in current directory)
```bash
code
//=> Generated: 1/1 codes
//=> Done. Codes saved to codes.txt
//=> Generation took: 14.118ms
```

Generate codes using a pattern (``l`` for letters. ``n`` for number. ``-`` or any character for dash)
```bash
code --pattern nnnn-llll
//=> Generated: 1/1 codes
//=> Done. Codes saved to codes.txt
//=> Generation took: 14.118ms
```

Generate a thousand codes with ``nnnn-llll`` pattern
```bash
code --pattern nnnn-llll --length 1000
//=> Generated: 1000/1000 codes
//=> Done. Codes saved to codes.txt
//=> Generation took: 55.938ms
```

Generate a thousand uppercase codes with ``nnnn-llll`` pattern
```bash
code --pattern nnnn-llll --length 1000 --case upper
//=> Generated: 1000/1000 codes
//=> Done. Codes saved to codes.txt
//=> Generation took: 55.938ms
```

### Related
- [code-generator](https://github.com/ecrmnn/code-generator) - Go implementation

### License
MIT © [Daniel Eckermann](http://danieleckermann.com)