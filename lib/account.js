"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var decodeBase58Check = require("./index").decodeBase58Check;

/**
* @class Account
*/

var Account = exports.Account = (function () {

    /**
    * Create a new Account object.
    * @param {string} address
    * @param {number} sequence
    */

    function Account(address, sequence) {
        _classCallCheck(this, Account);

        this.address = address;
        this.sequence = sequence;
    }

    _createClass(Account, null, {
        isValidAddress: {

            /**
            * Returns true if the given address is a valid Stellar address.
            */

            value: function isValidAddress(address) {
                try {
                    decodeBase58Check("accountId", address);
                } catch (err) {
                    return false;
                }
                return true;
            }
        }
    });

    return Account;
})();