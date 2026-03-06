import xdr from "./xdr.js";
import { Asset } from "./asset.js";
import { LiquidityPoolParameters } from "./get_liquidity_pool_id.js";
import type { AssetType } from "../types/index.js";
/**
 * LiquidityPoolAsset class represents a liquidity pool trustline change.
 *
 * @param assetA – The first asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param assetB – The second asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
 * @param fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export declare class LiquidityPoolAsset {
    assetA: Asset;
    assetB: Asset;
    fee: number;
    constructor(assetA: Asset, assetB: Asset, fee: number);
    /**
     * Returns a liquidity pool asset object from its XDR ChangeTrustAsset object
     * representation.
     *
     * @param ctAssetXdr - The asset XDR object.
     */
    static fromOperation(ctAssetXdr: xdr.ChangeTrustAsset): LiquidityPoolAsset;
    /**
     * Returns the `xdr.ChangeTrustAsset` object for this liquidity pool asset.
     *
     * Note: To convert from an {@link Asset `Asset`} to `xdr.ChangeTrustAsset`
     * please refer to the
     * {@link Asset.toChangeTrustXDRObject `Asset.toChangeTrustXDRObject`} method.
     */
    toXDRObject(): xdr.ChangeTrustAsset;
    /**
     * Returns liquidity pool parameters.
     */
    getLiquidityPoolParameters(): LiquidityPoolParameters;
    /**
     * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
     */
    getAssetType(): AssetType.liquidityPoolShares;
    /**
     * @param other - the LiquidityPoolAsset to compare
     */
    equals(other: LiquidityPoolAsset): boolean;
    toString(): string;
}
