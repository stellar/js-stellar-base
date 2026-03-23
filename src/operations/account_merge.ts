import xdr from "../xdr.js";
import { decodeAddressToMuxedAccount } from "../util/decode_encode_muxed_account.js";
import {
  AccountMergeOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * Transfers native balance to destination account.
 *
 * @param opts - options object
 * @param opts.destination - destination to merge the source account into
 * @param opts.source - operation source account (defaults to
 *     transaction source)
 */
export function accountMerge(
  this: OperationClass,
  opts: AccountMergeOpts
): xdr.Operation {
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
