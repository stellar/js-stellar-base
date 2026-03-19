import xdr from "../xdr.js";
import { Asset } from "../asset.js";
import { LiquidityPoolAsset } from "../liquidity_pool_asset.js";
import {
  ChangeTrustOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

const MAX_INT64 = "9223372036854775807";

/**
 * A "change trust" operation adds, removes, or updates a trust line for a
 * given asset from the source account to another.
 *
 * @alias Operation.changeTrust
 * @param opts - Options object
 * @param opts.asset - The asset for the trust line.
 * @param opts.limit - The limit for the asset, defaults to max int64.
 *                     If the limit is set to "0" it deletes the trustline.
 * @param opts.source - The source account (defaults to transaction source).
 */
export function changeTrust(
  this: OperationClass,
  opts: ChangeTrustOpts
): xdr.Operation {
  let line: xdr.ChangeTrustAsset;

  if (opts.asset instanceof Asset) {
    line = opts.asset.toChangeTrustXDRObject();
  } else if (opts.asset instanceof LiquidityPoolAsset) {
    line = opts.asset.toXDRObject();
  } else {
    throw new TypeError("asset must be Asset or LiquidityPoolAsset");
  }

  if (opts.limit !== undefined && !this.isValidAmount(opts.limit, true)) {
    throw new TypeError(this.constructAmountRequirementsError("limit"));
  }

  const limit: xdr.Int64 = opts.limit
    ? this._toXDRAmount(opts.limit)
    : xdr.Int64.fromString(MAX_INT64);

  const changeTrustOp = new xdr.ChangeTrustOp({ line, limit });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.changeTrust(changeTrustOp)
  };

  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
