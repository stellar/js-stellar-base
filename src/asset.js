import {xdr, Keypair} from "./index";
import {encodeCheck} from "./strkey";
import {padRight} from 'lodash';

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
      let anum, issuer;
      switch(cx.switch()) {
        case xdr.AssetType.assetTypeNative():
          return this.native();
        case xdr.AssetType.assetTypeCreditAlphanum4():
          anum = cx.alphaNum4();
          issuer = encodeCheck("accountId", anum.issuer().ed25519());
          return new this(anum.assetCode(), issuer);
        case xdr.AssetType.assetTypeCreditAlphanum12():
          anum = cx.alphaNum12();
          issuer = encodeCheck("accountId", anum.issuer().ed25519());
          return new this(anum.assetCode(), issuer);
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
            throw new Error("Asset code must be 12 characters at max.");
        }
        if (String(code).toLowerCase() !== "xlm" && !issuer) {
            throw new Error("Issuer cannot be null");
        }
        // pad code with null bytes if necessary
        this.code = padRight(code, 12, '\0');
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

            var assetType = new xdrType({
                assetCode: this.code,
                issuer: Keypair.fromAddress(this.issuer).accountId()
            });

            return new xdr.Asset(xdrTypeString, assetType);
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
        return this.code == asset.code && this.issuer == asset.issuer;
    }
}
