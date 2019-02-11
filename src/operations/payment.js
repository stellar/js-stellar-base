import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';

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
export function payment(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error('destination is invalid');
  }
  if (!opts.asset) {
    throw new Error('Must provide an asset for a payment operation');
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }

  const attributes = {};
  attributes.destination = Keypair.fromPublicKey(
    opts.destination
  ).xdrAccountId();
  attributes.asset = opts.asset.toXDRObject();
  attributes.amount = this._toXDRAmount(opts.amount);
  const paymentOp = new xdr.PaymentOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.payment(paymentOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
