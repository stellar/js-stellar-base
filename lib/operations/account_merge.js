'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.accountMerge = accountMerge;

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _keypair = require('../keypair');

var _strkey = require('../strkey');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Transfers native balance to destination account.
 * @function
 * @alias Operation.accountMerge
 * @param {object} opts Options object
 * @param {string} opts.destination - Destination to merge the source account into.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.AccountMergeOp} Account Merge operation
 */
function accountMerge(opts) {
  var opAttributes = {};
  if (!_strkey.StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error('destination is invalid');
  }
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.accountMerge(_keypair.Keypair.fromPublicKey(opts.destination).xdrAccountId());
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}