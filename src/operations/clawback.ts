import xdr from "../xdr.js";
import { decodeAddressToMuxedAccount } from "../util/decode_encode_muxed_account.js";
import { ClawbackOpts, OperationAttributes, OperationClass } from "./types.js";

/**
 * Creates a clawback operation.
 *
 * @function
 * @alias Operation.clawback
 *
 * @param opts - Options object
 * @param opts.asset - The asset being clawed back.
 * @param opts.amount - The amount of the asset to claw back.
 * @param opts.from - The public key of the (optionally-muxed)
 *     account to claw back from.
 * @param opts.source - The source account for the operation.
 *     Defaults to the transaction's source account.
 *
 * @returns The clawback operation
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-operation
 */
export function clawback(
  this: OperationClass,
  opts: ClawbackOpts
): xdr.Operation {
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError("amount"));
  }

  let from: xdr.MuxedAccount;
  try {
    from = decodeAddressToMuxedAccount(opts.from);
  } catch (e) {
    throw new Error("from address is invalid");
  }

  const clawbackOp = new xdr.ClawbackOp({
    amount: this._toXDRAmount(opts.amount),
    asset: opts.asset.toXDRObject(),
    from
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.clawback(clawbackOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
