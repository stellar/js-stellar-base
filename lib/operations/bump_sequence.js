'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bumpSequence = bumpSequence;

var _jsXdr = require('js-xdr');

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This operation bumps sequence number.
 * @function
 * @alias Operation.bumpSequence
 * @param {object} opts Options object
 * @param {string} opts.bumpTo - Sequence number to bump to.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.BumpSequenceOp} Operation
 */
function bumpSequence(opts) {
  var attributes = {};

  if (!(0, _isString2.default)(opts.bumpTo)) {
    throw new Error('bumpTo must be a string');
  }

  try {
    // eslint-disable-next-line no-new
    new _bignumber2.default(opts.bumpTo);
  } catch (e) {
    throw new Error('bumpTo must be a stringified number');
  }

  attributes.bumpTo = _jsXdr.Hyper.fromString(opts.bumpTo);

  var bumpSequenceOp = new _stellarXdr_generated2.default.BumpSequenceOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.bumpSequence(bumpSequenceOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}