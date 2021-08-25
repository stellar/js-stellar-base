import clone from 'lodash/clone';
import xdr from './generated/stellar-xdr_generated';
import { Asset } from './asset';
import { LiquidityPoolFeeV18, getLiquidityPoolId } from './liquidity_pool_id';

/**
 * ChangeTrustAsset class represents a liquidity pool trustline change.
 *
 * @constructor
 * @param {Asset} assetA – The first asset in the Pool, it must respect the rule assetA < assetB. See `Asset.compare(A, B)` for more details on how assets are sorted.
 * @param {Asset} assetB – The second asset in the Pool, it must respect the rule assetA < assetB. See `Asset.compare(A, B)` for more details on how assets are sorted.
 * @param {number} fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export class ChangeTrustAsset {
  constructor(assetA, assetB, fee) {
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error('assetA is invalid');
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error('assetB is invalid');
    }
    if (Asset.compare(assetA, assetB) !== -1) {
      throw new Error('Assets are not in lexicographic order');
    }
    if (!fee || fee !== LiquidityPoolFeeV18) {
      throw new Error('fee is invalid');
    }

    this.assetA = assetA;
    this.assetB = assetB;
    this.fee = fee;
  }

  /**
   * Returns a change trust asset object from its XDR object representation.
   * @param {xdr.ChangeTrustAsset} ctAssetXdr - The asset XDR object.
   * @returns {ChangeTrustAsset | Asset}
   */
  static fromOperation(ctAssetXdr) {
    const assetType = ctAssetXdr.switch();
    if (assetType.name === 'assetTypePoolShare') {
      const liquidityPoolParameters = ctAssetXdr
        .liquidityPool()
        .constantProduct();
      return new this(
        Asset.fromOperation(liquidityPoolParameters.assetA()),
        Asset.fromOperation(liquidityPoolParameters.assetB()),
        liquidityPoolParameters.fee()
      );
    }

    return Asset.fromOperation(ctAssetXdr);
  }

  /**
   * Returns the XDR object for this change trust asset.
   *
   * Note: To convert from `Asset` to xdr.ChangeTrustAsset please refer to the
   * `Asset.toChangeTrustXDR` method.
   *
   * @returns {xdr.ChangeTrustAsset} XDR ChangeTrustAsset object.
   */
  toXDRObject() {
    const lpConstantProductParamsXdr = new xdr.LiquidityPoolConstantProductParameters(
      {
        assetA: this.assetA.toXDRObject(),
        assetB: this.assetB.toXDRObject(),
        fee: this.fee
      }
    );
    const lpParamsXdr = new xdr.LiquidityPoolParameters(
      'liquidityPoolConstantProduct',
      lpConstantProductParamsXdr
    );
    return new xdr.ChangeTrustAsset('assetTypePoolShare', lpParamsXdr);
  }

  /**
   * @returns {LiquidityPoolParameters} Liquidity pool parameters.
   */
  getLiquidityPoolParameters() {
    return clone({
      assetA: this.assetA,
      assetB: this.assetB,
      fee: this.fee
    });
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {AssetType.liquidityPoolShares} asset type. Can only be `liquidity_pool_shares`.
   */
  getAssetType() {
    return 'liquidity_pool_shares';
  }

  /**
   * @param {ChangeTrustAsset} other the ChangeTrustAsset to compare
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(other) {
    return (
      this.assetA.equals(other.assetA) &&
      this.assetB.equals(other.assetB) &&
      this.fee === other.fee
    );
  }

  toString() {
    const poolId = getLiquidityPoolId(
      'constant_product',
      this.getLiquidityPoolParameters()
    ).toString('hex');
    return `liquidity_pool:${poolId}`;
  }
}
