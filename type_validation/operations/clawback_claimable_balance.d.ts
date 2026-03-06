import xdr from "../xdr.js";
import { ClawbackClaimableBalanceOpts, OperationClass } from "./types.js";
/**
 * Creates a clawback operation for a claimable balance.
 *
 * @alias Operation.clawbackClaimableBalance
 * @param opts - Options object
 * @param opts.balanceId - The claimable balance ID to be clawed back.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.clawbackClaimableBalance({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-claimable-balance-operation
 */
export declare function clawbackClaimableBalance(this: OperationClass, opts?: ClawbackClaimableBalanceOpts): xdr.Operation;
