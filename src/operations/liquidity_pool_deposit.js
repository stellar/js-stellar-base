import isUndefined from 'lodash/isUndefined';
import xdr from '../generated/stellar-xdr_generated';

/**
 * Create a liquidity pool deposit operation.
 *
 * @function
 * @alias Operation.liquidityPoolDeposit
 * @see https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-deposit
 *
 * @param {object} opts - Options object
 * @param {string} opts.liquidityPoolId - The liquidity pool ID.
 * @param {string} opts.maxAmounta      - Maximum amount of first asset to deposit.
 * @param {string} opts.maxAmountB      - Maximum amount of second asset to deposit.
 * @param {number|string|BigNumber|Object} opts.minPrice -  Minimum depositA/depositB price.
 * @param {number} opts.minPrice.n - If `opts.minPrice` is an object: the price numerator
 * @param {number} opts.minPrice.d - If `opts.minPrice` is an object: the price denominator
 * @param {number|string|BigNumber|Object} opts.maxPrice -  Maximum depositA/depositB price.
 * @param {number} opts.maxPrice.n - If `opts.maxPrice` is an object: the price numerator
 * @param {number} opts.maxPrice.d - If `opts.maxPrice` is an object: the price denominator
 * @param {string} [opts.source]        - The source account for the operation.
 *     Defaults to the transaction's source account.
 *
 * @returns {xdr.Operation}   The resulting operation (xdr.LiquidityPoolDepositOp).
 */
export function liquidityPoolDeposit(opts) {
  if (!opts) {
    throw new TypeError('opts cannot be empty');
  }

  const attributes = {};
  if (!opts.liquidityPoolId) {
    throw new TypeError('liquidityPoolId argument is required');
  }
  attributes.liquidityPoolId = xdr.PoolId.fromXDR(opts.liquidityPoolId, 'hex');

  if (isUndefined(opts.maxAmounta)) {
    throw new TypeError('maxAmounta argument is required');
  }
  attributes.maxAmounta = this._toXDRAmount(opts.maxAmounta);

  if (isUndefined(opts.maxAmountB)) {
    throw new TypeError('maxAmountB argument is required');
  }
  attributes.maxAmountB = this._toXDRAmount(opts.maxAmountB);

  if (isUndefined(opts.minPrice)) {
    throw new TypeError('minPrice argument is required');
  }
  attributes.minPrice = this._toXDRPrice(opts.minPrice);

  if (isUndefined(opts.maxPrice)) {
    throw new TypeError('maxPrice argument is required');
  }
  attributes.maxPrice = this._toXDRPrice(opts.maxPrice);

  const liquidityPoolDepositOp = new xdr.LiquidityPoolDepositOp(attributes);
  const opAttributes = {
    body: xdr.OperationBody.liquidityPoolDeposit(liquidityPoolDepositOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
