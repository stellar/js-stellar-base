import xdr from "../xdr.js";
import {
  OperationClass,
  LiquidityPoolWithdrawOpts,
  OperationAttributes
} from "./types.js";

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
 */
export function liquidityPoolWithdraw(
  this: OperationClass,
  opts: LiquidityPoolWithdrawOpts = {} as LiquidityPoolWithdrawOpts
): xdr.Operation {
  if (!opts.liquidityPoolId) {
    throw new TypeError("liquidityPoolId argument is required");
  }
  const liquidityPoolId = Buffer.from(
    opts.liquidityPoolId,
    "hex"
  ) as unknown as xdr.PoolId;

  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError("amount"));
  }
  const amount = this._toXDRAmount(opts.amount);

  if (!this.isValidAmount(opts.minAmountA, true)) {
    throw new TypeError(this.constructAmountRequirementsError("minAmountA"));
  }
  const minAmountA = this._toXDRAmount(opts.minAmountA);

  if (!this.isValidAmount(opts.minAmountB, true)) {
    throw new TypeError(this.constructAmountRequirementsError("minAmountB"));
  }
  const minAmountB = this._toXDRAmount(opts.minAmountB);

  const liquidityPoolWithdrawOp = new xdr.LiquidityPoolWithdrawOp({
    liquidityPoolId,
    amount,
    minAmountA,
    minAmountB
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.liquidityPoolWithdraw(liquidityPoolWithdrawOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
