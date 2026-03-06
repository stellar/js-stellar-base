import xdr from "../xdr.js";
import { ChangeTrustOpts, OperationClass } from "./types.js";
/**
 * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
 * trust line for a given asset from the source account to another.
 *
 * @alias Operation.changeTrust
 * @param opts - Options object
 * @param opts.asset - The asset for the trust line.
 * @param opts.limit - The limit for the asset, defaults to max int64.
 *                     If the limit is set to "0" it deletes the trustline.
 * @param opts.source - The source account (defaults to transaction source).
 */
export declare function changeTrust(this: OperationClass, opts: ChangeTrustOpts): xdr.Operation;
