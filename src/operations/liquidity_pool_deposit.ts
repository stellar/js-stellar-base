import xdr from "../xdr.js";
import {
  LiquidityPoolDepositResult,
  LiquidityPoolDepositOpts,
  OperationAttributes,
  OperationClass,
} from "./types.js";

/**
 * Creates a liquidity pool deposit operation.
 *
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
export function liquidityPoolDeposit(
  this: OperationClass,
  opts: LiquidityPoolDepositOpts = {} as LiquidityPoolDepositOpts,
): xdr.Operation<LiquidityPoolDepositResult> {
  const { liquidityPoolId, maxAmountA, maxAmountB, minPrice, maxPrice } = opts;

  if (!liquidityPoolId) {
    throw new TypeError("liquidityPoolId argument is required");
  }

  // xdr.PoolId is typed only as a type alias (Hash = Opaque[]), not a runtime class.
  // Buffer.from produces the correct runtime value; cast to satisfy the type checker.
  const liquidityPoolIdXdr = Buffer.from(
    liquidityPoolId,
    "hex",
  ) as unknown as xdr.PoolId;

  if (!this.isValidAmount(maxAmountA, true)) {
    throw new TypeError(this.constructAmountRequirementsError("maxAmountA"));
  }
  const maxAmountAXdr: xdr.Int64 = this._toXDRAmount(maxAmountA);

  if (!this.isValidAmount(maxAmountB, true)) {
    throw new TypeError(this.constructAmountRequirementsError("maxAmountB"));
  }
  const maxAmountBXdr: xdr.Int64 = this._toXDRAmount(maxAmountB);

  if (minPrice === undefined) {
    throw new TypeError("minPrice argument is required");
  }
  const minPriceXdr: xdr.Price = this._toXDRPrice(minPrice);

  if (maxPrice === undefined) {
    throw new TypeError("maxPrice argument is required");
  }
  const maxPriceXdr: xdr.Price = this._toXDRPrice(maxPrice);

  const liquidityPoolDepositOp = new xdr.LiquidityPoolDepositOp({
    liquidityPoolId: liquidityPoolIdXdr,
    maxAmountA: maxAmountAXdr,
    maxAmountB: maxAmountBXdr,
    minPrice: minPriceXdr,
    maxPrice: maxPriceXdr,
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.liquidityPoolDeposit(liquidityPoolDepositOp),
  };

  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
