'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeTrust = changeTrust;

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _jsXdr = require('js-xdr');

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_INT64 = '9223372036854775807';

/**
 * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
 * trust line for a given asset from the source account to another. The issuer being
 * trusted and the asset code are in the given Asset object.
 * @function
 * @alias Operation.changeTrust
 * @param {object} opts Options object
 * @param {Asset} opts.asset - The asset for the trust line.
 * @param {string} [opts.limit] - The limit for the asset, defaults to max int64.
 *                                If the limit is set to "0" it deletes the trustline.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.ChangeTrustOp} Change Trust operation
 */
function changeTrust(opts) {
  var attributes = {};
  attributes.line = opts.asset.toXDRObject();
  if (!(0, _isUndefined2.default)(opts.limit) && !this.isValidAmount(opts.limit, true)) {
    throw new TypeError(this.constructAmountRequirementsError('limit'));
  }

  if (opts.limit) {
    attributes.limit = this._toXDRAmount(opts.limit);
  } else {
    attributes.limit = _jsXdr.Hyper.fromString(new _bignumber2.default(MAX_INT64).toString());
  }

  if (opts.source) {
    attributes.source = opts.source.masterKeypair;
  }
  var changeTrustOP = new _stellarXdr_generated2.default.ChangeTrustOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.changeTrust(changeTrustOP);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}