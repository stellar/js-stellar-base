import {default as xdr} from "./generated/stellar-xdr_generated";
import {Account} from "./account";
import {Keypair} from "./keypair";
import {encodeCheck} from "./strkey";
import {clone, padRight, trimRight} from 'lodash';

/**
* Asset class represents an asset, either the native asset ("XLM")
* or a asset code / issuer address pair.
* @class Asset
*/
export class Asset {

    /**
    * Returns an asset object for the native asset.
    */
    static native() {
        return new Asset("XLM");
    }

    /**
    * Returns an asset object from its XDR object representation.
    * @param {xdr.Asset} cx - The asset xdr object.
    */
    static fromOperation(cx) {
      let anum, code, issuer;
      switch(cx.switch()) {
        case xdr.AssetType.assetTypeNative():
          return this.native();
        case xdr.AssetType.assetTypeCreditAlphanum4():
          anum = cx.alphaNum4();
          issuer = encodeCheck("accountId", anum.issuer().ed25519());
          code = trimRight(anum.assetCode(), '\0');
          return new this(code, issuer);
        case xdr.AssetType.assetTypeCreditAlphanum12():
          anum = cx.alphaNum12();
          issuer = encodeCheck("accountId", anum.issuer().ed25519());
          code = trimRight(anum.assetCode(), '\0');
          return new this(code, issuer);
        default:
          throw new Error(`Invalid asset type: ${cx.switch().name}`);
      }
    }

    /**
    * An asset code describes an asset code and issuer pair. In the case of the native
    * asset XLM, the issuer will be null.
    * @constructor
    * @param {string} code - The asset code.
    * @param {string} issuer - The address of the issuer.
    */
    constructor(code, issuer) {
        if (code.length > 12) {
            throw new Error("Asset code must be 12 characters at max");
        }
        if (String(code).toLowerCase() !== "xlm" && !issuer) {
            throw new Error("Issuer cannot be null");
        }
        if (issuer && !Account.isValidAddress(issuer)) {
            throw new Error("Issuer is invalid");
        }

        this.code = code;
        this.issuer = issuer;
    }

    /**
    * Returns the xdr object for this asset.
    */
    toXdrObject() {
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
            let paddedCode = padRight(this.code, padLength, '\0');

            var assetType = new xdrType({
                assetCode: paddedCode,
                issuer: Keypair.fromAddress(this.issuer).accountId()
            });

            return new xdr.Asset(xdrTypeString, assetType);
        }
    }

    /**
     * Return the asset code
     */
    getCode() {
      return clone(this.code);
    }

    /**
     * Return the asset issuer
     **/
    getIssuer() {
      return clone(this.issuer);
    }

    /**
     * Return the asset type
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
    */
    isNative() {
        return !this.issuer;
    }

    /**
    * Returns true if this asset equals the given asset.
    */
    equals(asset) {
        return this.code == asset.getCode() && this.issuer == asset.getIssuer();
    }
}
