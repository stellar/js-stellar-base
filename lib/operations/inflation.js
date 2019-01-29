'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inflation = inflation;

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This operation generates the inflation.
 * @function
 * @alias Operation.inflation
 * @param {object} [opts] Options object
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.InflationOp} Inflation operation
 */
function inflation() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.inflation();
  this.setSourceAccount(opAttributes, opts);
  return new _stellarXdr_generated2.default.Operation(opAttributes);
}