import {default as xdr} from "../generated/stellar-xdr_generated";
import {Keypair} from "../keypair";
import {StrKey} from "../strkey";

/**
 * Create a payment operation.
 * @function
 * @alias Operation.payment
 * @param {object} opts
 * @param {string} opts.destination - The destination account ID.
 * @param {Asset} opts.asset - The asset to send.
 * @param {string} opts.amount - The amount to send.
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.PaymentOp}
 */
export const payment = function(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error("destination is invalid");
  }
  if (!opts.asset) {
    throw new Error("Must provide an asset for a payment operation");
  }
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }

  let attributes = {};
  attributes.destination  = Keypair.fromPublicKey(opts.destination).xdrAccountId();
  attributes.asset        = opts.asset.toXDRObject();
  attributes.amount       = this._toXDRAmount(opts.amount);
  let payment             = new xdr.PaymentOp(attributes);

  let opAttributes = {};
  opAttributes.body = xdr.OperationBody.payment(payment);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
};