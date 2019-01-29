'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.payment = payment;

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

var _keypair = require('../keypair');

var _strkey = require('../strkey');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a payment operation.
 * @function
 * @alias Operation.payment
 * @param {object} opts Options object
 * @param {string} opts.destination - The destination account ID.
 * @param {Asset} opts.asset - The asset to send.
 * @param {string} opts.amount - The amount to send.
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.PaymentOp} Payment operation
 */
function payment(opts) {
  if (!_strkey.StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error('destination is invalid');
  }
  if (!opts.asset) {
    throw new Error('Must provide an asset for a payment operation');
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }

  var attributes = {};
  attributes.destination = _keypair.Keypair.fromPublicKey(opts.destination).xdrAccountId();
  attributes.asset = opts.asset.toXDRObject();
  attributes.amount = this._toXDRAmount(opts.amount);
  var paymentOp = new _stellarXdr_generated2.default.PaymentOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.payment(paymentOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}