'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StrKey = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-disable no-bitwise */

exports.decodeCheck = decodeCheck;
exports.encodeCheck = encodeCheck;

var _base = require('base32.js');

var _base2 = _interopRequireDefault(_base);

var _crc = require('crc');

var _crc2 = _interopRequireDefault(_crc);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isNull = require('lodash/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _checksum = require('./util/checksum');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var versionBytes = {
  ed25519PublicKey: 6 << 3, // G
  ed25519SecretSeed: 18 << 3, // S
  preAuthTx: 19 << 3, // T
  sha256Hash: 23 << 3 // X
};

/**
 * StrKey is a helper class that allows encoding and decoding strkey.
 */

var StrKey = exports.StrKey = function () {
  function StrKey() {
    _classCallCheck(this, StrKey);
  }

  _createClass(StrKey, null, [{
    key: 'encodeEd25519PublicKey',

    /**
     * Encodes data to strkey ed25519 public key.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    value: function encodeEd25519PublicKey(data) {
      return encodeCheck('ed25519PublicKey', data);
    }

    /**
     * Decodes strkey ed25519 public key to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */

  }, {
    key: 'decodeEd25519PublicKey',
    value: function decodeEd25519PublicKey(data) {
      return decodeCheck('ed25519PublicKey', data);
    }

    /**
     * Returns true if the given Stellar public key is a valid ed25519 public key.
     * @param {string} publicKey public key to check
     * @returns {boolean}
     */

  }, {
    key: 'isValidEd25519PublicKey',
    value: function isValidEd25519PublicKey(publicKey) {
      return isValid('ed25519PublicKey', publicKey);
    }

    /**
     * Encodes data to strkey ed25519 seed.
     * @param {Buffer} data data to encode
     * @returns {string}
     */

  }, {
    key: 'encodeEd25519SecretSeed',
    value: function encodeEd25519SecretSeed(data) {
      return encodeCheck('ed25519SecretSeed', data);
    }

    /**
     * Decodes strkey ed25519 seed to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */

  }, {
    key: 'decodeEd25519SecretSeed',
    value: function decodeEd25519SecretSeed(data) {
      return decodeCheck('ed25519SecretSeed', data);
    }

    /**
     * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
     * @param {string} seed seed to check
     * @returns {boolean}
     */

  }, {
    key: 'isValidEd25519SecretSeed',
    value: function isValidEd25519SecretSeed(seed) {
      return isValid('ed25519SecretSeed', seed);
    }

    /**
     * Encodes data to strkey preAuthTx.
     * @param {Buffer} data data to encode
     * @returns {string}
     */

  }, {
    key: 'encodePreAuthTx',
    value: function encodePreAuthTx(data) {
      return encodeCheck('preAuthTx', data);
    }

    /**
     * Decodes strkey PreAuthTx to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */

  }, {
    key: 'decodePreAuthTx',
    value: function decodePreAuthTx(data) {
      return decodeCheck('preAuthTx', data);
    }

    /**
     * Encodes data to strkey sha256 hash.
     * @param {Buffer} data data to encode
     * @returns {string}
     */

  }, {
    key: 'encodeSha256Hash',
    value: function encodeSha256Hash(data) {
      return encodeCheck('sha256Hash', data);
    }

    /**
     * Decodes strkey sha256 hash to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */

  }, {
    key: 'decodeSha256Hash',
    value: function decodeSha256Hash(data) {
      return decodeCheck('sha256Hash', data);
    }
  }]);

  return StrKey;
}();

function isValid(versionByteName, encoded) {
  if (encoded && encoded.length !== 56) {
    return false;
  }

  try {
    var decoded = decodeCheck(versionByteName, encoded);
    if (decoded.length !== 32) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

function decodeCheck(versionByteName, encoded) {
  if (!(0, _isString2.default)(encoded)) {
    throw new TypeError('encoded argument must be of type String');
  }

  var decoded = _base2.default.decode(encoded);
  var versionByte = decoded[0];
  var payload = decoded.slice(0, -2);
  var data = payload.slice(1);
  var checksum = decoded.slice(-2);

  if (encoded !== _base2.default.encode(decoded)) {
    throw new Error('invalid encoded string');
  }

  var expectedVersion = versionBytes[versionByteName];

  if ((0, _isUndefined2.default)(expectedVersion)) {
    throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "accountId" or "seed"');
  }

  if (versionByte !== expectedVersion) {
    throw new Error('invalid version byte. expected ' + expectedVersion + ', got ' + versionByte);
  }

  var expectedChecksum = calculateChecksum(payload);

  if (!(0, _checksum.verifyChecksum)(expectedChecksum, checksum)) {
    throw new Error('invalid checksum');
  }

  return Buffer.from(data);
}

function encodeCheck(versionByteName, data) {
  if ((0, _isNull2.default)(data) || (0, _isUndefined2.default)(data)) {
    throw new Error('cannot encode null data');
  }

  var versionByte = versionBytes[versionByteName];

  if ((0, _isUndefined2.default)(versionByte)) {
    throw new Error(versionByteName + ' is not a valid version byte name.  expected one of "ed25519PublicKey", "ed25519SecretSeed", "preAuthTx", "sha256Hash"');
  }

  data = Buffer.from(data);
  var versionBuffer = Buffer.from([versionByte]);
  var payload = Buffer.concat([versionBuffer, data]);
  var checksum = calculateChecksum(payload);
  var unencoded = Buffer.concat([payload, checksum]);

  return _base2.default.encode(unencoded);
}

function calculateChecksum(payload) {
  // This code calculates CRC16-XModem checksum of payload
  // and returns it as Buffer in little-endian order.
  var checksum = Buffer.alloc(2);
  checksum.writeUInt16LE(_crc2.default.crc16xmodem(payload), 0);
  return checksum;
}