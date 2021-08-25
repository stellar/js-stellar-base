import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';
import xdr from './generated/stellar-xdr_generated';
import { Asset } from './asset';
import { Keypair } from './keypair';
import { LiquidityPoolFeeV18, getLiquidityPoolId } from './liquidity_pool_id';
import { StrKey } from './strkey';

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
export class ChangeTrustAsset {
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

    // Validate code & issuer.
    if ((code || issuer) && !/^[a-zA-Z0-9]{1,12}$/.test(code)) {
      throw new Error(
        'Asset code is invalid (maximum alphanumeric, 12 characters at max)'
      );
    }
    if (code && String(code).toLowerCase() !== 'xlm' && !issuer) {
      throw new Error('Issuer cannot be null');
    }
    if (issuer && !StrKey.isValidEd25519PublicKey(issuer)) {
      throw new Error('Issuer is invalid');
    }

    this.code = code;
    this.issuer = issuer;
    if (code) {
      // return early if it's an asset with code.
      return;
    }

    // Validate liquidity pool params.
    const { assetA, assetB, fee } = liquidityPoolParameters;
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
    this.liquidityPoolParameters = liquidityPoolParameters;
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
    let anum;
    let code;
    let issuer;
    let liquidityPoolParameters;
    switch (ctAssetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
        return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
        anum = ctAssetXdr.alphaNum4();
      /* falls through */
      case xdr.AssetType.assetTypeCreditAlphanum12():
        anum = anum || ctAssetXdr.alphaNum12();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode(), '\0');
        return new this(code, issuer);
      case xdr.AssetType.assetTypePoolShare():
        liquidityPoolParameters = ctAssetXdr.liquidityPool().constantProduct();
        return this.liquidityPoolShare({
          assetA: Asset.fromOperation(liquidityPoolParameters.assetA()),
          assetB: Asset.fromOperation(liquidityPoolParameters.assetB()),
          fee: liquidityPoolParameters.fee()
        });
      default:
        throw new Error(`Invalid asset type: ${ctAssetXdr.switch().name}`);
    }
  }

  /**
   * Returns the XDR object for this change trust asset.
   * @returns {xdr.ChangeTrustAsset} XDR ChangeTrustAsset object.
   */
  toXDRObject() {
    if (this.isNative()) {
      return xdr.ChangeTrustAsset.assetTypeNative();
    }

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
      return new xdr.ChangeTrustAsset('assetTypePoolShare', lpParamsXdr);
    }

    // pad code with null bytes if necessary
    const padLength = this.code.length <= 4 ? 4 : 12;
    const paddedCode = padEnd(this.code, padLength, '\0');

    if (this.code.length <= 4) {
      const xdrAsset = new xdr.AlphaNum4({
        assetCode: paddedCode,
        issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
      });
      return new xdr.ChangeTrustAsset('assetTypeCreditAlphanum4', xdrAsset);
    }

    const xdrAsset = new xdr.AlphaNum12({
      assetCode: paddedCode,
      issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
    });
    return new xdr.ChangeTrustAsset('assetTypeCreditAlphanum12', xdrAsset);
  }

  /**
   * @returns {string} asset code.
   */
  getCode() {
    return clone(this.code);
  }

  /**
   * @returns {string} asset issuer.
   */
  getIssuer() {
    return clone(this.issuer);
  }

  /**
   * @returns {LiquidityPoolParameters} Liquidity pool parameters.
   */
  getLiquidityPoolParameters() {
    return clone(this.liquidityPoolParameters);
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {string} asset type. Can be one of the following:
   *
   * * `native`
   * * `credit_alphanum4`
   * * `credit_alphanum12`
   * * `liquidity_pool_shares`
   */
  getAssetType() {
    if (this.isNative()) {
      return 'native';
    }
    if (this.isLiquidityPool()) {
      return 'liquidity_pool_shares';
    }
    if (this.code.length <= 4) {
      return 'credit_alphanum4';
    }
    return 'credit_alphanum12';
  }

  /**
   * @returns {boolean} `true` if this change trust asset object is the native asset.
   */
  isNative() {
    return this.code && this.code.toLowerCase() === 'xlm' && !this.issuer;
  }

  /**
   * @returns {boolean} `true` if this change trust asset object is a liquidity pool.
   */
  isLiquidityPool() {
    return !!this.liquidityPoolParameters;
  }

  /**
   * @param {ChangeTrustAsset} asset the ChangeTrustAsset to compare
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(asset) {
    return (
      this.code === asset.getCode() &&
      this.issuer === asset.getIssuer() &&
      this.liquidityPoolParameters === asset.getLiquidityPoolParameters()
    );
  }

  toString() {
    if (this.isNative()) {
      return 'native';
    }

    if (this.isLiquidityPool()) {
      const poolId = getLiquidityPoolId(
        'constant_product',
        this.getLiquidityPoolParameters()
      ).toString('hex');
      return `liquidity_pool:${poolId}`;
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }
}
