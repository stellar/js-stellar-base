import isUndefined from 'lodash/isUndefined';
import xdr from '../generated/stellar-xdr_generated';

/**
 * Creates a liquidity pool withdraw operation.
 *
 * @function
 * @alias Operation.liquidityPoolWithdraw
 * @see https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-withdraw
 *
 * @param {object} opts - Options object
 * @param {string} opts.liquidityPoolId - The liquidity pool ID.
 * @param {string} opts.amount - Amount of pool shares to withdraw.
 * @param {string} opts.minAmounta - Minimum amount of first asset to withdraw.
 * @param {string} opts.minAmountB - Minimum amount of second asset to withdraw.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @returns {xdr.Operation}   The resulting operation (xdr.LiquidityPoolWithdrawOp).
 */
export function liquidityPoolWithdraw(opts = {}) {
  const attributes = {};
  if (!opts.liquidityPoolId) {
    throw new TypeError('liquidityPoolId argument is required');
  }
  attributes.liquidityPoolId = xdr.PoolId.fromXDR(opts.liquidityPoolId, 'hex');

  if (isUndefined(opts.amount)) {
    throw new TypeError('amount argument is required');
  }
  attributes.amount = this._toXDRAmount(opts.amount);

  if (isUndefined(opts.minAmounta)) {
    throw new TypeError('minAmounta argument is required');
  }
  attributes.minAmounta = this._toXDRAmount(opts.minAmounta);

  if (isUndefined(opts.minAmountB)) {
    throw new TypeError('minAmountB argument is required');
  }
  attributes.minAmountB = this._toXDRAmount(opts.minAmountB);

  const liquidityPoolWithdrawOp = new xdr.LiquidityPoolWithdrawOp(attributes);
  const opAttributes = {
    body: xdr.OperationBody.liquidityPoolWithdraw(liquidityPoolWithdrawOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
