import xdr from "./xdr.js";
export type AssetType = "credit_alphanum4" | "credit_alphanum12" | "liquidity_pool_shares" | "native";
/**
 * Asset class represents an asset, either the native asset (`XLM`)
 * or an asset code / issuer account ID pair.
 *
 * An asset describes an asset code and issuer pair. In the case of the native
 * asset XLM, the issuer will be undefined.
 */
export declare class Asset {
    readonly code: string;
    readonly issuer: string | undefined;
    /**
     * @param code - The asset code.
     * @param issuer - The account ID of the issuer.
     */
    constructor(code: string, issuer?: string);
    /**
     * Returns an asset object for the native asset.
     */
    static native(): Asset;
    /**
     * Returns an asset object from its XDR object representation.
     * @param assetXdr - The asset xdr object.
     */
    static fromOperation(assetXdr: xdr.Asset): Asset;
    /**
     * Returns the xdr.Asset object for this asset.
     */
    toXDRObject(): xdr.Asset;
    /**
     * Returns the xdr.ChangeTrustAsset object for this asset.
     */
    toChangeTrustXDRObject(): xdr.ChangeTrustAsset;
    /**
     * Returns the xdr.TrustLineAsset object for this asset.
     */
    toTrustLineXDRObject(): xdr.TrustLineAsset;
    /**
     * Returns the would-be contract ID (`C...` format) for this asset on a given
     * network.
     *
     * @param networkPassphrase - indicates which network the contract
     *    ID should refer to, since every network will have a unique ID for the
     *    same contract (see {@link Networks} for options)
     *
     * @warning This makes no guarantee that this contract actually *exists*.
     */
    contractId(networkPassphrase: string): string;
    /**
     * Returns the xdr object for this asset.
     * @param xdrAsset - The xdr asset constructor.
     */
    private _toXDRObject;
    /**
     * Returns the asset code
     */
    getCode(): string;
    /**
     * Returns the asset issuer
     */
    getIssuer(): string | undefined;
    /**
     * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
     * Returns the asset type. Can be one of following types:
     *
     *  - `native`,
     *  - `credit_alphanum4`,
     *  - `credit_alphanum12`, or
     *  - `unknown` as the error case (which should never occur)
     */
    getAssetType(): AssetType | "unknown";
    /**
     * Returns the raw XDR representation of the asset type
     */
    getRawAssetType(): xdr.AssetType;
    /**
     * Returns true if this asset object is the native asset.
     */
    isNative(): boolean;
    /**
     * Returns true if this asset equals the given asset.
     *
     * @param asset - Asset to compare
     */
    equals(asset: Asset): boolean;
    toString(): string;
    /**
     * Compares two assets according to the criteria:
     *
     *  1. First compare the type (native < alphanum4 < alphanum12).
     *  2. If the types are equal, compare the assets codes.
     *  3. If the asset codes are equal, compare the issuers.
     *
     * @param assetA - the first asset
     * @param assetB - the second asset
     */
    static compare(assetA: Asset, assetB: Asset): -1 | 0 | 1;
}
