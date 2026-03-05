import xdr from "../xdr.js";
import { OperationClass, AllowTrustOpts } from "./types.js";
/**
 * @deprecated since v5.0
 *
 * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
 * account to hold your account's credit for a given asset.
 *
 * @alias Operation.allowTrust
 *
 * @param opts - Options object
 * @param opts.trustor - The trusting account (the one being authorized)
 * @param opts.assetCode - The asset code being authorized.
 * @param opts.authorize - `1` to authorize, `2` to authorize to maintain liabilities, and `0` to deauthorize.
 * @param opts.source - The source account (defaults to transaction source).
 * @returns Allow Trust operation
 */
export declare function allowTrust(this: OperationClass, opts: AllowTrustOpts): xdr.Operation;
