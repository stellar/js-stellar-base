import {default as xdr} from "./generated/stellar-xdr_generated";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import {UnsignedHyper} from "js-xdr";
import BigNumber from 'bignumber.js';

/**
 * `Memo` represents memos attached to transactions. Use static methods to create memos.
 *
 * @see [Transactions concept](https://www.stellar.org/developers/learn/concepts/transactions.html)
 * @class Memo
 */
export class Memo {

    /**
     * Returns an empty memo (`MEMO_NONE`).
     * @returns {xdr.Memo}
     */
    static none() {
        return xdr.Memo.memoNone();
    }

    /**
     * Creates and returns a `MEMO_TEXT` memo.
     * @param {string} text - memo text
     * @returns {xdr.Memo}
     */
    static text(text) {
        if (!isString(text)) {
            throw new Error("Expects string type got a " + typeof(text));
        }
        if (Buffer.byteLength(text, "utf8") > 28) {
            throw new Error("Text should be <= 28 bytes. Got " + Buffer.byteLength(text, "utf8"));
        }
        return xdr.Memo.memoText(text);
    }

    /**
     * Creates and returns a `MEMO_ID` memo.
     * @param {string} id - 64-bit number represented as a string
     * @returns {xdr.Memo}
     */
    static id(id) {
        let error = new Error("Expects a int64 as a string. Got " + id);

        if (!isString(id)) {
            throw error;
        }

        let number;
        try {
            number = new BigNumber(id);
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

        return xdr.Memo.memoId(UnsignedHyper.fromString(id));
    }

    /**
     * Creates and returns a `MEMO_HASH` memo.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {xdr.Memo}
     */
    static hash(hash) {
        let error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash)) {
            if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                throw error;
            }
            hash = new Buffer(hash, 'hex');
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return xdr.Memo.memoHash(hash);
    }

    /**
     * Creates and returns a `MEMO_RETURN` memo.
     * @param {array|string} hash - 32 byte hash or hex encoded string
     * @returns {xdr.Memo}
     */
    static returnHash(hash) {
        let error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash)) {
            if (!/^[0-9A-Fa-f]{64}$/g.test(hash)) {
                throw error;
            }
            hash = new Buffer(hash, 'hex');
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return xdr.Memo.memoReturn(hash);
    }
}
