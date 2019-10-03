import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';

/**
 * Returns a XDR PathPaymentStrictSendOp. A `PathPaymentStrictSend` operation send the specified amount to the
 * destination account crediting at least `destMin` of `destAsset`, optionally through a path. XLM payments create the destination
 * account if it does not exist.
 * @function
 * @alias Operation.pathPaymentStrictSend
 * @param {object} opts Options object
 * @param {Asset} opts.sendAsset - The asset to pay with.
 * @param {string} opts.sendAmount - Amount of sendAsset to send (excluding fees).
 * @param {string} opts.destination - The destination account to send to.
 * @param {Asset} opts.destAsset - The asset the destination will receive.
 * @param {string} opts.destMin - The minimum amount of destAsset to be received
 * @param {Asset[]} opts.path - An array of Asset objects to use as the path.
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.PathPaymentStrictSendOp} Path Payment Strict Receive operation
 */
export function pathPaymentStrictSend(opts) {
  switch (true) {
    case !opts.sendAsset:
      throw new Error('Must specify a send asset');
    case !this.isValidAmount(opts.sendAmount):
      throw new TypeError(this.constructAmountRequirementsError('sendAmount'));
    case !StrKey.isValidEd25519PublicKey(opts.destination):
      throw new Error('destination is invalid');
    case !opts.destAsset:
      throw new Error('Must provide a destAsset for a payment operation');
    case !this.isValidAmount(opts.destMin):
      throw new TypeError(this.constructAmountRequirementsError('destMin'));
    default:
      break;
  }

  const attributes = {};
  attributes.sendAsset = opts.sendAsset.toXDRObject();
  attributes.sendAmount = this._toXDRAmount(opts.sendAmount);
  attributes.destination = Keypair.fromPublicKey(
    opts.destination
  ).xdrAccountId();
  attributes.destAsset = opts.destAsset.toXDRObject();
  attributes.destMin = this._toXDRAmount(opts.destMin);

  const path = opts.path ? opts.path : [];
  attributes.path = path.map((x) => x.toXDRObject());

  const payment = new xdr.PathPaymentStrictSendOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.pathPaymentStrictSend(payment);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
