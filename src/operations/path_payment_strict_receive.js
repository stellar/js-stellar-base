import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';

/**
 * Returns a XDR PathPaymentStrictReceiveOp. A `PathPaymentStrictReceive` operation send the specified amount to the
 * destination account, optionally through a path. XLM payments create the destination
 * account if it does not exist.
 * @function
 * @alias Operation.pathPaymentStrictReceive
 * @param {object} opts Options object
 * @param {Asset} opts.sendAsset - The asset to pay with.
 * @param {string} opts.sendMax - The maximum amount of sendAsset to send.
 * @param {string} opts.destination - The destination account to send to.
 * @param {Asset} opts.destAsset - The asset the destination will receive.
 * @param {string} opts.destAmount - The amount the destination receives.
 * @param {Asset[]} opts.path - An array of Asset objects to use as the path.
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.PathPaymentStrictReceiveOp} Path Payment Strict Receive operation
 */
export function pathPaymentStrictReceive(opts) {
  switch (true) {
    case !opts.sendAsset:
      throw new Error('Must specify a send asset');
    case !this.isValidAmount(opts.sendMax):
      throw new TypeError(this.constructAmountRequirementsError('sendMax'));
    case !StrKey.isValidEd25519PublicKey(opts.destination):
      throw new Error('destination is invalid');
    case !opts.destAsset:
      throw new Error('Must provide a destAsset for a payment operation');
    case !this.isValidAmount(opts.destAmount):
      throw new TypeError(this.constructAmountRequirementsError('destAmount'));
    default:
      break;
  }

  const attributes = {};
  attributes.sendAsset = opts.sendAsset.toXDRObject();
  attributes.sendMax = this._toXDRAmount(opts.sendMax);
  attributes.destination = Keypair.fromPublicKey(
    opts.destination
  ).xdrAccountId();
  attributes.destAsset = opts.destAsset.toXDRObject();
  attributes.destAmount = this._toXDRAmount(opts.destAmount);

  const path = opts.path ? opts.path : [];
  attributes.path = path.map((x) => x.toXDRObject());

  const payment = new xdr.PathPaymentStrictReceiveOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.pathPaymentStrictReceive(payment);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
