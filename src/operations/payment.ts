import xdr from "../xdr.js";
import { decodeAddressToMuxedAccount } from "../util/decode_encode_muxed_account.js";
import { OperationAttributes, OperationClass, PaymentOpts } from "./types.js";

/**
 * Create a payment operation.
 *
 * @function
 * @alias Operation.payment
 * @see https://developers.stellar.org/docs/start/list-of-operations/#payment
 *
 * @param opts - options object
 * @param opts.destination - destination account ID
 * @param opts.asset - asset to send
 * @param opts.amount - amount to send
 * @param opts.source - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns The resulting payment operation (xdr.PaymentOp)
 */
export function payment(
  this: OperationClass,
  opts: PaymentOpts
): xdr.Operation {
  if (!opts.asset) {
    throw new Error("Must provide an asset for a payment operation");
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError("amount"));
  }

  let destination: xdr.MuxedAccount;
  try {
    destination = decodeAddressToMuxedAccount(opts.destination);
  } catch (e) {
    throw new Error("destination is invalid");
  }

  const paymentOp = new xdr.PaymentOp({
    destination,
    asset: opts.asset.toXDRObject(),
    amount: this._toXDRAmount(opts.amount)
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.payment(paymentOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
