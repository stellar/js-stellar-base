"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var Keypair = _index.Keypair;

var encodeCheck = require("./strkey").encodeCheck;

var padRight = require("lodash").padRight;

/**
* Asset class represents an asset, either the native asset ("XLM")
* or a asset code / issuer address pair.
* @class Asset
*/

var Asset = exports.Asset = (function () {

    /**
    * An asset code describes an asset code and issuer pair. In the case of the native
    * asset XLM, the issuer will be null.
    * @constructor
    * @param {string} code - The asset code.
    * @param {string} issuer - The address of the issuer.
    */

    function Asset(code, issuer) {
        _classCallCheck(this, Asset);

        if (code.length > 12) {
            throw new Error("Asset code must be 12 characters at max.");
        }
        if (String(code).toLowerCase() !== "xlm" && !issuer) {
            throw new Error("Issuer cannot be null");
        }
        // pad code with null bytes if necessary
        this.code = padRight(code, 12, "\u0000");
        this.issuer = issuer;
    }

    _createClass(Asset, {
        toXdrObject: {

            /**
            * Returns the xdr object for this asset.
            */

            value: function toXdrObject() {
                if (this.isNative()) {
                    return xdr.Asset.assetTypeNative();
                } else {
                    var xdrType = undefined,
                        xdrTypeString = undefined;
                    if (this.code.length <= 4) {
                        xdrType = xdr.AssetAlphaNum4;
                        xdrTypeString = "assetTypeCreditAlphanum4";
                    } else {
                        xdrType = xdr.AssetAlphaNum12;
                        xdrTypeString = "assetTypeCreditAlphanum12";
                    }

                    var assetType = new xdrType({
                        assetCode: this.code,
                        issuer: Keypair.fromAddress(this.issuer).accountId()
                    });

                    return new xdr.Asset(xdrTypeString, assetType);
                }
            }
        },
        isNative: {

            /**
            * Returns true if this asset object is the native asset.
            */

            value: function isNative() {
                return !this.issuer;
            }
        },
        equals: {

            /**
            * Returns true if this asset equals the given asset.
            */

            value: function equals(asset) {
                return this.code == asset.code && this.issuer == asset.issuer;
            }
        }
    }, {
        native: {

            /**
            * Returns an asset object for the native asset.
            */

            value: function native() {
                return new Asset("XLM");
            }
        },
        fromOperation: {

            /**
            * Returns an asset object from its XDR object representation.
            * @param {xdr.Asset} cx - The asset xdr object.
            */

            value: function fromOperation(cx) {
                var anum = undefined,
                    issuer = undefined;
                switch (cx["switch"]()) {
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
                        throw new Error("Invalid asset type: " + cx["switch"]().name);
                }
            }
        }
    });

    return Asset;
})();