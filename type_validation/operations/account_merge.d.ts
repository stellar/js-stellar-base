import xdr from "../xdr.js";
import { AccountMergeOpts, OperationClass } from "./types.js";
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
export declare function accountMerge(this: OperationClass, opts: AccountMergeOpts): xdr.Operation;
