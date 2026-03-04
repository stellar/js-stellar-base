import xdr from "../xdr.js";
import {
  LiquidityPoolDepositOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * Creates a liquidity pool deposit operation.
 *
 * @function
 * @alias Operation.liquidityPoolDeposit
 * @see https://developers.stellar.org/docs/start/list-of-operations/#liquidity-pool-deposit
 *
 * @param {object} opts - Options object
 * @param {string} opts.liquidityPoolId - The liquidity pool ID.
 * @param {string} opts.maxAmountA - Maximum amount of first asset to deposit.
 * @param {string} opts.maxAmountB - Maximum amount of second asset to deposit.
 * @param {number|string|BigNumber|Object} opts.minPrice -  Minimum depositA/depositB price.
 * @param {number} opts.minPrice.n - If `opts.minPrice` is an object: the price numerator
 * @param {number} opts.minPrice.d - If `opts.minPrice` is an object: the price denominator
 * @param {number|string|BigNumber|Object} opts.maxPrice -  Maximum depositA/depositB price.
 * @param {number} opts.maxPrice.n - If `opts.maxPrice` is an object: the price numerator
 * @param {number} opts.maxPrice.d - If `opts.maxPrice` is an object: the price denominator
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @returns {xdr.Operation} The resulting operation (xdr.LiquidityPoolDepositOp).
 */
export function liquidityPoolDeposit(
  this: OperationClass,
  opts: LiquidityPoolDepositOpts
): xdr.Operation {
  if (!opts.liquidityPoolId) {
    throw new TypeError("liquidityPoolId argument is required");
  }

  if (!this.isValidAmount(opts.maxAmountA, true)) {
    throw new TypeError(this.constructAmountRequirementsError("maxAmountA"));
  }

  if (!this.isValidAmount(opts.maxAmountB, true)) {
    throw new TypeError(this.constructAmountRequirementsError("maxAmountB"));
  }

  if (opts.minPrice === undefined) {
    throw new TypeError("minPrice argument is required");
  }

  if (opts.maxPrice === undefined) {
    throw new TypeError("maxPrice argument is required");
  }

  const liquidityPoolDepositOp = new xdr.LiquidityPoolDepositOp({
    liquidityPoolId: xdr.Hash.fromXDR(
      opts.liquidityPoolId,
      "hex"
    ) as unknown as xdr.PoolId,
    maxAmountA: this._toXDRAmount(opts.maxAmountA),
    maxAmountB: this._toXDRAmount(opts.maxAmountB),
    minPrice: this._toXDRPrice(opts.minPrice),
    maxPrice: this._toXDRPrice(opts.maxPrice)
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.liquidityPoolDeposit(liquidityPoolDepositOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(
    opAttributes as {
      sourceAccount: xdr.MuxedAccount | null;
      body: xdr.OperationBody;
    }
  );
}
