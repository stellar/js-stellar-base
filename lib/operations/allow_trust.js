'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allowTrust = allowTrust;

var _padEnd = require('lodash/padEnd');

var _padEnd2 = _interopRequireDefault(_padEnd);

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _keypair = require('../keypair');

var _strkey = require('../strkey');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
 * account to hold your account's credit for a given asset.
 * @function
 * @alias Operation.allowTrust
 * @param {object} opts Options object
 * @param {string} opts.trustor - The trusting account (the one being authorized)
 * @param {string} opts.assetCode - The asset code being authorized.
 * @param {boolean} opts.authorize - True to authorize the line, false to deauthorize.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.AllowTrustOp} Allow Trust operation
 */
function allowTrust(opts) {
  if (!_strkey.StrKey.isValidEd25519PublicKey(opts.trustor)) {
    throw new Error('trustor is invalid');
  }
  var attributes = {};
  attributes.trustor = _keypair.Keypair.fromPublicKey(opts.trustor).xdrAccountId();
  if (opts.assetCode.length <= 4) {
    var code = (0, _padEnd2.default)(opts.assetCode, 4, '\0');
    attributes.asset = _stellarXdr_generated2.default.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
  } else if (opts.assetCode.length <= 12) {
    var _code = (0, _padEnd2.default)(opts.assetCode, 12, '\0');
    attributes.asset = _stellarXdr_generated2.default.AllowTrustOpAsset.assetTypeCreditAlphanum12(_code);
  } else {
    throw new Error('Asset code must be 12 characters at max.');
  }
  attributes.authorize = opts.authorize;
  var allowTrustOp = new _stellarXdr_generated2.default.AllowTrustOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.allowTrust(allowTrustOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}