import xdr from "./xdr.js";
import { Asset } from "./asset.js";
import {
  LiquidityPoolFeeV18,
  getLiquidityPoolId,
  LiquidityPoolParameters
} from "./get_liquidity_pool_id.js";
import type { AssetType } from "../types/index.js";

/**
 * LiquidityPoolAsset class represents a liquidity pool trustline change.
 *
 * @param assetA – The first asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param assetB – The second asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export class LiquidityPoolAsset {
  assetA: Asset;
  assetB: Asset;
  fee: number;

  constructor(assetA: Asset, assetB: Asset, fee: number) {
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error("assetA is invalid");
    }

    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error("assetB is invalid");
    }

    if (Asset.compare(assetA, assetB) !== -1) {
      throw new Error("Assets are not in lexicographic order");
    }

    if (!fee || fee !== LiquidityPoolFeeV18) {
      throw new Error("fee is invalid");
    }

    this.assetA = assetA;
    this.assetB = assetB;
    this.fee = fee;
  }

  /**
   * Returns a liquidity pool asset object from its XDR ChangeTrustAsset object
   * representation.
   *
   * @param ctAssetXdr - The asset XDR object.
   */
  static fromOperation(ctAssetXdr: xdr.ChangeTrustAsset): LiquidityPoolAsset {
    const assetType = ctAssetXdr.switch();

    if (assetType === xdr.AssetType.assetTypePoolShare()) {
      const liquidityPoolParameters = ctAssetXdr
        .liquidityPool()
        .constantProduct();

      return new this(
        Asset.fromOperation(liquidityPoolParameters.assetA()),
        Asset.fromOperation(liquidityPoolParameters.assetB()),
        liquidityPoolParameters.fee()
      );
    }

    throw new Error(`Invalid asset type: ${assetType.name}`);
  }

  /**
   * Returns the `xdr.ChangeTrustAsset` object for this liquidity pool asset.
   *
   * Note: To convert from an {@link Asset `Asset`} to `xdr.ChangeTrustAsset`
   * please refer to the
   * {@link Asset.toChangeTrustXDRObject `Asset.toChangeTrustXDRObject`} method.
   */
  toXDRObject(): xdr.ChangeTrustAsset {
    const lpConstantProductParamsXdr =
      new xdr.LiquidityPoolConstantProductParameters({
        assetA: this.assetA.toXDRObject(),
        assetB: this.assetB.toXDRObject(),
        fee: this.fee
      });
    const lpParamsXdr =
      xdr.LiquidityPoolParameters.liquidityPoolConstantProduct(
        lpConstantProductParamsXdr
      );

    return xdr.ChangeTrustAsset.assetTypePoolShare(lpParamsXdr);
  }

  /**
   * Returns liquidity pool parameters.
   */
  getLiquidityPoolParameters(): LiquidityPoolParameters {
    return {
      ...this,
      assetA: this.assetA,
      assetB: this.assetB,
      fee: this.fee
    };
  }

  /**
   * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
   */
  getAssetType(): AssetType.liquidityPoolShares {
    return "liquidity_pool_shares";
  }

  /**
   * @param other - the LiquidityPoolAsset to compare
   */
  equals(other: LiquidityPoolAsset): boolean {
    return (
      this.assetA.equals(other.assetA) &&
      this.assetB.equals(other.assetB) &&
      this.fee === other.fee
    );
  }

  toString(): string {
    const poolId = getLiquidityPoolId(
      "constant_product",
      this.getLiquidityPoolParameters()
    ).toString("hex");

    return `liquidity_pool:${poolId}`;
  }
}
