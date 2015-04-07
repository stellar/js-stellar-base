"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _signing = require("./signing");

var sign = _signing.sign;
var verify = _signing.verify;

var base58 = _interopRequireWildcard(require("./base58"));

var xdr = _interopRequire(require("./generated/stellar-xdr_generated"));

var nacl = require("tweetnacl");

var Keypair = exports.Keypair = (function () {
  function Keypair(keysAndSeed) {
    _classCallCheck(this, Keypair);

    this._publicKey = new Buffer(keysAndSeed.publicKey);

    if (keysAndSeed.secretSeed) {
      this._secretSeed = new Buffer(keysAndSeed.secretSeed);
      this._secretKey = new Buffer(keysAndSeed.secretKey);
    }
  }

  _createClass(Keypair, {
    publicKey: {
      value: function publicKey() {
        return this._publicKey;
      }
    },
    publicKeyHint: {
      value: function publicKeyHint() {
        return this._publicKey.slice(0, 4);
      }
    },
    address: {
      value: function address() {
        return base58.encodeBase58Check("accountId", this._publicKey);
      }
    },
    seed: {
      value: function seed() {
        return base58.encodeBase58Check("seed", this._secretSeed);
      }
    },
    rawSeed: {
      value: function rawSeed() {
        return this._secretSeed;
      }
    },
    canSign: {
      value: function canSign() {
        return !!this._secretKey;
      }
    },
    sign: {
      value: (function (_sign) {
        var _signWrapper = function sign(_x) {
          return _sign.apply(this, arguments);
        };

        _signWrapper.toString = function () {
          return _sign.toString();
        };

        return _signWrapper;
      })(function (data) {
        if (!this.canSign()) {
          throw new Error("cannot sign: no secret key available");
        }

        return sign(data, this._secretKey);
      })
    },
    signDecorated: {
      value: function signDecorated(data) {
        var signature = this.sign(data);
        var hint = this.publicKeyHint();

        return new xdr.DecoratedSignature({ hint: hint, signature: signature });
      }
    }
  }, {
    fromSeed: {
      value: function fromSeed(seed) {
        var rawSeed = base58.decodeBase58Check("seed", seed);
        return this.fromRawSeed(rawSeed);
      }
    },
    fromRawSeed: {
      value: function fromRawSeed(rawSeed) {
        rawSeed = new Buffer(rawSeed);
        var rawSeedU8 = new Uint8Array(rawSeed);
        var keys = nacl.sign.keyPair.fromSeed(rawSeedU8);
        keys.secretSeed = rawSeed;

        return new this(keys);
      }
    },
    master: {
      value: function master() {
        return this.fromRawSeed("allmylifemyhearthasbeensearching");
      }
    },
    fromAddress: {
      value: function fromAddress(address) {
        var publicKey = base58.decodeBase58Check("accountId", address);
        return new this({ publicKey: publicKey });
      }
    },
    random: {
      value: function random() {
        var seed = nacl.randomBytes(32);
        return this.fromRawSeed(seed);
      }
    }
  });

  return Keypair;
})();