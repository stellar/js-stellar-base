'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transaction = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _index = require('./index');

var _strkey = require('./strkey');

var _operation = require('./operation');

var _network = require('./network');

var _memo = require('./memo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A new Transaction object is created from a transaction envelope or via {@link TransactionBuilder}.
 * Once a Transaction has been created from an envelope, its attributes and operations
 * should not be changed. You should only add signers (using {@link Transaction#sign}) to a Transaction object before
 * submitting to the network or forwarding on to additional signers.
 * @constructor
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 */
var Transaction = exports.Transaction = function () {
  function Transaction(envelope) {
    _classCallCheck(this, Transaction);

    if (typeof envelope === 'string') {
      var buffer = Buffer.from(envelope, 'base64');
      envelope = _index.xdr.TransactionEnvelope.fromXDR(buffer);
    }
    // since this transaction is immutable, save the tx
    this.tx = envelope.tx();
    this.source = _strkey.StrKey.encodeEd25519PublicKey(envelope.tx().sourceAccount().ed25519());
    this.fee = this.tx.fee();
    this._memo = this.tx.memo();
    this.sequence = this.tx.seqNum().toString();

    var timeBounds = this.tx.timeBounds();
    if (timeBounds) {
      this.timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }

    var operations = this.tx.operations() || [];
    this.operations = (0, _map2.default)(operations, function (op) {
      return _operation.Operation.fromXDRObject(op);
    });

    var signatures = envelope.signatures() || [];
    this.signatures = (0, _map2.default)(signatures, function (s) {
      return s;
    });
  }

  _createClass(Transaction, [{
    key: 'sign',


    /**
     * Signs the transaction with the given {@link Keypair}.
     * @param {...Keypair} keypairs Keypairs of signers
     * @returns {void}
     */
    value: function sign() {
      var _this = this;

      var txHash = this.hash();

      for (var _len = arguments.length, keypairs = Array(_len), _key = 0; _key < _len; _key++) {
        keypairs[_key] = arguments[_key];
      }

      (0, _each2.default)(keypairs, function (kp) {
        var sig = kp.signDecorated(txHash);
        _this.signatures.push(sig);
      });
    }

    /**
     * Add `hashX` signer preimage as signature.
     * @param {Buffer|String} preimage Preimage of hash used as signer
     * @returns {void}
     */

  }, {
    key: 'signHashX',
    value: function signHashX(preimage) {
      if ((0, _isString2.default)(preimage)) {
        preimage = Buffer.from(preimage, 'hex');
      }

      if (preimage.length > 64) {
        throw new Error('preimage cannnot be longer than 64 bytes');
      }

      var signature = preimage;
      var hashX = _crypto2.default.createHash('sha256').update(preimage).digest();
      var hint = hashX.slice(hashX.length - 4);
      this.signatures.push(new _index.xdr.DecoratedSignature({ hint: hint, signature: signature }));
    }

    /**
     * Returns a hash for this transaction, suitable for signing.
     * @returns {Buffer}
     */

  }, {
    key: 'hash',
    value: function hash() {
      return (0, _index.hash)(this.signatureBase());
    }

    /**
     * Returns the "signature base" of this transaction, which is the value
     * that, when hashed, should be signed to create a signature that
     * validators on the Stellar Network will accept.
     *
     * It is composed of a 4 prefix bytes followed by the xdr-encoded form
     * of this transaction.
     * @returns {Buffer}
     */

  }, {
    key: 'signatureBase',
    value: function signatureBase() {
      if (_network.Network.current() === null) {
        throw new Error('No network selected. Use `Network.use`, `Network.usePublicNetwork` or `Network.useTestNetwork` helper methods to select network.');
      }

      return Buffer.concat([_network.Network.current().networkId(), _index.xdr.EnvelopeType.envelopeTypeTx().toXDR(), this.tx.toXDR()]);
    }

    /**
     * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
     * @returns {xdr.TransactionEnvelope}
     */

  }, {
    key: 'toEnvelope',
    value: function toEnvelope() {
      var tx = this.tx;
      var signatures = this.signatures;
      var envelope = new _index.xdr.TransactionEnvelope({ tx: tx, signatures: signatures });

      return envelope;
    }
  }, {
    key: 'memo',
    get: function get() {
      return _memo.Memo.fromXDRObject(this._memo);
    },
    set: function set(value) {
      throw new Error('Transaction is immutable');
    }
  }]);

  return Transaction;
}();