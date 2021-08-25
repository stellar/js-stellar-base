import clone from 'lodash/clone';
import xdr from './generated/stellar-xdr_generated';

/**
 * TrustLineAsset class represents the asset referenced by a trustline to a
 * liquidity pool.
 *
 * @constructor
 * @param {string} liquidityPoolId - The ID of the liquidity pool in string 'hex'.
 */
export class TrustLineAsset {
  constructor(liquidityPoolId) {
    if (!liquidityPoolId) {
      throw new Error('liquidityPoolId cannot be empty');
    }
    if (liquidityPoolId && !/^[a-fA-F0-9]{64}$/.test(liquidityPoolId)) {
      throw new Error('Liquidity pool ID is not a valid hash');
    }
    if (liquidityPoolId && liquidityPoolId !== liquidityPoolId.toLowerCase()) {
      throw new Error('Liquidity pool ID should be a lowerc case hash');
    }

    this.liquidityPoolId = liquidityPoolId;
  }

  /**
   * Returns a trustline asset object from its XDR object representation.
   * @param {xdr.TrustLineAsset} tlAssetXdr - The asset XDR object.
   * @returns {TrustLineAsset}
   */
  static fromOperation(tlAssetXdr) {
    const assetType = tlAssetXdr.switch();
    if (assetType === xdr.AssetType.assetTypePoolShare()) {
      const liquidityPoolId = tlAssetXdr.liquidityPoolId().toString('hex');
      return new this(liquidityPoolId);
    }

    throw new Error(`Invalid asset type: ${assetType.name}`);
  }

  /**
   * Returns the XDR object for this trustline asset.
   * @returns {xdr.TrustLineAsset} XDR TrustLineAsset object
   */
  toXDRObject() {
    const xdrPoolId = xdr.PoolId.fromXDR(this.liquidityPoolId, 'hex');
    return new xdr.TrustLineAsset('assetTypePoolShare', xdrPoolId);
  }

  /**
   * @returns {string} Liquidity pool ID.
   */
  getLiquidityPoolId() {
    return clone(this.liquidityPoolId);
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {AssetType.liquidityPoolShares} asset type. Can only be `liquidity_pool_shares`.
   */
  getAssetType() {
    return 'liquidity_pool_shares';
  }

  /**
   * @param {TrustLineAsset} asset TrustLineAsset to compare.
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(asset) {
    return this.liquidityPoolId === asset.getLiquidityPoolId();
  }

  toString() {
    return `liquidity_pool:${this.liquidityPoolId}`;
  }
}
