'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Memo = exports.MemoReturn = exports.MemoHash = exports.MemoText = exports.MemoID = exports.MemoNone = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _jsXdr = require('js-xdr');

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _stellarXdr_generated = require('./generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Type of {@link Memo}.
 */
var MemoNone = exports.MemoNone = 'none';
/**
 * Type of {@link Memo}.
 */
var MemoID = exports.MemoID = 'id';
/**
 * Type of {@link Memo}.
 */
var MemoText = exports.MemoText = 'text';
/**
 * Type of {@link Memo}.
 */
var MemoHash = exports.MemoHash = 'hash';
/**
 * Type of {@link Memo}.
 */
var MemoReturn = exports.MemoReturn = 'return';

/**
 * `Memo` represents memos attached to transactions.
 *
 * @param {string} type - `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
 * @param {*} value - `string` for `MemoID`, `MemoText`, buffer of hex string for `MemoHash` or `MemoReturn`
 * @see [Transactions concept](https://www.stellar.org/developers/learn/concepts/transactions.html)
 * @class Memo
 */

var Memo = function () {
  function Memo(type) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Memo);

    this._type = type;
    this._value = value;

    switch (this._type) {
      case MemoNone:
        break;
      case MemoID:
        Memo._validateIdValue(value);
        break;
      case MemoText:
        Memo._validateTextValue(value);
        break;
      case MemoHash:
      case MemoReturn:
        Memo._validateHashValue(value);
        // We want MemoHash and MemoReturn to have Buffer as a value
        if ((0, _isString2.default)(value)) {
          this._value = Buffer.from(value, 'hex');
        }
        break;
      default:
        throw new Error('Invalid memo type');
    }
  }

  /**
   * Contains memo type: `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
   */


  _createClass(Memo, [{
    key: 'toXDRObject',


    /**
     * Returns XDR memo object.
     * @returns {xdr.Memo}
     */
    value: function toXDRObject() {
      switch (this._type) {
        case MemoNone:
          return _stellarXdr_generated2.default.Memo.memoNone();
        case MemoID:
          return _stellarXdr_generated2.default.Memo.memoId(_jsXdr.UnsignedHyper.fromString(this._value));
        case MemoText:
          return _stellarXdr_generated2.default.Memo.memoText(this._value);
        case MemoHash:
          return _stellarXdr_generated2.default.Memo.memoHash(this._value);
        case MemoReturn:
          return _stellarXdr_generated2.default.Memo.memoReturn(this._value);
        default:
          return null;
      }
    }

    /**
     * Returns {@link Memo} from XDR memo object.
     * @param {xdr.Memo} object XDR memo object
     * @returns {Memo}
     */

  }, {
    key: 'type',
    get: function get() {
      return (0, _clone2.default)(this._type);
    },
    set: function set(type) {
      throw new Error('Memo is immutable');
    }

    /**
     * Contains memo value:
     * * `null` for `MemoNone`,
     * * `string` for `MemoID`,
     * * `Buffer` for `MemoText` after decoding using `fromXDRObject`, original value otherwise,
     * * `Buffer` for `MemoHash`, `MemoReturn`.
     */

  }, {
    key: 'value',
    get: function get() {
      switch (this._type) {
        case MemoNone:
          return null;
        case MemoID:
        case MemoText:
          return (0, _clone2.default)(this._value);
        case MemoHash:
        case MemoReturn:
          return Buffer.from(this._value);
        default:
          throw new Error('Invalid memo type');
      }
    },
    set: function set(value) {
      throw new Error('Memo is immutable');
    }
  }], [{
    key: '_validateIdValue',
    value: function _validateIdValue(value) {
      var error = new Error('Expects a int64 as a string. Got ' + value);

      if (!(0, _isString2.default)(value)) {
        throw error;
      }

      var number = void 0;
      try {
        number = new _bignumber2.default(value);
      } catch (e) {
        throw error;
      }

      // Infinity
      if (!number.isFinite()) {
        throw error;
      }

      // NaN
      if (number.isNaN()) {
        throw error;
      }
    }
  }, {
    key: '_validateTextValue',
    value: function _validateTextValue(value) {
      if (!_stellarXdr_generated2.default.Memo.armTypeForArm('text').isValid(value)) {
        throw new Error('Expects string, array or buffer, max 28 bytes');
      }
    }
  }, {
    key: '_validateHashValue',
    value: function _validateHashValue(value) {
      var error = new Error('Expects a 32 byte hash value or hex encoded string. Got ' + value);

      if (value === null || (0, _isUndefined2.default)(value)) {
        throw error;
      }

      var valueBuffer = void 0;
      if ((0, _isString2.default)(value)) {
        if (!/^[0-9A-Fa-f]{64}$/g.test(value)) {
          throw error;
        }
        valueBuffer = Buffer.from(value, 'hex');
      } else if (Buffer.isBuffer(value)) {
        valueBuffer = Buffer.from(value);
      } else {
        throw error;
      }

      if (!valueBuffer.length || valueBuffer.length !== 32) {
        throw error;
      }
    }

    /**
     * Returns an empty memo (`MemoNone`).
     * @returns {Memo}
     */

  }, {
    key: 'none',
    value: function none() {
      return new Memo(MemoNone);
    }

    /**
     * Creates and returns a `MemoText` memo.
     * @param {string} text - memo text
     * @returns {Memo}
     */

  }, {
    key: 'text',
    value: function text(_text) {
      return new Memo(MemoText, _text);
    }

    /**
     * Creates and returns a `MemoID` memo.
     * @param {string} id - 64-bit number represented as a string
     * @returns {Memo}
     */

  }, {
    key: 'id',
    value: function id(_id) {
      return new Memo(MemoID, _id);
    }

    /**
     * Creates and returns a `MemoHash` memo.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {Memo}
     */

  }, {
    key: 'hash',
    value: function hash(_hash) {
      return new Memo(MemoHash, _hash);
    }

    /**
     * Creates and returns a `MemoReturn` memo.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {Memo}
     */

  }, {
    key: 'return',
    value: function _return(hash) {
      return new Memo(MemoReturn, hash);
    }
  }, {
    key: 'fromXDRObject',
    value: function fromXDRObject(object) {
      switch (object.arm()) {
        case 'id':
          return Memo.id(object.value().toString());
        case 'text':
          return Memo.text(object.value());
        case 'hash':
          return Memo.hash(object.value());
        case 'retHash':
          return Memo.return(object.value());
        default:
          break;
      }

      if (typeof object.value() === 'undefined') {
        return Memo.none();
      }

      throw new Error('Unknown type');
    }
  }]);

  return Memo;
}();

exports.Memo = Memo;