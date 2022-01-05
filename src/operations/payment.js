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
 * @param {string}  opts.destination  - The destination account ID.
 * @param {Asset}   opts.asset        - The asset to send.
 * @param {string}  opts.amount       - The amount to send.
 * @param {bool}    [opts.withMuxing] - Indicates that some parameters (either
 *     the `destination` or `source`, in this case) are M... addresses that
 *     should be interpreted fully as a muxed account. By default, this option
 *     is *enabled* now that muxed accounts are mature.
 * @param {string}  [opts.source]     - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns {xdr.Operation}   The resulting payment operation (xdr.PaymentOp)
 */
export function payment(opts) {
  if (!opts.asset) {
    throw new Error('Must provide an asset for a payment operation');
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }

  const muxing = opts.withMuxing === undefined ? true : opts.withMuxing;
  const attributes = {};
  try {
    attributes.destination = decodeAddressToMuxedAccount(
      opts.destination,
      muxing
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
