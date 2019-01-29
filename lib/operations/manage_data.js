'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manageData = manageData;

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This operation adds data entry to the ledger.
 * @function
 * @alias Operation.manageData
 * @param {object} opts Options object
 * @param {string} opts.name - The name of the data entry.
 * @param {string|Buffer} opts.value - The value of the data entry.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.ManageDataOp} Manage Data operation
 */
function manageData(opts) {
  var attributes = {};

  if (!((0, _isString2.default)(opts.name) && opts.name.length <= 64)) {
    throw new Error('name must be a string, up to 64 characters');
  }
  attributes.dataName = opts.name;

  if (!(0, _isString2.default)(opts.value) && !Buffer.isBuffer(opts.value) && opts.value !== null) {
    throw new Error('value must be a string, Buffer or null');
  }

  if ((0, _isString2.default)(opts.value)) {
    attributes.dataValue = Buffer.from(opts.value);
  } else {
    attributes.dataValue = opts.value;
  }

  if (attributes.dataValue !== null && attributes.dataValue.length > 64) {
    throw new Error('value cannot be longer that 64 bytes');
  }

  var manageDataOp = new _stellarXdr_generated2.default.ManageDataOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.manageDatum(manageDataOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}