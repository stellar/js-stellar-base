import xdr from "../xdr.js";
import { LiquidityPoolDepositOpts, OperationClass } from "./types.js";
/**
 * Creates a liquidity pool deposit operation.
 *
 * @alias Operation.liquidityPoolDeposit
 * @see https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-deposit
 *
 * @param opts - Options object
 * @param opts.liquidityPoolId - The liquidity pool ID.
 * @param opts.maxAmountA - Maximum amount of first asset to deposit.
 * @param opts.maxAmountB - Maximum amount of second asset to deposit.
 * @param opts.minPrice - Minimum depositA/depositB price.
 * @param opts.minPrice.n - If `opts.minPrice` is an object: the price numerator
 * @param opts.minPrice.d - If `opts.minPrice` is an object: the price denominator
 * @param opts.maxPrice - Maximum depositA/depositB price.
 * @param opts.maxPrice.n - If `opts.maxPrice` is an object: the price numerator
 * @param opts.maxPrice.d - If `opts.maxPrice` is an object: the price denominator
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 */
export declare function liquidityPoolDeposit(this: OperationClass, opts?: LiquidityPoolDepositOpts): xdr.Operation;
