import xdr from "../xdr.js";
import { decodeAddressToMuxedAccount } from "../util/decode_encode_muxed_account.js";
import {
  AccountMergeOpts,
  AccountMergeResult,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * Transfers native balance to destination account.
 *
 * @function
 * @alias Operation.accountMerge
 *
 * @param opts - options object
 * @param opts.destination - destination to merge the source account into
 * @param opts.source - operation source account (defaults to
 *     transaction source)
 *
 * @returns an Account Merge operation (xdr.AccountMergeOp)
 */
export function accountMerge(
  this: OperationClass,
  opts: AccountMergeOpts
): xdr.Operation<AccountMergeResult> {
  let body: xdr.OperationBody;
  try {
    body = xdr.OperationBody.accountMerge(
      decodeAddressToMuxedAccount(opts.destination)
    );
  } catch {
    throw new Error("destination is invalid");
  }

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
