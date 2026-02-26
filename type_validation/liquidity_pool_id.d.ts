import { AssetType } from "../types/index.js";
import xdr from "./xdr.js";
/**
 * LiquidityPoolId class represents the asset referenced by a trustline to a
 * liquidity pool.
 *
 * @constructor
 * @param liquidityPoolId - The ID of the liquidity pool in string 'hex'.
 */
export declare class LiquidityPoolId {
    liquidityPoolId: string;
    constructor(liquidityPoolId: string);
    /**
     * Returns a liquidity pool ID object from its xdr.TrustLineAsset representation.
     * @param tlAssetXdr - The asset XDR object.
     */
    static fromOperation(tlAssetXdr: xdr.TrustLineAsset): LiquidityPoolId;
    /**
     * Returns the `xdr.TrustLineAsset` object for this liquidity pool ID.
     *
     * Note: To convert from {@link Asset `Asset`} to `xdr.TrustLineAsset` please
     * refer to the
     * {@link Asset.toTrustLineXDRObject `Asset.toTrustLineXDRObject`} method.
     */
    toXDRObject(): xdr.TrustLineAsset;
    /**
     * Returns the liquidity pool ID as a hex string.
     */
    getLiquidityPoolId(): string;
    /**
     * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
     */
    getAssetType(): AssetType.liquidityPoolShares;
    /**
     * @param asset LiquidityPoolId to compare.
     */
    equals(asset: LiquidityPoolId): boolean;
    /**
     * Returns a string representation of this liquidity pool ID.
     */
    toString(): string;
}
