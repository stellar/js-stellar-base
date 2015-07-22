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
    *                                                    hex encoded string.
    */

    function Transaction(envelope) {
        _classCallCheck(this, Transaction);

        if (typeof envelope === "string") {
            var buffer = new Buffer(envelope, "hex");
            envelope = xdr.TransactionEnvelope.fromXDR(buffer);
        }
        // since this transaction is immutable, save the tx
        this.tx = envelope.tx();
        this.source = encodeCheck("accountId", envelope.tx().sourceAccount().ed25519());
        this.fee = envelope._attributes.tx._attributes.fee;
        this.sequence = envelope._attributes.tx._attributes.seqNum.toString();
        this.minLedger = envelope._attributes.tx._attributes.minLedger;
        this.maxLedger = envelope._attributes.tx._attributes.maxLedger;
        var operations = envelope._attributes.tx._attributes.operations;
        this.operations = [];
        for (var i = 0; i < operations.length; i++) {
            this.operations[i] = Operation.operationToObject(operations[i]._attributes);
        }
        var signatures = envelope._attributes.signatures;
        this.signatures = [];
        for (var i = 0; i < signatures.length; i++) {
            this.signatures[i] = signatures[i];
        }
    }

    _createClass(Transaction, {
        addSignature: {

            /**
            * Adds a signature to this transaction.
            * @param signature
            */

            value: function addSignature(signature) {
                this.signatures.push(signature);
            }
        },
        sign: {

            /**
            * Signs the transaction with the given Keypair.
            * @param {Keypair} keypair
            */

            value: function sign(keypair) {
                var tx_raw = this.tx.toXDR();
                var tx_hash = hash(tx_raw);
                return keypair.signDecorated(tx_hash);
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