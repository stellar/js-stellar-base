"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var Keypair = _index.Keypair;

var encodeBase58Check = require("./base58").encodeBase58Check;

/**
* Currency class represents a currency, either the native currency ("XLM")
* or a currency code / issuer address pair.
* @class Currency
*/

var Currency = exports.Currency = (function () {

    /**
    * A currency code describes a currency and issuer pair. In the case of the native
    * currency XLM, the issuer will be null.
    * @constructor
    * @param {string} code - The currency code.
    * @param {string} issuer - The address of the issuer.
    */

    function Currency(code, issuer) {
        _classCallCheck(this, Currency);

        if (code.length != 3 && code.length != 4) {
            throw new Error("Currency code must be 3 or 4 characters");
        }
        if (String(code).toLowerCase() !== "xlm" && !issuer) {
            throw new Error("Issuer cannot be null");
        }
        // pad code with null byte if necessary
        this.code = code.length == 3 ? code + "\u0000" : code;
        this.issuer = issuer;
    }

    _createClass(Currency, {
        toXdrObject: {

            /**
            * Returns the xdr object for this currency.
            */

            value: function toXdrObject() {
                if (this.isNative()) {
                    return xdr.Currency.currencyTypeNative();
                } else {
                    // need to pad the currency code with the null byte
                    var currencyType = new xdr.CurrencyAlphaNum({
                        currencyCode: this.code,
                        issuer: Keypair.fromAddress(this.issuer).publicKey()
                    });
                    var currency = xdr.Currency.currencyTypeAlphanum();
                    currency.set("currencyTypeAlphanum", currencyType);

                    return currency;
                }
            }
        },
        isNative: {

            /**
            * Returns true if this currency object is the native currency.
            */

            value: function isNative() {
                return !this.issuer;
            }
        },
        equals: {

            /**
            * Returns true if this currency equals the given currency.
            */

            value: function equals(currency) {
                return this.code == currency.code && this.issuer == currency.issuer;
            }
        }
    }, {
        native: {

            /**
            * Returns a currency object for the native currency.
            */

            value: function native() {
                return new Currency("XLM");
            }
        },
        fromOperation: {

            /**
            * Returns a currency object from its XDR object representation.
            * @param {xdr.Currency.iso4217} xdr - The currency xdr object.
            */

            value: function fromOperation(xdr) {
                if (xdr._switch.name == "currencyTypeNative") {
                    return this.native();
                } else {
                    var code = xdr._value._attributes.currencyCode;
                    var issuer = encodeBase58Check("accountId", xdr._value._attributes.issuer);
                    return new this(code, issuer);
                }
            }
        }
    });

    return Currency;
})();