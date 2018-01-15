import {default as xdr} from "./generated/stellar-xdr_generated";
import {Keypair} from "./keypair";
import {StrKey} from "./strkey";
import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';

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
      throw new Error("Asset code is invalid (maximum alphanumeric, 12 characters at max)");
    }
    if (String(code).toLowerCase() !== "xlm" && !issuer) {
      throw new Error("Issuer cannot be null");
    }
    if (issuer && !StrKey.isValidEd25519PublicKey(issuer)) {
      throw new Error("Issuer is invalid");
    }

    this.code = code;
    this.issuer = issuer;
  }

  /**
   * Returns an asset object for the native asset.
   * @Return {Asset}
   */
  static native() {
    return new Asset("XLM");
  }

  /**
   * Returns an asset object from its XDR object representation.
   * @param {xdr.Asset} assetXdr - The asset xdr object.
   * @returns {Asset}
   */
  static fromOperation(assetXdr) {
    let anum, code, issuer;
    switch(assetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
      return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
      anum = assetXdr.alphaNum4();
      issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
      code = trimEnd(anum.assetCode(), '\0');
      return new this(code, issuer);
      case xdr.AssetType.assetTypeCreditAlphanum12():
      anum = assetXdr.alphaNum12();
      issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
      code = trimEnd(anum.assetCode(), '\0');
      return new this(code, issuer);
      default:
      throw new Error(`Invalid asset type: ${assetXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr object for this asset.
   * @returns {xdr.Asset}
   */
  toXDRObject() {
    if (this.isNative()) {
      return xdr.Asset.assetTypeNative();
    } else {
      let xdrType, xdrTypeString;
      if (this.code.length <= 4) {
        xdrType = xdr.AssetAlphaNum4;
        xdrTypeString = 'assetTypeCreditAlphanum4';
      } else {
        xdrType = xdr.AssetAlphaNum12;
        xdrTypeString = 'assetTypeCreditAlphanum12';
      }

          // pad code with null bytes if necessary
          let padLength = this.code.length <= 4 ? 4 : 12;
          let paddedCode = padEnd(this.code, padLength, '\0');

          var assetType = new xdrType({
            assetCode: paddedCode,
            issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
          });

          return new xdr.Asset(xdrTypeString, assetType);
        }
      }

  /**
   * Return the asset code
   * @returns {string}
   */
  getCode() {
    return clone(this.code);
  }

  /**
   * Return the asset issuer
   * @returns {string}
   */
  getIssuer() {
    return clone(this.issuer);
  }

  /**
   * Return the asset type. Can be one of following types:
   *
   * * `native`
   * * `credit_alphanum4`
   * * `credit_alphanum12`
   *
   * @see [Assets concept](https://www.stellar.org/developers/learn/concepts/assets.html)
   * @returns {string}
   */
  getAssetType() {
    if (this.isNative()) {
      return 'native';
    } else {
      if (this.code.length >= 1 && this.code.length <= 4) {
        return "credit_alphanum4";
      } else if (this.code.length >= 5 && this.code.length <= 12) {
        return "credit_alphanum12";
      }
    }
  }


  /**
   * Returns true if this asset object is the native asset.
   * @returns {boolean}
   */
  isNative() {
    return !this.issuer;
  }

  /**
   * Returns true if this asset equals the given asset.
   * @param {Asset} asset Asset to compare
   * @returns {boolean}
   */
  equals(asset) {
    return this.code == asset.getCode() && this.issuer == asset.getIssuer();
  }
}
