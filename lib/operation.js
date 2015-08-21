"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var Keypair = _index.Keypair;
var Hyper = _index.Hyper;
var UnsignedHyper = _index.UnsignedHyper;
var hash = _index.hash;

var encodeCheck = require("./strkey").encodeCheck;

var Asset = require("./asset").Asset;

var best_r = require("./util/continued_fraction").best_r;

var _lodash = require("lodash");

var padRight = _lodash.padRight;
var trimRight = _lodash.trimRight;

/**
* @class Operation
*/

var Operation = exports.Operation = (function () {
    function Operation() {
        _classCallCheck(this, Operation);
    }

    _createClass(Operation, null, {
        createAccount: {

            /**
            * Create and fund a non existent account.
            * @param {object} opts
            * @param {string} opts.destination - Destination address to create an account for.
            * @param {string} opts.startingBalance - Amount the account should be funded. Must be greater
            *                                   than the reserve balance amount.
            * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
            * @returns {xdr.CreateAccountOp}
            */

            value: function createAccount(opts) {
                if (!opts.destination) {
                    throw new Error("Must provide a destination for a payment operation");
                }
                if (!opts.startingBalance) {
                    throw new Error("Must provide a starting balance");
                }
                var attributes = {};
                attributes.destination = Keypair.fromAddress(opts.destination).accountId();
                attributes.startingBalance = Hyper.fromString(String(opts.startingBalance));
                var createAccount = new xdr.CreateAccountOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createAccount(createAccount);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        payment: {

            /**
            * Create a payment operation.
            * @param {object} opts
            * @param {string} opts.destination - The destination address.
            * @param {Asset} opts.asset - The asset to send.
            * @param {string} opts.amount - The amount to send.
            * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
            * @returns {xdr.PaymentOp}
            */

            value: function payment(opts) {
                if (!opts.destination) {
                    throw new Error("Must provide a destination for a payment operation");
                }
                if (!opts.asset) {
                    throw new Error("Must provide an asset for a payment operation");
                }
                if (!opts.amount) {
                    throw new Error("Must provide an amount for a payment operation");
                }

                var attributes = {};
                attributes.destination = Keypair.fromAddress(opts.destination).accountId();
                attributes.asset = opts.asset.toXdrObject();
                attributes.amount = Hyper.fromString(String(opts.amount));
                var payment = new xdr.PaymentOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.payment(payment);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        pathPayment: {

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

            value: function pathPayment(opts) {
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

                var attributes = {};
                attributes.sendAsset = opts.sendAsset.toXdrObject();
                attributes.sendMax = Hyper.fromString(String(opts.sendMax));
                attributes.destination = Keypair.fromAddress(opts.destination).accountId();
                attributes.destAsset = opts.destAsset.toXdrObject();
                attributes.destAmount = Hyper.fromString(String(opts.destAmount));
                attributes.path = opts.path ? opts.path : [];
                var payment = new xdr.PathPaymentOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.pathPayment(payment);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        changeTrust: {

            /**
            * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
            * trust line for a given asset from the source account to another. The issuer being
            * trusted and the asset code are in the given Asset object.
            * @param {object} opts
            * @param {Asset} opts.asset - The asset for the trust line.
            * @param {string} [opts.limit] - The limit for the asset, defaults to max int64.
            *                                If the limit is set to 0 it deletes the trustline.
            * @param {string} [opts.source] - The source account (defaults to transaction source).
            * @returns {xdr.ChangeTrustOp}
            */

            value: function changeTrust(opts) {
                var attributes = {};
                attributes.line = opts.asset.toXdrObject();
                var limit = opts.limit ? opts.limit : "9223372036854775807";
                attributes.limit = Hyper.fromString(limit);
                if (opts.source) {
                    attributes.source = opts.source ? opts.source.masterKeypair : null;
                }
                var changeTrustOP = new xdr.ChangeTrustOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.changeTrust(changeTrustOP);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        allowTrust: {

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

            value: function allowTrust(opts) {
                var attributes = {};
                attributes.trustor = Keypair.fromAddress(opts.trustor).accountId();
                if (opts.assetCode.length <= 4) {
                    var code = padRight(opts.assetCode, 4, "\u0000");
                    attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
                } else if (opts.assetCode.length <= 12) {
                    var code = padRight(opts.assetCode, 12, "\u0000");
                    attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum12(code);
                } else {
                    throw new Error("Asset code must be 12 characters at max.");
                }
                attributes.authorize = opts.authorize;
                var allowTrustOp = new xdr.AllowTrustOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.allowTrust(allowTrustOp);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        setOptions: {

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

            value: function setOptions(opts) {
                var attributes = {};

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
                    var signer = new xdr.Signer({
                        pubKey: Keypair.fromAddress(opts.signer.address).accountId(),
                        weight: opts.signer.weight
                    });
                    attributes.signer = signer;
                }

                var setOptionsOp = new xdr.SetOptionsOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.setOption(setOptionsOp);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        manageOffer: {

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

            value: function manageOffer(opts) {
                var attributes = {};
                attributes.selling = opts.selling.toXdrObject();
                attributes.buying = opts.buying.toXdrObject();
                attributes.amount = Hyper.fromString(String(opts.amount));
                var approx = best_r(opts.price);
                attributes.price = new xdr.Price({
                    n: approx[0],
                    d: approx[1]
                });
                attributes.offerId = UnsignedHyper.fromString(String(opts.offerId));
                var manageOfferOp = new xdr.ManageOfferOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.manageOffer(manageOfferOp);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        createPassiveOffer: {

            /**
            * Returns a XDR CreatePasiveOfferOp. A "create passive offer" operation creates an
            * offer that won't consume a counter offer that exactly matches this offer. This is
            * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
            * to manage this offer after using this operation to create it.
            * @param {object} opts
            * @param {Asset} selling - What you're selling.
            * @param {Asset} buying - What you're buying.
            * @param {string} amount - The total amount you're selling. If 0, deletes the offer.
            * @param {number} price - The exchange rate ratio (takerpay / takerget)
            * @param {string} [opts.source] - The source account (defaults to transaction source).
            * @returns {xdr.CreatePassiveOfferOp}
            */

            value: function createPassiveOffer(opts) {
                var attributes = {};
                attributes.selling = opts.selling.toXdrObject();
                attributes.buying = opts.buying.toXdrObject();
                attributes.amount = Hyper.fromString(String(opts.amount));
                var approx = best_r(opts.price);
                attributes.price = new xdr.Price({
                    n: approx[0],
                    d: approx[1]
                });
                var createPassiveOfferOp = new xdr.CreatePassiveOfferOp(attributes);

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.createPassiveOffer(createPassiveOfferOp);
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        accountMerge: {

            /**
            * Transfers native balance to destination account.
            * @param {object} opts
            * @param {string} opts.destination - Destination to merge the source account into.
            * @param {string} [opts.source] - The source account (defaults to transaction source).
            * @returns {xdr.AccountMergeOp}
            */

            value: function accountMerge(opts) {
                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.accountMerge(Keypair.fromAddress(opts.destination).accountId());
                this.setSourceAccount(opAttributes, opts);

                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        inflation: {

            /**
            * This operation generates the inflation.
            * @param {object} [opts]
            * @param {string} [opts.source] - The optional source account.
            * @returns {xdr.AccountMergeOp}
            */

            value: function inflation() {
                var opts = arguments[0] === undefined ? {} : arguments[0];

                var opAttributes = {};
                opAttributes.body = xdr.OperationBody.inflation();
                this.setSourceAccount(opAttributes, opts);
                var op = new xdr.Operation(opAttributes);
                return op;
            }
        },
        setSourceAccount: {
            value: function setSourceAccount(opAttributes, opts) {
                if (opts.source) {
                    opAttributes.sourceAccount = Keypair.fromAddress(opts.source).accountId();
                }
            }
        },
        operationToObject: {

            /**
            * Converts the XDR Operation object to the opts object used to create the XDR
            * operation.
            * @param {xdr.Operation} operation - An XDR Operation.
            * @return {object}
            */

            value: function operationToObject(operation) {
                function accountIdtoAddress(accountId) {
                    return encodeCheck("accountId", accountId.ed25519());
                }

                var obj = {};
                var attrs = operation.body._value && operation.body._value._attributes;
                switch (operation.body["switch"]().name) {
                    case "createAccount":
                        obj.type = "createAccount";
                        obj.destination = accountIdtoAddress(attrs.destination);
                        obj.startingBalance = attrs.startingBalance.toString();
                        break;
                    case "payment":
                        obj.type = "payment";
                        obj.destination = accountIdtoAddress(attrs.destination);
                        obj.asset = Asset.fromOperation(attrs.asset);
                        obj.amount = attrs.amount.toString();
                        break;
                    case "pathPayment":
                        obj.type = "pathPayment";
                        obj.sendAsset = Asset.fromOperation(attrs.sendAsset);
                        obj.sendMax = attrs.sendMax.toString();
                        obj.destination = accountIdtoAddress(attrs.destination);
                        obj.destAsset = Asset.fromOperation(attrs.destAsset);
                        obj.destAmount = attrs.destAmount.toString();
                        obj.path = attrs.path;
                        break;
                    case "changeTrust":
                        obj.type = "changeTrust";
                        obj.line = Asset.fromOperation(attrs.line);
                        break;
                    case "allowTrust":
                        obj.type = "allowTrust";
                        obj.trustor = accountIdtoAddress(attrs.trustor);
                        obj.assetCode = attrs.asset._value.toString();
                        obj.assetCode = trimRight(obj.assetCode, "\u0000");
                        obj.authorize = attrs.authorize;
                        break;
                    case "setOption":
                        obj.type = "setOptions";
                        if (attrs.inflationDest) {
                            obj.inflationDest = accountIdtoAddress(attrs.inflationDest);
                        }

                        obj.clearFlags = attrs.clearFlags;
                        obj.setFlags = attrs.setFlags;
                        obj.masterWeight = attrs.masterWeight;
                        obj.lowThreshold = attrs.lowThreshold;
                        obj.medThreshold = attrs.medThreshold;
                        obj.highThreshold = attrs.highThreshold;
                        obj.homeDomain = attrs.homeDomain;

                        if (attrs.signer) {
                            var signer = {};
                            signer.address = accountIdtoAddress(attrs.signer._attributes.pubKey);
                            signer.weight = attrs.signer._attributes.weight;
                            obj.signer = signer;
                        }
                        break;
                    case "manageOffer":
                        obj.type = "manageOffer";
                        obj.selling = Asset.fromOperation(attrs.selling);
                        obj.buying = Asset.fromOperation(attrs.buying);
                        obj.amount = attrs.amount.toString();
                        obj.price = attrs.price._attributes.n / attrs.price._attributes.d;
                        obj.offerId = attrs.offerId.toString();
                        break;
                    case "createPassiveOffer":
                        obj.type = "createPassiveOffer";
                        obj.selling = Asset.fromOperation(attrs.selling);
                        obj.buying = Asset.fromOperation(attrs.buying);
                        obj.amount = attrs.amount.toString();
                        obj.price = attrs.price._attributes.n / attrs.price._attributes.d;
                        break;
                    case "accountMerge":
                        obj.type = "accountMerge";
                        obj.destination = accountIdtoAddress(operation.body._value);
                        break;
                    case "inflation":
                        obj.type = "inflation";
                        break;
                    default:
                        throw new Error("Unknown operation");
                }
                return obj;
            }
        }
    });

    return Operation;
})();