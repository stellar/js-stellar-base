"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

Object.defineProperty(exports, "__esModule", {
    value: true
});

var xdr = require("./index").xdr;

/**
* @class Memo
*/

var Memo = exports.Memo = (function () {
    function Memo() {
        _classCallCheck(this, Memo);
    }

    _createClass(Memo, null, {
        none: {

            /**
            * Returns an empty memo.
            */

            value: function none() {
                return xdr.Memo.memoNone();
            }
        },
        text: {

            /**
            * Creates and returns a "text" memo.
            * @param {string} text - memo text
            * @returns {xdr.Memo}
            */

            value: (function (_text) {
                var _textWrapper = function text(_x) {
                    return _text.apply(this, arguments);
                };

                _textWrapper.toString = function () {
                    return _text.toString();
                };

                return _textWrapper;
            })(function (text) {
                if (typeof text !== "string") {
                    throw new Error("Expects string type got a " + typeof text);
                }
                if (Buffer.byteLength(text, "ascii") > 32) {
                    throw new Error("Text should be < 32 bytes (ascii encoded). Got " + Buffer.byteLength(text, "ascii"));
                }
                return xdr.Memo.memoText(text);
            })
        },
        id: {

            /**
            * Creates and returns an "id" memo.
            * @param {string} id - 64 bit id
            * @returns {xdr.Memo}
            */

            value: (function (_id) {
                var _idWrapper = function id(_x2) {
                    return _id.apply(this, arguments);
                };

                _idWrapper.toString = function () {
                    return _id.toString();
                };

                return _idWrapper;
            })(function (id) {
                if (Number(id) === "NaN") {
                    throw new Error("Expects a int64 as a string. Got " + id);
                }
                return xdr.Memo.memoId(id);
            })
        },
        hash: {

            /**
            * Creates and returns a "hash" memo.
            * @param {array|string} hash - 32 byte hash
            */

            value: (function (_hash) {
                var _hashWrapper = function hash(_x3) {
                    return _hash.apply(this, arguments);
                };

                _hashWrapper.toString = function () {
                    return _hash.toString();
                };

                return _hashWrapper;
            })(function (hash) {
                if (typeof hash === "string" && Buffer.byteLength(hash) != 32) {
                    throw new Error("Expects a 32 byte hash value. Got " + Buffer.byteLength(hash) + " bytes instead");
                }
                return xdr.Memo.memoHash(hash);
            })
        },
        returnHash: {

            /**
            * Creates and returns a "return hash" memo.
            * @param {array|string} hash - 32 byte hash
            */

            value: function returnHash(hash) {
                if (typeof hash === "string" && Buffer.byteLength(hash) != 32) {
                    throw new Error("Expects a 32 byte hash value. Got " + Buffer.byteLength(hash) + " bytes instead");
                }
                return xdr.Memo.memoReturn(hash);
            }
        }
    });

    return Memo;
})();