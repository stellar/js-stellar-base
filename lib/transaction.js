"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var hash = _index.hash;

var encodeCheck = require("./strkey").encodeCheck;

var Operation = require("./operation").Operation;

var _lodash = require("lodash");

var map = _lodash.map;
var each = _lodash.each;

var MAX_FEE = 1000;
var MIN_LEDGER = 0;
var MAX_LEDGER = 4294967295; // max uint32

var Transaction = exports.Transaction = (function () {

    /**
    * A new Transaction object is created from a transaction envelope (or via TransactionBuilder).
    * One a Transaction has been created from an envelope, its attributes and operations
    * should not be changed. You should only add signers to a Transaction object before
    * submitting to the network or forwarding on to additional signers.
    * @constructor
    * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or
    *                                                    base64 encoded string.
    */

    function Transaction(envelope) {
        _classCallCheck(this, Transaction);

        if (typeof envelope === "string") {
            var buffer = new Buffer(envelope, "base64");
            envelope = xdr.TransactionEnvelope.fromXDR(buffer);
        }
        // since this transaction is immutable, save the tx
        this.tx = envelope.tx();
        this.source = encodeCheck("accountId", envelope.tx().sourceAccount().ed25519());
        this.fee = this.tx.fee();
        this.sequence = this.tx.seqNum().toString();

        var operations = this.tx.operations() || [];
        this.operations = map(operations, function (op) {
            return Operation.operationToObject(op._attributes);
        });

        var signatures = envelope.signatures() || [];
        this.signatures = map(signatures, function (s) {
            return s;
        });
    }

    _createClass(Transaction, {
        sign: {

            /**
            * Signs the transaction with the given Keypair.
            * @param {Keypair[]} keypairs
            */

            value: function sign() {
                var _this = this;

                for (var _len = arguments.length, keypairs = Array(_len), _key = 0; _key < _len; _key++) {
                    keypairs[_key] = arguments[_key];
                }

                var txHash = this.hash();
                var newSigs = each(keypairs, function (kp) {
                    var sig = kp.signDecorated(txHash);
                    _this.signatures.push(sig);
                });
            }
        },
        hash: {

            /**
            * Returns a hash for this transaction, suitable for signing.
            */

            value: (function (_hash) {
                var _hashWrapper = function hash() {
                    return _hash.apply(this, arguments);
                };

                _hashWrapper.toString = function () {
                    return _hash.toString();
                };

                return _hashWrapper;
            })(function () {
                return hash(this.signatureBase());
            })
        },
        signatureBase: {

            /**
            * Returns the "signature base" of this transaction, which is the value
            * that, when hashed, should be signed to create a signature that
            * validators on the Stellar Network will accept.
            *
            * It is composed of a 4 prefix bytes followed by the xdr-encoded form
            * of this transaction.
            */

            value: function signatureBase() {
                return Buffer.concat([this.signatureBasePrefix(), this.tx.toXDR()]);
            }
        },
        signatureBasePrefix: {
            value: function signatureBasePrefix() {
                return xdr.EnvelopeType.envelopeTypeTx().toXDR();
            }
        },
        toEnvelope: {

            /**
            * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
            */

            value: function toEnvelope() {
                var tx = this.tx;
                var signatures = this.signatures;
                var envelope = new xdr.TransactionEnvelope({ tx: tx, signatures: signatures });

                return envelope;
            }
        }
    });

    return Transaction;
})();