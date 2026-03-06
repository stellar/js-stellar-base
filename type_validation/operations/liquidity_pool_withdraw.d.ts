import xdr from "../xdr.js";
import { OperationClass, LiquidityPoolWithdrawOpts } from "./types.js";
/**
 * Creates a liquidity pool withdraw operation.
 *
 * @see https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-withdraw
 *
 * @alias Operation.liquidityPoolWithdraw
 * @param opts - Options object
 * @param opts.liquidityPoolId - The liquidity pool ID.
 * @param opts.amount - Amount of pool shares to withdraw.
 * @param opts.minAmountA - Minimum amount of first asset to withdraw.
 * @param opts.minAmountB - Minimum amount of second asset to withdraw.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 * @returns The resulting operation (xdr.LiquidityPoolWithdrawOp).
 */
export declare function liquidityPoolWithdraw(this: OperationClass, opts?: LiquidityPoolWithdrawOpts): xdr.Operation;
