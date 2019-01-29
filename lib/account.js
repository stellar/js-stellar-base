'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Account = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _strkey = require('./strkey');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create a new Account object.
 *
 * `Account` represents a single account in Stellar network and its sequence number.
 * Account tracks the sequence number as it is used by {@link TransactionBuilder}.
 * See [Accounts](https://stellar.org/developers/learn/concepts/accounts.html) for more information about how
 * accounts work in Stellar.
 * @constructor
 * @param {string} accountId ID of the account (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
 * @param {string} sequence current sequence number of the account
 */
var Account = exports.Account = function () {
  function Account(accountId, sequence) {
    _classCallCheck(this, Account);

    if (!_strkey.StrKey.isValidEd25519PublicKey(accountId)) {
      throw new Error('accountId is invalid');
    }
    if (!(0, _isString2.default)(sequence)) {
      throw new Error('sequence must be of type string');
    }
    this._accountId = accountId;
    this.sequence = new _bignumber2.default(sequence);
  }

  /**
   * Returns Stellar account ID, ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
   * @returns {string}
   */


  _createClass(Account, [{
    key: 'accountId',
    value: function accountId() {
      return this._accountId;
    }

    /**
     * @returns {string}
     */

  }, {
    key: 'sequenceNumber',
    value: function sequenceNumber() {
      return this.sequence.toString();
    }

    /**
     * Increments sequence number in this object by one.
     * @returns {void}
     */

  }, {
    key: 'incrementSequenceNumber',
    value: function incrementSequenceNumber() {
      this.sequence = this.sequence.add(1);
    }
  }]);

  return Account;
}();