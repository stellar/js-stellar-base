"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _toConsumableArray = require("babel-runtime/helpers/to-consumable-array")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _index = require("./index");

var xdr = _index.xdr;
var hash = _index.hash;
var Keypair = _index.Keypair;

var Account = require("./account").Account;

var Operation = require("./operation").Operation;

var Transaction = require("./transaction").Transaction;

var Memo = require("./memo").Memo;

var map = require("lodash").map;

var FEE = 1000;
var MIN_LEDGER = 0;
var MAX_LEDGER = 4294967295; // max uint32

/**
* @class TransactionBuilder
*/

var TransactionBuilder = exports.TransactionBuilder = (function () {

    /**
    * <p>Transaction builder helps constructs a new Transaction using the given account
    * as the transaction's "source account". The transaction will use the current sequence
    * number of the given account as its sequence number and increment the given account's
    * sequence number by one. The given source account must include a private key for signing
    * the transaction or an error will be thrown.</p>
    *
    * <p>Operations can be added to the transaction via their corresponding builder methods, and
    * each returns the TransactionBuilder object so they can be chained together. After adding
    * the desired operations, call the build() method on the TransactionBuilder to return a fully
    * constructed Transaction that can be signed. The returned transaction will contain the
    * sequence number of the source account and include the signature from the source account.</p>
    *
    * <p>The following code example creates a new transaction with two payment operations
    * and a changeTrust operation. The Transaction's source account first funds destinationA,
    * then extends a trust line to destination A for a currency, then destinationA sends the
    * source account an amount of that currency. The built transaction would need to be signed by
    * both the source acccount and the destinationA account for it to be valid.</p>
    *
    * <pre>var transaction = new TransactionBuilder(source)
    *   .addOperation(Operation.payment({
            destination: destinationA,
            amount: "20000000",
            currency: Currency.native()
        }) // <- funds and creates destinationA
    *   .build();
    * </pre>
    * @constructor
    * @param {Account} sourceAccount - The source account for this transaction.
    * @param {object} [opts]
    * @param {number} [opts.fee] - The max fee willing to pay for this transaction.
    * @param {object} [opts.timebounds] - The timebounds for the validity of this transaction.
    * @param {string} [opts.timebounds.minTime] - 64 bit unix timestamp
    * @param {string} [opts.timebounds.maxTime] - 64 bit unix timestamp
    * @param {Memo} [opts.memo] - The memo for the transaction
    * @param {}
    */

    function TransactionBuilder(source) {
        var opts = arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, TransactionBuilder);

        if (!source) {
            throw new Error("must specify source account for the transaction");
        }
        this.source = source;
        this.operations = [];
        this.signers = [];

        this.fee = opts.fee || FEE;
        this.timebounds = opts.timebounds;

        this.memo = opts.memo || Memo.none();

        // the signed hex form of the transaction to be sent to Horizon
        this.blob = null;
    }

    _createClass(TransactionBuilder, {
        addOperation: {

            /**
            * Adds an operation to the transaction.
            * @param {xdr.Operation} The xdr operation object, use {@link Operation} static methods.
            */

            value: function addOperation(operation) {
                this.operations.push(operation);
                return this;
            }
        },
        addSigner: {

            /**
            * Adds the given signer's signature to the transaction.
            */

            value: function addSigner(keypair) {
                this.signers.push(keypair);
                return this;
            }
        },
        build: {

            /**
            * This will build the transaction and sign it with the source account. It will
            * also increment the source account's sequence number by 1.
            * @returns {Transaction} will return the built Transaction.
            */

            value: function build() {
                var attrs = {
                    sourceAccount: Keypair.fromAddress(this.source.address).accountId(),
                    fee: this.fee,
                    seqNum: xdr.SequenceNumber.fromString(String(Number(this.source.sequence) + 1)),
                    memo: this.memo,
                    ext: new xdr.TransactionExt(0) };
                if (this.timebounds) {
                    attrs.timeBounds = new xdr.TimeBounds(this.timebounds);
                }
                var xtx = new xdr.Transaction(attrs);
                xtx.operations(this.operations);
                var xenv = new xdr.TransactionEnvelope({ tx: xtx });

                var tx = new Transaction(xenv);
                tx.sign.apply(tx, _toConsumableArray(this.signers));

                this.source.sequence = this.source.sequence + 1;
                return tx;
            }
        }
    });

    return TransactionBuilder;
})();