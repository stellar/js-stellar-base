# JS Stellar Base

[![Build Status](https://travis-ci.org/stellar/js-stellar-base.svg)](https://travis-ci.org/stellar/js-stellar-base)
[![Code Climate](https://codeclimate.com/github/stellar/js-stellar-base/badges/gpa.svg)](https://codeclimate.com/github/stellar/js-stellar-base)
[![Coverage Status](https://coveralls.io/repos/stellar/js-stellar-base/badge.svg?branch=master&service=github)](https://coveralls.io/github/stellar/js-stellar-base?branch=master)

The stellar-base library is the lowest-level stellar helper library.  It consists of classes
to read, write, hash, and sign the xdr structures that are used in [stellar-core](https://github.com/stellar/stellar-core).
This is an implementation in JavaScript that can be used on either Node.js or web browsers.

## Quick start

Using npm to include js-stellar-base in your own project:
```shell
npm install --save stellar-base
```

For browsers, [use Bower to install it](#to-use-in-the-browser). It exports a
variable `StellarBase`. The example below assumes you have `stellar-base.js`
relative to your html file.

```html
<script src="stellar-base.js"></script>
<script>console.log(StellarBase);</script>
```

## Install

### To use as a module in a Node.js project
1. Install it using npm:

  ```shell
  npm install --save stellar-base
  ```
2. require/import it in your JavaScript:

  ```js
  var StellarBase = require('stellar-base');
  ```

### To use in the browser
1. Install it using [bower](http://bower.io):

  ```shell
  bower install stellar-base
  ```

2. Include it in the browser:

  ```html
  <script src="./bower_components/stellar-base/stellar-base.js"></script>
  <script>console.log(StellarBase);</script>
  ```

Note that you can also copy built JS files from [bower-js-stellar-base repo](https://github.com/stellar/bower-js-stellar-base) if you don't want to use Bower.

### To develop and test js-stellar-base itself
1. Clone the repo

  ```shell
  git clone https://github.com/stellar/js-stellar-base.git
  ```
2. Install dependencies inside js-stellar-base folder

  ```shell
  cd js-stellar-base
  npm install
  ```

## Usage
For information on how to use js-stellar-base, take a look at the docs in the [docs folder](./docs).

## Testing
To run all tests:
```shell
gulp test
```

To run a specific set of tests:
```shell
gulp test:node
gulp test:browser
```

Tests are also run on the [Travis CI js-stellar-base project](https://travis-ci.org/stellar/js-stellar-base) automatically.

## Documentation
Documentation for this repo lives inside the [docs folder](./docs).

## Contributing
Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## Publishing to npm
```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```
A new version will be published to npm **and** Bower by Travis CI.

npm >=2.13.0 required.
Read more about [npm version](https://docs.npmjs.com/cli/version).

## License
js-stellar-base is licensed under an Apache-2.0 license. See the [LICENSE](./LICENSE) file for details.

