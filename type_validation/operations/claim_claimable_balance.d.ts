import xdr from "../xdr.js";
import { ClaimClaimableBalanceOpts, OperationClass } from "./types.js";
/**
 * Create a new claim claimable balance operation.
 * @alias Operation.claimClaimableBalance
 * @param opts - Options object
 * @param opts.balanceId - The claimable balance id to be claimed.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.claimClaimableBalance({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 */
export declare function claimClaimableBalance(this: OperationClass, opts?: ClaimClaimableBalanceOpts): xdr.Operation;
export declare function validateClaimableBalanceId(balanceId: unknown): void;
