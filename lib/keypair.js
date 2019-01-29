'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keypair = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _network = require('./network');

var _signing = require('./signing');

var _base = require('./base58');

var base58 = _interopRequireWildcard(_base);

var _strkey = require('./strkey');

var _stellarXdr_generated = require('./generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * `Keypair` represents public (and secret) keys of the account.
 *
 * Currently `Keypair` only supports ed25519 but in a future this class can be abstraction layer for other
 * public-key signature systems.
 *
 * Use more convenient methods to create `Keypair` object:
 * * `{@link Keypair.fromPublicKey}`
 * * `{@link Keypair.fromSecret}`
 * * `{@link Keypair.random}`
 *
 * @constructor
 * @param {object} keys At least one of keys must be provided.
 * @param {string} keys.type Public-key signature system name. (currently only `ed25519` keys are supported)
 * @param {Buffer} [keys.publicKey] Raw public key
 * @param {Buffer} [keys.secretKey] Raw secret key (32-byte secret seed in ed25519`)
 */
var Keypair = exports.Keypair = function () {
  function Keypair(keys) {
    _classCallCheck(this, Keypair);

    if (keys.type !== 'ed25519') {
      throw new Error('Invalid keys type');
    }

    this.type = keys.type;

    if (keys.secretKey) {
      keys.secretKey = Buffer.from(keys.secretKey);

      if (keys.secretKey.length !== 32) {
        throw new Error('secretKey length is invalid');
      }

      var secretKeyUint8 = new Uint8Array(keys.secretKey);
      var naclKeys = _tweetnacl2.default.sign.keyPair.fromSeed(secretKeyUint8);

      this._secretSeed = keys.secretKey;
      this._secretKey = Buffer.from(naclKeys.secretKey);
      this._publicKey = Buffer.from(naclKeys.publicKey);

      if (keys.publicKey && !this._publicKey.equals(Buffer.from(keys.publicKey))) {
        throw new Error('secretKey does not match publicKey');
      }
    } else {
      this._publicKey = Buffer.from(keys.publicKey);

      if (this._publicKey.length !== 32) {
        throw new Error('publicKey length is invalid');
      }
    }
  }

  /**
   * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
   * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
   * @param {string} secret secret key (ex. `SDAKFNYEIAORZKKCYRILFQKLLOCNPL5SWJ3YY5NM3ZH6GJSZGXHZEPQS`)
   * @returns {Keypair}
   */


  _createClass(Keypair, [{
    key: 'xdrAccountId',
    value: function xdrAccountId() {
      return new _stellarXdr_generated2.default.AccountId.publicKeyTypeEd25519(this._publicKey);
    }
  }, {
    key: 'xdrPublicKey',
    value: function xdrPublicKey() {
      return new _stellarXdr_generated2.default.PublicKey.publicKeyTypeEd25519(this._publicKey);
    }

    /**
     * Returns raw public key
     * @returns {Buffer}
     */

  }, {
    key: 'rawPublicKey',
    value: function rawPublicKey() {
      return this._publicKey;
    }
  }, {
    key: 'signatureHint',
    value: function signatureHint() {
      var a = this.xdrAccountId().toXDR();

      return a.slice(a.length - 4);
    }

    /**
     * Returns public key associated with this `Keypair` object.
     * @returns {string}
     */

  }, {
    key: 'publicKey',
    value: function publicKey() {
      return _strkey.StrKey.encodeEd25519PublicKey(this._publicKey);
    }

    /**
     * Returns secret key associated with this `Keypair` object
     * @returns {string}
     */

  }, {
    key: 'secret',
    value: function secret() {
      if (!this._secretSeed) {
        throw new Error('no secret key available');
      }

      if (this.type === 'ed25519') {
        return _strkey.StrKey.encodeEd25519SecretSeed(this._secretSeed);
      }

      throw new Error('Invalid Keypair type');
    }

    /**
     * Returns raw secret key.
     * @returns {Buffer}
     */

  }, {
    key: 'rawSecretKey',
    value: function rawSecretKey() {
      return this._secretSeed;
    }

    /**
     * Returns `true` if this `Keypair` object contains secret key and can sign.
     * @returns {boolean}
     */

  }, {
    key: 'canSign',
    value: function canSign() {
      return !!this._secretKey;
    }

    /**
     * Signs data.
     * @param {Buffer} data Data to sign
     * @returns {Buffer}
     */

  }, {
    key: 'sign',
    value: function sign(data) {
      if (!this.canSign()) {
        throw new Error('cannot sign: no secret key available');
      }

      return (0, _signing.sign)(data, this._secretKey);
    }

    /**
     * Verifies if `signature` for `data` is valid.
     * @param {Buffer} data Signed data
     * @param {Buffer} signature Signature
     * @returns {boolean}
     */

  }, {
    key: 'verify',
    value: function verify(data, signature) {
      return (0, _signing.verify)(data, signature, this._publicKey);
    }
  }, {
    key: 'signDecorated',
    value: function signDecorated(data) {
      var signature = this.sign(data);
      var hint = this.signatureHint();

      return new _stellarXdr_generated2.default.DecoratedSignature({ hint: hint, signature: signature });
    }
  }], [{
    key: 'fromSecret',
    value: function fromSecret(secret) {
      var rawSecret = _strkey.StrKey.decodeEd25519SecretSeed(secret);
      return this.fromRawEd25519Seed(rawSecret);
    }

    /**
     * Base58 address encoding is **DEPRECATED**! Use this method only for transition to strkey encoding.
     * @param {string} seed Base58 secret seed
     * @deprecated Use {@link Keypair.fromSecret}
     * @returns {Keypair}
     */

  }, {
    key: 'fromBase58Seed',
    value: function fromBase58Seed(seed) {
      var rawSeed = base58.decodeBase58Check('seed', seed);
      return this.fromRawEd25519Seed(rawSeed);
    }

    /**
     * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
     *
     * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
     * @returns {Keypair}
     */

  }, {
    key: 'fromRawEd25519Seed',
    value: function fromRawEd25519Seed(rawSeed) {
      return new this({ type: 'ed25519', secretKey: rawSeed });
    }

    /**
     * Returns `Keypair` object representing network master key.
     * @returns {Keypair}
     */

  }, {
    key: 'master',
    value: function master() {
      if (_network.Network.current() === null) {
        throw new Error('No network selected. Use `Network.use`, `Network.usePublicNetwork` or `Network.useTestNetwork` helper methods to select network.');
      }
      return this.fromRawEd25519Seed(_network.Network.current().networkId());
    }

    /**
     * Creates a new `Keypair` object from public key.
     * @param {string} publicKey public key (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
     * @returns {Keypair}
     */

  }, {
    key: 'fromPublicKey',
    value: function fromPublicKey(publicKey) {
      publicKey = _strkey.StrKey.decodeEd25519PublicKey(publicKey);
      if (publicKey.length !== 32) {
        throw new Error('Invalid Stellar public key');
      }
      return new this({ type: 'ed25519', publicKey: publicKey });
    }

    /**
     * Create a random `Keypair` object.
     * @returns {Keypair}
     */

  }, {
    key: 'random',
    value: function random() {
      var secret = _tweetnacl2.default.randomBytes(32);
      return this.fromRawEd25519Seed(secret);
    }
  }]);

  return Keypair;
}();