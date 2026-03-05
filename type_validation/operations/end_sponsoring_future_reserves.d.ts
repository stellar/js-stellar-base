import xdr from "../xdr.js";
import { OperationClass, EndSponsoringFutureReservesOpts } from "./types.js";
/**
 * Create an "end sponsoring future reserves" operation.
 * @function
 * @alias Operation.endSponsoringFutureReserves
 * @param opts Options object
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 * @returns An end sponsoring future reserves operation.
 *
 * @example
 * const op = Operation.endSponsoringFutureReserves();
 *
 */
export declare function endSponsoringFutureReserves(this: OperationClass, opts?: EndSponsoringFutureReservesOpts): xdr.Operation;
