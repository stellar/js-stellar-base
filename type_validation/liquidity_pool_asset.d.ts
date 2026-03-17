import xdr from "./xdr.js";
import { Asset } from "./asset.js";
import { LiquidityPoolParameters } from "./get_liquidity_pool_id.js";
/**
 * LiquidityPoolAsset class represents a liquidity pool trustline change.
 */
export declare class LiquidityPoolAsset {
    assetA: Asset;
    assetB: Asset;
    fee: number;
    /**
     * @param assetA - The first asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
     * @param assetB - The second asset in the Pool, it must respect the rule assetA < assetB. See {@link Asset.compare} for more details on how assets are sorted.
     * @param fee - The liquidity pool fee. For now the only fee supported is `30`.
     */
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
     * Returns the asset type, always `"liquidity_pool_shares"`.
     *
     * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
     */
    getAssetType(): "liquidity_pool_shares";
    /**
     * Returns true if this liquidity pool asset equals the given one.
     *
     * @param other - the LiquidityPoolAsset to compare
     */
    equals(other: LiquidityPoolAsset): boolean;
    /** Returns a string representation in `liquidity_pool:<hex pool id>` format. */
    toString(): string;
}
