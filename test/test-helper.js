if (typeof window === 'undefined') {
  require('@babel/register');
  global.StellarBase = require('../src/index');
  global.chai = require('chai');
  global.chai.use(require('chai-as-promised'));
  global.sinon = require('sinon');
  global.expect = global.chai.expect;
} else {
  chai.use(require('chai-as-promised'));
}
