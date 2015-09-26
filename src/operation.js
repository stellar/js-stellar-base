import {xdr, Keypair, Hyper, UnsignedHyper, hash} from "./index";
import {encodeCheck} from "./strkey";
import {Asset} from "./asset";
import {best_r} from "./util/continued_fraction";
import {padRight, trimRight, isUndefined, isString} from 'lodash';

/**
* @class Operation
* See https://stellar.org/developers/learn/concepts/operations.html  for more information about how operations work in Stellar.
*/
export class Operation {

    /**
    * Create and fund a non existent account.
    * @param {object} opts
    * @param {string} opts.destination - Destination address to create an account for.
    * @param {string} opts.startingBalance - Amount the account should be funded. Must be greater
    *                                   than the reserve balance amount.
    * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
    * @returns {xdr.CreateAccountOp}
    */
    static createAccount(opts) {
        if (!opts.destination) {
            throw new Error("Must provide a destination for a payment operation");
        }
        if (!opts.startingBalance) {
            throw new Error("Must provide a starting balance");
        }
        let attributes = {};
        attributes.destination  = Keypair.fromAddress(opts.destination).accountId();
        attributes.startingBalance = Hyper.fromString(String(opts.startingBalance));
        let createAccount = new xdr.CreateAccountOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.createAccount(createAccount);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Create a payment operation.
    * @param {object} opts
    * @param {string} opts.destination - The destination address.
    * @param {Asset} opts.asset - The asset to send.
    * @param {string} opts.amount - The amount to send.
    * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
    * @returns {xdr.PaymentOp}
    */
    static payment(opts) {
        if (!opts.destination) {
            throw new Error("Must provide a destination for a payment operation");
        }
        if (!opts.asset) {
            throw new Error("Must provide an asset for a payment operation");
        }
        if (!opts.amount) {
            throw new Error("Must provide an amount for a payment operation");
        }

        let attributes = {};
        attributes.destination  = Keypair.fromAddress(opts.destination).accountId();
        attributes.asset        = opts.asset.toXdrObject();
        attributes.amount       = Hyper.fromString(String(opts.amount));
        let payment = new xdr.PaymentOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.payment(payment);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns a XDR PaymentOp. A "payment" operation send the specified amount to the
    * destination account, optionally through a path. XLM payments create the destination
    * account if it does not exist.
    * @param {object} opts
    * @param {Asset} opts.sendAsset - The asset to pay with.
    * @param {string} opts.sendMax - The maximum amount of sendAsset to send.
    * @param {string} opts.destination - The destination account to send to.
    * @param {Asset} opts.destAsset - The asset the destination will receive.
    * @param {string|number} otps.destAmount - The amount the destination receives.
    * @param {array} [opts.path] - An array of Asset objects to use as the path.
    * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
    * @returns {xdr.PathPaymentOp}
    */
    static pathPayment(opts) {
        if (!opts.sendAsset) {
            throw new Error("Must specify a send asset");
        }
        if (!opts.sendMax) {
            throw new Error("Must specify a send max");
        }
        if (!opts.destination) {
            throw new Error("Must provide a destination for a payment operation");
        }
        if (!opts.destAsset) {
            throw new Error("Must provide a destAsset for a payment operation");
        }
        if (!opts.destAmount) {
            throw new Error("Must provide an destAmount for a payment operation");
        }

        let attributes = {};
        attributes.sendAsset    = opts.sendAsset.toXdrObject();
        attributes.sendMax      = Hyper.fromString(String(opts.sendMax));
        attributes.destination  = Keypair.fromAddress(opts.destination).accountId();
        attributes.destAsset    = opts.destAsset.toXdrObject();
        attributes.destAmount   = Hyper.fromString(String(opts.destAmount));
        attributes.path         = opts.path ? opts.path : [];
        let payment = new xdr.PathPaymentOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.pathPayment(payment);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
    * trust line for a given asset from the source account to another. The issuer being
    * trusted and the asset code are in the given Asset object.
    * @param {object} opts
    * @param {Asset} opts.asset - The asset for the trust line.
    * @param {string} [opts.limit] - The limit for the asset, defaults to max int64.
    *                                If the limit is set to "0" it deletes the trustline.
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.ChangeTrustOp}
    */
    static changeTrust(opts) {
        let attributes      = {};
        attributes.line     = opts.asset.toXdrObject();
        if (!isUndefined(opts.limit) && !isString(opts.limit)) {
            throw new TypeError('limit argument must be of type String');
        }
        let limit           = opts.limit ? opts.limit : "9223372036854775807";
        attributes.limit    = Hyper.fromString(limit);
        if (opts.source) {
            attributes.source   = opts.source ? opts.source.masterKeypair : null;
        }
        let changeTrustOP = new xdr.ChangeTrustOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.changeTrust(changeTrustOP);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
    * account to hold your account's credit for a given asset.
    * @param {object} opts
    * @param {string} opts.trustor - The trusting account (the one being authorized)
    * @param {string} opts.assetCode - The asset code being authorized.
    * @param {boolean} opts.authorize - True to authorize the line, false to deauthorize.
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.AllowTrustOp}
    */
    static allowTrust(opts) {
        let attributes = {};
        attributes.trustor = Keypair.fromAddress(opts.trustor).accountId();
        if (opts.assetCode.length <= 4) {
            let code = padRight(opts.assetCode, 4, '\0');
            attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
        } else if (opts.assetCode.length <= 12) {
            let code = padRight(opts.assetCode, 12, '\0');
            attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum12(code);
        } else {
            throw new Error("Asset code must be 12 characters at max.");
        }
        attributes.authorize = opts.authorize;
        let allowTrustOp = new xdr.AllowTrustOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.allowTrust(allowTrustOp);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns an XDR SetOptionsOp. A "set options" operations set or clear account flags,
    * set the account's inflation destination, and/or add new signers to the account.
    * The account flags are the xdr.AccountFlags enum, which are:
    *   - AUTH_REQUIRED_FLAG = 0x1
    *   - AUTH_REVOCABLE_FLAG = 0x2
    * @param {object} opts
    * @param {string} [opts.inflationDest] - Set this address as the account's inflation destination.
    * @param {number} [opts.clearFlags] - Bitmap integer for which flags to clear.
    * @param {number} [opts.setFlags] - Bitmap integer for which flags to set.
    * @param {array} [opts.thresholds] - Sets the weight of the master key and the threshold
    *                                    for each level low, medium, and high. Array of uint8.
    *                                    For now, see the stellar-core docs.
    * @param {number} [opts.thresholds.weight] - The master key weight.
    * @param {number} [opts.thresholds.low] - The sum weight for the low threshold.
    * @param {number} [opts.thresholds.medium] - The sum weight for the medium threshold.
    * @param {number} [opts.thresholds.high] - The sum weight for the high threshold.
    * @param {object} [opts.signer] - Add or remove a signer from the account. The signer is
    *                                 deleted if the weight is 0.
    * @param {string} [opts.signer.address] - The address of the new signer.
    * @param {number} [opts.signer.weight] - The weight of the new signer (0 to delete or 1-255)
    * @param {string} [opts.homeDomain] - sets the home domain used for reverse federation lookup.
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.SetOptionsOp}
    */
    static setOptions(opts) {
        let attributes = {};

        if (opts.inflationDest) {
            attributes.inflationDest = Keypair.fromAddress(opts.inflationDest).accountId();
        }

        attributes.clearFlags = opts.clearFlags;
        attributes.setFlags = opts.setFlags;
        attributes.masterWeight = opts.masterWeight;
        attributes.lowThreshold = opts.lowThreshold;
        attributes.medThreshold = opts.medThreshold;
        attributes.highThreshold = opts.highThreshold;
        attributes.homeDomain = opts.homeDomain;

        if (opts.signer) {
            let signer = new xdr.Signer({
                pubKey: Keypair.fromAddress(opts.signer.address).accountId(),
                weight: opts.signer.weight
            });
            attributes.signer = signer;
        }

        let setOptionsOp = new xdr.SetOptionsOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.setOption(setOptionsOp);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns a XDR ManageOfferOp. A "manage offer" operation creates, updates, or
    * deletes an offer.
    * @param {object} opts
    * @param {Asset} selling - What you're selling.
    * @param {Asset} buying - What you're buying.
    * @param {string} amount - The total amount you're selling. If 0, deletes the offer.
    * @param {number} price - The exchange rate ratio (takerpay / takerget)
    * @param {string} offerId - If 0, will create a new offer. Otherwise, edits an exisiting offer.
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.ManageOfferOp}
    */
    static manageOffer(opts) {
        let attributes = {};
        attributes.selling = opts.selling.toXdrObject();
        attributes.buying = opts.buying.toXdrObject();
        attributes.amount = Hyper.fromString(String(opts.amount));
        let approx = best_r(opts.price);
        attributes.price = new xdr.Price({
            n: approx[0],
            d: approx[1]
        });
        attributes.offerId = UnsignedHyper.fromString(String(opts.offerId));
        let manageOfferOp = new xdr.ManageOfferOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.manageOffer(manageOfferOp);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Returns a XDR CreatePasiveOfferOp. A "create passive offer" operation creates an
    * offer that won't consume a counter offer that exactly matches this offer. This is
    * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
    * to manage this offer after using this operation to create it.
    * @param {object} opts
    * @param {Asset} selling - What you're selling.
    * @param {Asset} buying - What you're buying.
    * @param {string} amount - The total amount you're selling. If 0, deletes the offer.
    * @param {number} price - The exchange rate ratio (selling / buying)
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.CreatePassiveOfferOp}
    */
    static createPassiveOffer(opts) {
        let attributes = {};
        attributes.selling = opts.selling.toXdrObject();
        attributes.buying = opts.buying.toXdrObject();
        attributes.amount = Hyper.fromString(String(opts.amount));
        let approx = best_r(opts.price);
        attributes.price = new xdr.Price({
            n: approx[0],
            d: approx[1]
        });
        let createPassiveOfferOp = new xdr.CreatePassiveOfferOp(attributes);

        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.createPassiveOffer(createPassiveOfferOp);
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * Transfers native balance to destination account.
    * @param {object} opts
    * @param {string} opts.destination - Destination to merge the source account into.
    * @param {string} [opts.source] - The source account (defaults to transaction source).
    * @returns {xdr.AccountMergeOp}
    */
    static accountMerge(opts) {
        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.accountMerge(
            Keypair.fromAddress(opts.destination).accountId()
        );
        this.setSourceAccount(opAttributes, opts);

        let op = new xdr.Operation(opAttributes);
        return op;
    }

    /**
    * This operation generates the inflation.
    * @param {object} [opts]
    * @param {string} [opts.source] - The optional source account.
    * @returns {xdr.AccountMergeOp}
    */
    static inflation(opts={}) {
        let opAttributes = {};
        opAttributes.body = xdr.OperationBody.inflation();
        this.setSourceAccount(opAttributes, opts);
        let op = new xdr.Operation(opAttributes);
        return op;
    }

    static setSourceAccount(opAttributes, opts) {
      if (opts.source) {
          opAttributes.sourceAccount = Keypair.fromAddress(opts.source).accountId();
      }
    }

    /**
    * Converts the XDR Operation object to the opts object used to create the XDR
    * operation.
    * @param {xdr.Operation} operation - An XDR Operation.
    * @return {object}
    */
    static operationToObject(operation) {
        function accountIdtoAddress(accountId) {
          return encodeCheck("accountId", accountId.ed25519());
        }

        let result = {};
        if (operation.sourceAccount()) {
            result.source = accountIdtoAddress(operation.sourceAccount());
        }

        let attrs = operation.body().value();
        switch (operation.body().switch().name) {
            case "createAccount":
                result.type = "createAccount";
                result.destination = accountIdtoAddress(attrs.destination());
                result.startingBalance = attrs.startingBalance().toString();
                break;
            case "payment":
                result.type = "payment";
                result.destination = accountIdtoAddress(attrs.destination());
                result.asset = Asset.fromOperation(attrs.asset());
                result.amount = attrs.amount().toString();
                break;
            case "pathPayment":
                result.type = "pathPayment";
                result.sendAsset = Asset.fromOperation(attrs.sendAsset());
                result.sendMax = attrs.sendMax().toString();
                result.destination = accountIdtoAddress(attrs.destination());
                result.destAsset = Asset.fromOperation(attrs.destAsset());
                result.destAmount = attrs.destAmount().toString();
                result.path = attrs.path();
                break;
            case "changeTrust":
                result.type = "changeTrust";
                result.line = Asset.fromOperation(attrs.line());
                result.limit = attrs.limit().toString();
                break;
            case "allowTrust":
                result.type = "allowTrust";
                result.trustor = accountIdtoAddress(attrs.trustor());
                result.assetCode = attrs.asset().value().toString();
                result.assetCode = trimRight(result.assetCode, "\0");
                result.authorize = attrs.authorize();
                break;
            case "setOption":
                result.type = "setOptions";
                if (attrs.inflationDest()) {
                    result.inflationDest = accountIdtoAddress(attrs.inflationDest());
                }

                result.clearFlags = attrs.clearFlags();
                result.setFlags = attrs.setFlags();
                result.masterWeight = attrs.masterWeight();
                result.lowThreshold = attrs.lowThreshold();
                result.medThreshold = attrs.medThreshold();
                result.highThreshold = attrs.highThreshold();
                result.homeDomain = attrs.homeDomain();

                if (attrs.signer()) {
                    let signer = {};
                    signer.address = accountIdtoAddress(attrs.signer().pubKey());
                    signer.weight = attrs.signer().weight();
                    result.signer = signer;
                }
                break;
            case "manageOffer":
                result.type = "manageOffer";
                result.selling = Asset.fromOperation(attrs.selling());
                result.buying = Asset.fromOperation(attrs.buying());
                result.amount = attrs.amount().toString();
                result.price = attrs.price().n() / attrs.price().d();
                result.offerId = attrs.offerId().toString();
                break;
            case "createPassiveOffer":
                result.type = "createPassiveOffer";
                result.selling = Asset.fromOperation(attrs.selling());
                result.buying = Asset.fromOperation(attrs.buying());
                result.amount = attrs.amount().toString();
                result.price = attrs.price().n() / attrs.price().d();

                break;
            case "accountMerge":
                result.type = "accountMerge";
                result.destination = accountIdtoAddress(attrs);
                break;
            case "inflation":
                result.type = "inflation";
                break;
            default:
                throw new Error("Unknown operation");
        }
        return result;
    }
}
