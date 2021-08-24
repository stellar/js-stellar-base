import clone from 'lodash/clone';
import xdr from './generated/stellar-xdr_generated';
import { Asset } from './asset';
import { LiquidityPoolFeeV18, getLiquidityPoolId } from './liquidity_pool_id';

/**
 * ChangeTrustAsset class represents a trustline change to either a liquidity
 * pool, the native asset (`XLM`) or an issued asset with an asset code / issuer
 * account ID pair.
 *
 * In case of the native asset, the code will represent `XLM` while the issuer
 * and liquidityPoolParameters will be empty. For an issued asset, the code and
 * issuer will be valid and liquidityPoolParameters will be empty. For liquidity
 * pools, the liquidityPoolParameters will be valid and the remaining two fields
 * will be empty.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the asset issuer.
 * @param {LiquidityPoolParameters} liquidityPoolParameters – The liquidity pool parameters.
 * @param {Asset} liquidityPoolParameters.assetA – The first asset in the Pool, it must respect the rule assetA < assetB. See `Asset.compare(A, B)` for more details on how assets are sorted.
 * @param {Asset} liquidityPoolParameters.assetB – The second asset in the Pool, it must respect the rule assetA < assetB. See `Asset.compare(A, B)` for more details on how assets are sorted.
 * @param {number} liquidityPoolParameters.fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export class ChangeTrustAsset extends Asset {
  constructor(code, issuer, liquidityPoolParameters) {
    if (!code && !issuer && !liquidityPoolParameters) {
      throw new Error(
        'Must provide either code, issuer or liquidityPoolParameters'
      );
    }

    if ((code || issuer) && liquidityPoolParameters) {
      throw new Error(
        'Must provide either code (and optionally issuer) or liquidityPoolParameters but not both'
      );
    }

    if (!liquidityPoolParameters) {
      super(code, issuer);
      this.xdrClass = xdr.ChangeTrustAsset;
      return;
    }

    // We need to call the super constructor this way because Asset requires a valid code and issuer.
    super('XLM');
    this.code = undefined;

    // Validate liquidity pool params.
    const { assetA, assetB, fee } = liquidityPoolParameters;
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error('assetA is invalid');
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error('assetB is invalid');
    }
    if (!fee || fee !== LiquidityPoolFeeV18) {
      throw new Error('fee is invalid');
    }
    this.liquidityPoolParameters = liquidityPoolParameters;
    this.xdrClass = xdr.ChangeTrustAsset;
  }

  /**
   * Returns a change trust asset object of the type "credit asset". Can be a
   * native or an issued asset.
   * @static
   * @param {string} code - The asset code.
   * @param {string} issuer - The account ID of the asset issuer.
   * @return {ChangeTrustAsset}
   * @memberof ChangeTrustAsset
   */
  static creditAsset(code, issuer) {
    return new ChangeTrustAsset(code, issuer);
  }

  /**
   * Returns a change trust asset object of the type "liquidity pool shares".
   * @static
   * @param {LiquidityPoolParameters} liquidityPoolParameters – The liquidity pool parameters.
   * @param {Asset} liquidityPoolParameters.assetA – The first asset in the Pool, it must respect the rule assetA < assetB.
   * @param {Asset} liquidityPoolParameters.assetB – The second asset in the Pool, it must respect the rule assetA < assetB.
   * @param {number} liquidityPoolParameters.fee – The liquidity pool fee. For now the only fee supported is `30`.
   * @return {ChangeTrustAsset}
   * @memberof ChangeTrustAsset
   */
  static liquidityPoolShare(liquidityPoolParameters) {
    return new ChangeTrustAsset(undefined, undefined, liquidityPoolParameters);
  }

  /**
   * Returns a change trust asset object for the native asset.
   * @returns {ChangeTrustAsset}
   */
  static native() {
    return new ChangeTrustAsset('XLM');
  }

  /**
   * Returns a change trust asset object from its XDR object representation.
   * @param {xdr.ChangeTrustAsset} ctAssetXdr - The asset XDR object.
   * @returns {ChangeTrustAsset}
   */
  static fromOperation(ctAssetXdr) {
    if (ctAssetXdr.switch() === xdr.AssetType.assetTypePoolShare()) {
      const liquidityPoolParameters = ctAssetXdr
        .liquidityPool()
        .constantProduct();
      return this.liquidityPoolShare({
        assetA: Asset.fromOperation(liquidityPoolParameters.assetA()),
        assetB: Asset.fromOperation(liquidityPoolParameters.assetB()),
        fee: liquidityPoolParameters.fee()
      });
    }

    return super.fromOperation(ctAssetXdr);
  }

  /**
   * Returns the XDR object for this change trust asset.
   * @returns {xdr.ChangeTrustAsset} XDR ChangeTrustAsset object.
   */
  toXDRObject() {
    if (this.isLiquidityPool()) {
      const { assetA, assetB, fee } = this.getLiquidityPoolParameters();
      const lpConstantProductParamsXdr = new xdr.LiquidityPoolConstantProductParameters(
        {
          assetA: assetA.toXDRObject(),
          assetB: assetB.toXDRObject(),
          fee
        }
      );
      const lpParamsXdr = new xdr.LiquidityPoolParameters(
        'liquidityPoolConstantProduct',
        lpConstantProductParamsXdr
      );
      return new this.xdrClass('assetTypePoolShare', lpParamsXdr);
    }

    return super.toXDRObject();
  }

  /**
   * @returns {LiquidityPoolParameters} Liquidity pool parameters.
   */
  getLiquidityPoolParameters() {
    return clone(this.liquidityPoolParameters);
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {string} Asset type. Can be one of the following:
   *
   * * `native`
   * * `credit_alphanum4`
   * * `credit_alphanum12`
   * * `liquidity_pool_shares`
   */
  getAssetType() {
    if (this.isLiquidityPool()) {
      return 'liquidity_pool_shares';
    }

    return super.getAssetType();
  }

  /**
   * @returns {boolean} `true` if this change trust asset object is a liquidity pool.
   */
  isLiquidityPool() {
    return !!this.liquidityPoolParameters;
  }

  toString() {
    if (this.isLiquidityPool()) {
      const poolId = getLiquidityPoolId(
        'constant_product',
        this.getLiquidityPoolParameters()
      ).toString('hex');
      return `liquidity_pool:${poolId}`;
    }

    return super.toString();
  }
}
