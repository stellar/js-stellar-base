import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';
import xdr from './generated/stellar-xdr_generated';
import { Keypair } from './keypair';
import { StrKey } from './strkey';

/**
 * TrustLineAsset class represents the asset referenced by a trustline to either
 * a liquidity pool, the native asset (`XLM`) or an issued asset with an asset
 * code / issuer account ID pair.
 *
 * In case of the native asset, the code will represent `XLM` while the issuer
 * and liquidityPoolId will be empty. For an issued asset, the code and issuer
 * will be valid and liquidityPoolId will be empty. For liquidity pools, the
 * liquidityPoolId will be valid and the remaining two fields will be empty.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the asset issuer.
 * @param {string} liquidityPoolId - The ID of the liquidity pool in string 'hex'.
 */
export class TrustLineAsset {
  constructor(code, issuer, liquidityPoolId) {
    if (!code && !issuer && !liquidityPoolId) {
      throw new Error('Must provide either code, issuer or liquidityPoolId');
    }

    if ((code || issuer) && liquidityPoolId) {
      throw new Error(
        'Must provide either code (and optionally issuer) or liquidityPoolId but not both'
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

    // Test if liquiditry pool ID is a hash.
    if (liquidityPoolId && !/^[a-fA-F0-9]{64}$/.test(liquidityPoolId)) {
      throw new Error('Liquidity pool ID is not a valid hash');
    }

    this.code = code;
    this.issuer = issuer;
    this.liquidityPoolId = liquidityPoolId;
  }

  /**
   * Returns a trustline asset object of the type "credit asset". Can be a
   * native or an issued asset.
   * @static
   * @param {string} code - The asset code.
   * @param {string} issuer - The account ID of the asset issuer.
   * @return {TrustLineAsset}
   * @memberof TrustLineAsset
   */
  static creditAsset(code, issuer) {
    return new TrustLineAsset(code, issuer);
  }

  /**
   * Returns a trustline asset object of the type "liquidity pool ID".
   * @static
   * @param {string} liquidityPoolId - The ID of the liquidity pool in string 'hex'.
   * @return {TrustLineAsset}
   * @memberof TrustLineAsset
   */
  static liquidityPoolShare(liquidityPoolId) {
    return new TrustLineAsset(undefined, undefined, liquidityPoolId);
  }

  /**
   * Returns a trustline asset object for the native asset.
   * @returns {TrustLineAsset}
   */
  static native() {
    return new TrustLineAsset('XLM');
  }

  /**
   * Returns a trustline asset object from its XDR object representation.
   * @param {xdr.TrustLineAsset} tlAssetXdr - The asset XDR object.
   * @returns {TrustLineAsset}
   */
  static fromOperation(tlAssetXdr) {
    let anum;
    let code;
    let issuer;
    let liquidityPoolId;
    switch (tlAssetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
        return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
        anum = tlAssetXdr.alphaNum4();
      /* falls through */
      case xdr.AssetType.assetTypeCreditAlphanum12():
        anum = anum || tlAssetXdr.alphaNum12();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode(), '\0');
        return new this(code, issuer);
      case xdr.AssetType.assetTypePoolShare():
        liquidityPoolId = tlAssetXdr.liquidityPoolId().toString('hex');
        return this.liquidityPoolShare(liquidityPoolId);
      default:
        throw new Error(`Invalid asset type: ${tlAssetXdr.switch().name}`);
    }
  }

  /**
   * Returns the XDR object for this trustline asset.
   * @returns {xdr.TrustLineAsset} XDR TrustLineAsset object
   */
  toXDRObject() {
    if (this.isNative()) {
      return xdr.TrustLineAsset.assetTypeNative();
    }

    if (this.isLiquidityPool()) {
      const xdrPoolId = xdr.PoolId.fromXDR(this.liquidityPoolId, 'hex');
      return new xdr.TrustLineAsset('assetTypePoolShare', xdrPoolId);
    }

    // pad code with null bytes if necessary
    const padLength = this.code.length <= 4 ? 4 : 12;
    const paddedCode = padEnd(this.code, padLength, '\0');

    if (this.code.length <= 4) {
      const xdrAsset = new xdr.AlphaNum4({
        assetCode: paddedCode,
        issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
      });
      return new xdr.TrustLineAsset('assetTypeCreditAlphanum4', xdrAsset);
    }

    const xdrAsset = new xdr.AlphaNum12({
      assetCode: paddedCode,
      issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
    });
    return new xdr.TrustLineAsset('assetTypeCreditAlphanum12', xdrAsset);
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
   * @returns {string} Liquidity pool ID.
   */
  getLiquidityPoolId() {
    return clone(this.liquidityPoolId);
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
   * @returns {boolean} `true` if this trustline asset object is the native asset.
   */
  isNative() {
    return this.code && this.code.toLowerCase() === 'xlm' && !this.issuer;
  }

  /**
   * @returns {boolean} `true` if this trustline asset object is a liquidity pool.
   */
  isLiquidityPool() {
    return !!this.liquidityPoolId;
  }

  /**
   * @param {TrustLineAsset} asset TrustLineAsset to compare.
   * @returns {boolean} `true` if this asset equals the given asset.
   */
  equals(asset) {
    return (
      this.code === asset.getCode() &&
      this.issuer === asset.getIssuer() &&
      this.liquidityPoolId === asset.getLiquidityPoolId()
    );
  }

  toString() {
    if (this.isNative()) {
      return 'native';
    }

    if (this.isLiquidityPool()) {
      return `liquidity_pool:${this.liquidityPoolId}`;
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }
}
