import xdr from "./xdr.js";
import type { AssetType } from "../types/index.js";

/**
 * LiquidityPoolId class represents the asset referenced by a trustline to a
 * liquidity pool.
 *
 * @constructor
 * @param liquidityPoolId - The ID of the liquidity pool in string 'hex'.
 */
export class LiquidityPoolId {
  liquidityPoolId: string;

  constructor(liquidityPoolId: string) {
    if (!liquidityPoolId) {
      throw new Error("liquidityPoolId cannot be empty");
    }
    if (!/^[a-f0-9]{64}$/.test(liquidityPoolId)) {
      throw new Error("Liquidity pool ID is not a valid hash");
    }

    this.liquidityPoolId = liquidityPoolId;
  }

  /**
   * Returns a liquidity pool ID object from its xdr.TrustLineAsset representation.
   * @param tlAssetXdr - The asset XDR object.
   */
  static fromOperation(tlAssetXdr: xdr.TrustLineAsset): LiquidityPoolId {
    const assetType = tlAssetXdr.switch();
    if (assetType === xdr.AssetType.assetTypePoolShare()) {
      // tlAssetXdr.liquidityPoolId() is Buffer at runtime
      const liquidityPoolId = (
        tlAssetXdr.liquidityPoolId() as unknown as Buffer
      ).toString("hex");
      return new LiquidityPoolId(liquidityPoolId);
    }

    throw new Error(`Invalid asset type: ${assetType.name}`);
  }

  /**
   * Returns the `xdr.TrustLineAsset` object for this liquidity pool ID.
   *
   * Note: To convert from {@link Asset `Asset`} to `xdr.TrustLineAsset` please
   * refer to the
   * {@link Asset.toTrustLineXDRObject `Asset.toTrustLineXDRObject`} method.
   */
  toXDRObject(): xdr.TrustLineAsset {
    // TODO: check generated XDR types to make sure they are up to date.
    // xdr.PoolId exists at runtime but is typed as a plain type alias (Hash = Opaque[]).
    // Buffer.from produces the correct runtime value; cast to xdr.PoolId to satisfy the type checker.
    const xdrPoolId = Buffer.from(
      this.liquidityPoolId,
      "hex",
    ) as unknown as xdr.PoolId;
    return xdr.TrustLineAsset.assetTypePoolShare(xdrPoolId);
  }

  /**
   * Returns the liquidity pool ID as a hex string.
   */
  getLiquidityPoolId(): string {
    return String(this.liquidityPoolId);
  }

  /**
   * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
   */
  getAssetType(): AssetType.liquidityPoolShares {
    return "liquidity_pool_shares";
  }

  /**
   * @param asset LiquidityPoolId to compare.
   */
  equals(asset: LiquidityPoolId): boolean {
    return this.liquidityPoolId === asset.getLiquidityPoolId();
  }

  /**
   * Returns a string representation of this liquidity pool ID.
   */
  toString(): string {
    return `liquidity_pool:${this.liquidityPoolId}`;
  }
}
