"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _signing = require("./signing");

var sign = _signing.sign;
var verify = _signing.verify;

var strkey = _interopRequireWildcard(require("./strkey"));

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
    accountId: {
      value: function accountId() {
        return new xdr.AccountId.keyTypeEd25519(this._publicKey);
      }
    },
    publicKey: {
      value: function publicKey() {
        return new xdr.PublicKey.keyTypeEd25519(this._publicKey);
      }
    },
    rawPublicKey: {
      value: function rawPublicKey() {
        return this._publicKey;
      }
    },
    signatureHint: {
      value: function signatureHint() {
        var a = this.accountId().toXDR();

        return a.slice(a.length - 4);
      }
    },
    address: {
      value: function address() {
        return strkey.encodeCheck("accountId", this._publicKey);
      }
    },
    seed: {
      value: function seed() {
        return strkey.encodeCheck("seed", this._secretSeed);
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
    verify: {
      value: (function (_verify) {
        var _verifyWrapper = function verify(_x2, _x3) {
          return _verify.apply(this, arguments);
        };

        _verifyWrapper.toString = function () {
          return _verify.toString();
        };

        return _verifyWrapper;
      })(function (data, signature) {
        return verify(data, signature, this._publicKey);
      })
    },
    signDecorated: {
      value: function signDecorated(data) {
        var signature = this.sign(data);
        var hint = this.signatureHint();

        return new xdr.DecoratedSignature({ hint: hint, signature: signature });
      }
    }
  }, {
    fromSeed: {
      value: function fromSeed(seed) {
        var rawSeed = strkey.decodeCheck("seed", seed);
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
        var publicKey = strkey.decodeCheck("accountId", address);
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