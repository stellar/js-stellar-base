import xdr from '../generated/stellar-xdr_generated';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Create a payment operation.
 *
 * @function
 * @alias Operation.payment
 * @see https://developers.stellar.org/docs/start/list-of-operations/#payment
 *
 * @param {object}  opts - Options object
 * @param {string}  opts.destination  - destination account ID
 * @param {Asset}   opts.asset        - asset to send
 * @param {string}  opts.amount       - amount to send
 *
 * @param {bool}    [opts.withMuxing=true] - Indicates that any addresses that
 *     can be muxed accounts (M... addresses) should be fully interpreted as a
 *     muxed account. Disabling this will throw if M-addresses are used.
 * @param {string}  [opts.source]     - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns {xdr.Operation}   The resulting payment operation (xdr.PaymentOp)
 */
export function payment(opts) {
  opts.withMuxing = opts.withMuxing === undefined ? true : opts.withMuxing;

  if (!opts.asset) {
    throw new Error('Must provide an asset for a payment operation');
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }

  const attributes = {};
  try {
    attributes.destination = decodeAddressToMuxedAccount(
      opts.destination,
      opts.withMuxing
    );
  } catch (e) {
    throw new Error('destination is invalid; did you disable muxing?');
  }

  attributes.asset = opts.asset.toXDRObject();
  attributes.amount = this._toXDRAmount(opts.amount);
  const paymentOp = new xdr.PaymentOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.payment(paymentOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
