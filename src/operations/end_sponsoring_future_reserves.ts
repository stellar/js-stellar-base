import xdr from "../xdr.js";
import {
  EndSponsoringFutureReservesResult,
  OperationClass,
  EndSponsoringFutureReservesOpts,
  OperationAttributes,
} from "./types.js";

/**
 * Create an "end sponsoring future reserves" operation.
 * @param opts - Options object
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.endSponsoringFutureReserves();
 *
 */
export function endSponsoringFutureReserves(
  this: OperationClass,
  opts: EndSponsoringFutureReservesOpts = {},
): xdr.Operation<EndSponsoringFutureReservesResult> {
  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.endSponsoringFutureReserves(),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
