import {xdr, Keypair} from "./index";
import {encodeCheck} from "./strkey";

/**
* Currency class represents a currency, either the native currency ("XLM")
* or a currency code / issuer address pair.
* @class Currency
*/
export class Currency {

    /**
    * Returns a currency object for the native currency.
    */
    static native() {
        return new Currency("XLM");
    }

    /**
    * Returns a currency object from its XDR object representation.
    * @param {xdr.Currency} cx - The currency xdr object.
    */
    static fromOperation(cx) {
      switch(cx.switch()) {
        case xdr.CurrencyType.currencyTypeNative():
          return this.native();
        case xdr.CurrencyType.currencyTypeAlphanum():
          let anum = cx.alphaNum();
          let issuer = encodeCheck("accountId", anum.issuer().ed25519());
          return new this(anum.currencyCode(), issuer);
        default:
          throw new Error(`Invalid currency type: ${cx.switch().name}`);
      }
    }

    /**
    * A currency code describes a currency and issuer pair. In the case of the native
    * currency XLM, the issuer will be null.
    * @constructor
    * @param {string} code - The currency code.
    * @param {string} issuer - The address of the issuer.
    */
    constructor(code, issuer) {
        if (code.length != 3 && code.length != 4) {
            throw new Error("Currency code must be 3 or 4 characters");
        }
        if (String(code).toLowerCase() !== "xlm" && !issuer) {
            throw new Error("Issuer cannot be null");
        }
        // pad code with null byte if necessary
        this.code = code.length == 3 ? code + "\0" : code;
        this.issuer = issuer;
    }

    /**
    * Returns the xdr object for this currency.
    */
    toXdrObject() {
        if (this.isNative()) {
            return xdr.Currency.currencyTypeNative();
        } else {
            var currencyType = new xdr.CurrencyAlphaNum({
                currencyCode: this.code,
                issuer: Keypair.fromAddress(this.issuer).accountId()
            });

            // return  xdr.Currency.currencyTypeAlphanum(currencyType);
            var currency = new xdr.Currency("currencyTypeAlphanum", currencyType);

            return currency;
        }
    }

    /**
    * Returns true if this currency object is the native currency.
    */
    isNative() {
        return !this.issuer;
    }

    /**
    * Returns true if this currency equals the given currency.
    */
    equals(currency) {
        return this.code == currency.code && this.issuer == currency.issuer;
    }
}
