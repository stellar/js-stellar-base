import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';
import xdr from './generated/stellar-xdr_generated';
import { Keypair } from './keypair';
import { StrKey } from './strkey';

/**
 * Asset class represents an asset, either the native asset (`XLM`)
 * or an asset code / issuer account ID pair.
 *
 * An asset code describes an asset code and issuer pair. In the case of the native
 * asset XLM, the issuer will be null.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the issuer.
 */
export class Asset {
  constructor(code, issuer) {
    if (!/^[a-zA-Z0-9]{1,12}$/.test(code)) {
      throw new Error(
        'Asset code is invalid (maximum alphanumeric, 12 characters at max)'
      );
    }
    if (String(code).toLowerCase() !== 'xlm' && !issuer) {
      throw new Error('Issuer cannot be null');
    }
    if (issuer && !StrKey.isValidEd25519PublicKey(issuer)) {
      throw new Error('Issuer is invalid');
    }

    this.code = code;
    this.issuer = issuer;
  }

  /**
   * Returns an asset object for the native asset.
   * @Return {Asset}
   */
  static native() {
    return new Asset('XLM');
  }

  /**
   * Returns an asset object from its XDR object representation.
   * @param {xdr.Asset} assetXdr - The asset xdr object.
   * @returns {Asset}
   */
  static fromOperation(assetXdr) {
    let anum;
    let code;
    let issuer;
    switch (assetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
        return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
        anum = assetXdr.alphaNum4();
      /* falls through */
      case xdr.AssetType.assetTypeCreditAlphanum12():
        anum = anum || assetXdr.alphaNum12();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode(), '\0');
        return new this(code, issuer);
      default:
        throw new Error(`Invalid asset type: ${assetXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr.Asset object for this asset.
   * @returns {xdr.Asset} XDR asset object
   */
  toXDRObject() {
    return this._toXDRObject(xdr.Asset);
  }

  /**
   * Returns the xdr.ChangeTrustAsset object for this asset.
   * @returns {xdr.ChangeTrustAsset} XDR asset object
   */
  toChangeTrustXDRObject() {
    return this._toXDRObject(xdr.ChangeTrustAsset);
  }

  /**
   * Returns the xdr.TrustLineAsset object for this asset.
   * @returns {xdr.TrustLineAsset} XDR asset object
   */
  toTrustLineXDRObject() {
    return this._toXDRObject(xdr.TrustLineAsset);
  }

  /**
   * Returns the xdr object for this asset.
   * @param {xdr.Asset | xdr.ChangeTrustAsset} xdrAsset - The asset xdr object.
   * @returns {xdr.Asset | xdr.ChangeTrustAsset | xdr.TrustLineAsset} XDR Asset object
   */
  _toXDRObject(xdrAsset = xdr.Asset) {
    if (this.isNative()) {
      return xdrAsset.assetTypeNative();
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

    return new xdrAsset(xdrTypeString, assetType);
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
   * @see [Assets concept](https://www.stellar.org/developers/guides/concepts/assets.html)
   * @returns {string} Asset type. Can be one of following types:
   *
   * * `native`
   * * `credit_alphanum4`
   * * `credit_alphanum12`
   */
  getAssetType() {
    if (this.isNative()) {
      return 'native';
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
   * @returns {boolean}  true if this asset object is the native asset.
   */
  isNative() {
    return !this.issuer;
  }

  /**
   * @param {Asset} asset Asset to compare
   * @returns {boolean} true if this asset equals the given asset.
   */
  equals(asset) {
    return this.code === asset.getCode() && this.issuer === asset.getIssuer();
  }

  toString() {
    if (this.isNative()) {
      return 'native';
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }

  /**
   * Compares if assetA < assetB according with the criteria:
   * 1. First compare the type (eg. native before alphanum4 before alphanum12).
   * 2. If the types are equal, compare the assets codes.
   * 3. If the asset codes are equal, compare the issuers.
   *
   * @static
   * @param {Asset} assetA - The first asset in the lexicographic order.
   * @param {Asset} assetB - The second asset in the lexicographic order.
   * @return {-1 | 0 | 1} `-1` if assetA < assetB, `0` if assetA == assetB, `1` if assetA > assetB.
   * @memberof Asset
   */
  static compare(assetA, assetB) {
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error('assetA is invalid');
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error('assetB is invalid');
    }

    if (assetA.equals(assetB)) {
      return 0;
    }

    // Compare asset types.
    switch (assetA.getAssetType()) {
      case 'native':
        return -1;
      case 'credit_alphanum4':
        if (assetB.getAssetType() === 'native') {
          return 1;
        }
        if (assetB.getAssetType() === 'credit_alphanum12') {
          return -1;
        }
        break;
      case 'credit_alphanum12':
        if (assetB.getAssetType() !== 'credit_alphanum12') {
          return 1;
        }
        break;
      default:
        throw new Error('Unexpected asset type');
    }

    // Compare asset codes.
    const result = assetA.getCode().localeCompare(assetB.getCode());
    if (result !== 0) {
      return result;
    }

    // Compare asset issuers.
    return assetA.getIssuer().localeCompare(assetB.getIssuer());
  }
}
