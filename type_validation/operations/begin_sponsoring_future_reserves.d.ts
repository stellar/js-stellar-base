import xdr from "../xdr.js";
import { OperationClass, BeginSponsoringFutureReservesOpts } from "./types.js";
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
export declare function beginSponsoringFutureReserves(this: OperationClass, opts: BeginSponsoringFutureReservesOpts): xdr.Operation;
