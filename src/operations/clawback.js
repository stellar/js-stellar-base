import xdr from '../generated/stellar-xdr_generated';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Creates a clawback operation.
 *
 * @function
 * @alias Operation.clawback
 *
 * @param {object} opts - Options object
 * @param {Asset}  opts.asset - The asset being clawed back.
 * @param {string} opts.amount - The amount of the asset to claw back.
 * @param {string} opts.from - The public key of the (muxed) account to claw back from.
 *
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @return {xdr.ClawbackOp}
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-operation
 */
export function clawback(opts = {}) {
  const attributes = {};

  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  attributes.asset = opts.asset.toXDRObject();
  attributes.from = decodeAddressToMuxedAccount(opts.from);

  const opAttributes = {
    body: xdr.OperationBody.clawback(new xdr.ClawbackOp(attributes))
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
