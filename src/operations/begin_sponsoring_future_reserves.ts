import xdr from "../xdr.js";
import { StrKey } from "../strkey.js";
import { Keypair } from "../keypair.js";
import {
  OperationClass,
  BeginSponsoringFutureReservesOpts,
  OperationAttributes
} from "./types.js";

/**
 * Create a "begin sponsoring future reserves" operation.
 * @alias Operation.beginSponsoringFutureReserves
 * @param opts - Options object
 * @param opts.sponsoredId - The sponsored account id.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 * @returns A begin sponsoring future reserves operation.
 *
 * @example
 * const op = Operation.beginSponsoringFutureReserves({
 *   sponsoredId: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 * });
 *
 */
export function beginSponsoringFutureReserves(
  this: OperationClass,
  opts: BeginSponsoringFutureReservesOpts
): xdr.Operation {
  if (!StrKey.isValidEd25519PublicKey(opts.sponsoredId)) {
    throw new Error("sponsoredId is invalid");
  }
  const op = new xdr.BeginSponsoringFutureReservesOp({
    sponsoredId: Keypair.fromPublicKey(opts.sponsoredId).xdrAccountId()
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.beginSponsoringFutureReserves(op)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
