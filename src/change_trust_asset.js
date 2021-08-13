import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';
import { Asset } from './asset';
import xdr from './generated/stellar-xdr_generated';
import { Keypair } from './keypair';
import { LiquidityPoolFeeV18, liquidityPoolId } from './liquidity_pool_id';
import { StrKey } from './strkey';

// TODO: ChangeTrustAsset
// - [ ] ChangeTrustOp -> Asset to ChangeTrustAsset

/**
 * ChangeTrustAsset class represents a trustline change to either a liquidity
 * pool or an issued asset with an asset code / issuer account ID pair.
 *
 * The change trust asset can either represent a trustline change to the an
 * issued asset or to a liquidity pool. For an issued asset, the code and issuer
 * will be valid and liquidityPool parameters will be empty. For liquidity
 * pools, the liquidityPool parameters will all be valid while the code and
 * issuer will be empty.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the asset issuer.
 * @param {LiquidityPoolParams.ConstantProduct} liquidityPoolParams – the
 * liquidity pool parameters.
 * @param {Asset} liquidityPoolParams.asseta – the first asset in the Pool, it
 * must respect the rule assetA < assetB.
 * @param {Asset} liquidityPoolParams.assetB – the second asset in the Pool, it
 * must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParams.fee – the liquidity pool fee. For now the
 * only fee supported is `30`.
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

    // Validate liquidity pool params.
    if (!code && !issuer) {
      if (!liquidityPoolParams) {
        throw new Error('Must provide liquidityPoolParams or code & issuer');
      }
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
    }

    this.code = code;
    this.issuer = issuer;
    this.liquidityPoolParams = liquidityPoolParams;
  }

  /**
   * Returns a trustline asset object for the native asset.
   * @returns {ChangeTrustAsset}
   */
  static native() {
    return new ChangeTrustAsset('XLM');
  }

  /**
   * Returns a change trust asset object from its XDR object representation.
   * @param {xdr.ChangeTrustAsset} ctAssetXdr - The asset xdr object.
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
          asseta: liquidityPoolParams.asseta(),
          assetB: liquidityPoolParams.assetB(),
          fee: liquidityPoolParams.fee()
        });
      default:
        throw new Error(`Invalid asset type: ${ctAssetXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr object for this asset.
   * @returns {xdr.ChangeTrustAsset} XDR ChangeTrustAsset object
   */
  toXDRObject() {
    if (this.isNative()) {
      return xdr.ChangeTrustAsset.assetTypeNative();
    }

    if (this.isLiquidityPool()) {
      // TODO: review if this is correct
      const lpConstantProductParamsXdr = new xdr.LiquidityPoolConstantProductParameters(
        this.getLiquidityPoolParams()
      );
      const lpParamsXdr = new xdr.LiquidityPoolParameters(
        'liquidityPoolConstantProduct',
        lpConstantProductParamsXdr
      );
      return new xdr.ChangeTrustAsset('assetTypePoolShare', lpParamsXdr);
    }

    let xdrType;
    let xdrTypeString;
    if (this.code.length <= 4) {
      xdrType = xdr.AlphaNum4;
      xdrTypeString = 'assetTypeCreditAlphanum4';
    } else {
      xdrType = xdr.AlphaNum12;
      xdrTypeString = 'assetTypeCreditAlphanum12';
    }

    // pad code with null bytes if necessary
    const padLength = this.code.length <= 4 ? 4 : 12;
    const paddedCode = padEnd(this.code, padLength, '\0');

    // eslint-disable-next-line new-cap
    const assetType = new xdrType({
      assetCode: paddedCode,
      issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
    });

    return new xdr.ChangeTrustAsset(xdrTypeString, assetType);
  }

  /**
   * @returns {string} Asset code
   */
  getCode() {
    return clone(this.code);
  }

  /**
   * @returns {string} Asset issuer
   */
  getIssuer() {
    return clone(this.issuer);
  }

  /**
   * @returns {string} Liquidity pool ID
   */
  getLiquidityPoolParams() {
    return clone(this.liquidityPoolParams);
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {string} Asset type. Can be one of following types:
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
   * @returns {boolean}  true if this trustline asset object is the native asset.
   */
  isNative() {
    return this.code && !this.issuer;
  }

  /**
   * @returns {boolean} true if this trustline asset object is a liquidity pool.
   */
  isLiquidityPool() {
    return !!this.liquidityPoolParams;
  }

  /**
   * @param {ChangeTrustAsset} asset Asset to compare
   * @returns {boolean} true if this asset equals the given asset.
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
      const poolId = liquidityPoolId(
        xdr.LiquidityPoolType.liquidityPoolConstantProduct(),
        this.getLiquidityPoolParams()
      ).toString('hex');
      // TODO: review if this is correct
      return `liquidity_pool:${poolId}`;
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }
}
