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
 * and liquidityPoolParams will be empty. For an issued asset, the code and
 * issuer will be valid and liquidityPoolParams will be empty. For liquidity
 * pools, the liquidityPoolParams will be valid and the remaining two fields
 * will be empty.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the asset issuer.
 * @param {LiquidityPoolParams.ConstantProduct} liquidityPoolParams – The liquidity pool parameters.
 * @param {Asset} liquidityPoolParams.asseta – The first asset in the Pool, it must respect the rule assetA < assetB.
 * @param {Asset} liquidityPoolParams.assetB – The second asset in the Pool, it must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParams.fee – The liquidity pool fee. For now the only fee supported is `30`.
 */
export class ChangeTrustAsset {
  constructor(code, issuer, liquidityPoolParams) {
    if (!code && !issuer && !liquidityPoolParams) {
      throw new Error(
        'Must provide either code, issuer or liquidityPoolParams'
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
    const { asseta, assetB, fee } = liquidityPoolParams;
    if (!asseta || !(asseta instanceof Asset)) {
      throw new Error('asseta is invalid');
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error('assetB is invalid');
    }
    if (!fee || fee !== LiquidityPoolFeeV18) {
      throw new Error('fee is invalid');
    }
    this.liquidityPoolParams = liquidityPoolParams;
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
    let liquidityPoolParams;
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
        // TODO: review if this is correct
        liquidityPoolParams = ctAssetXdr.liquidityPool().constantProduct();
        return new this(null, null, {
          asseta: Asset.fromOperation(liquidityPoolParams.asseta()),
          assetB: Asset.fromOperation(liquidityPoolParams.assetB()),
          fee: liquidityPoolParams.fee()
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
      // TODO: review if this is correct
      const { asseta, assetB, fee } = this.getLiquidityPoolParams();
      const lpConstantProductParamsXdr = new xdr.LiquidityPoolConstantProductParameters(
        {
          asseta: asseta.toXDRObject(),
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
   * @returns {string} Asset code.
   */
  getCode() {
    return clone(this.code);
  }

  /**
   * @returns {string} Asset issuer.
   */
  getIssuer() {
    return clone(this.issuer);
  }

  /**
   * @returns {LiquidityPoolParams.ConstantProduct} Liquidity pool parameters.
   */
  getLiquidityPoolParams() {
    return clone(this.liquidityPoolParams);
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
    if (this.isNative()) {
      return 'native';
    }
    if (this.isLiquidityPool()) {
      return 'liquidity_pool_shares';
    }
    if (this.code.length >= 1 && this.code.length <= 4) {
      return 'credit_alphanum4';
    }
    if (this.code.length >= 5 && this.code.length <= 12) {
      return 'credit_alphanum12';
    }

    return null;
  }

  /**
   * @returns {boolean} `true` if this change trust asset object is the native asset.
   */
  isNative() {
    return this.code && !this.issuer;
  }

  /**
   * @returns {boolean} `true` if this change trust asset object is a liquidity pool.
   */
  isLiquidityPool() {
    return !!this.liquidityPoolParams;
  }

  /**
   * @param {ChangeTrustAsset} asset the ChangeTrustAsset to compare
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(asset) {
    return (
      this.code === asset.getCode() &&
      this.issuer === asset.getIssuer() &&
      this.liquidityPoolParams === asset.getLiquidityPoolParams()
    );
  }

  toString() {
    if (this.isNative()) {
      return 'native';
    }

    if (this.isLiquidityPool()) {
      const poolId = getLiquidityPoolId(
        'constant_product',
        this.getLiquidityPoolParams()
      ).toString('hex');
      return `liquidity_pool:${poolId}`;
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }
}
