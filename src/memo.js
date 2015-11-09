import {default as xdr} from "./generated/stellar-xdr_generated";
import {isString, isUndefined} from 'lodash';
import {UnsignedHyper} from "js-xdr";
import BigNumber from 'bignumber.js';

/**
* @class Memo
*/
export class Memo {

    /**
    * Returns an empty memo.
    */
    static none() {
        return xdr.Memo.memoNone();
    }

    /**
    * Creates and returns a "text" memo.
    * @param {string} text - memo text
    * @returns {xdr.Memo}
    */
    static text(text) {
        if (!isString(text)) {
            throw new Error("Expects string type got a " + typeof(text));
        }
        if (Buffer.byteLength(text, "ascii") > 28) {
            throw new Error("Text should be < 28 bytes (ascii encoded). Got " + Buffer.byteLength(text, "ascii"));
        }
        return xdr.Memo.memoText(text);
    }

    /**
    * Creates and returns an "id" memo.
    * @param {string} id - 64 bit id
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
    * Creates and returns a "hash" memo.
    * @param {array|string} hash - 32 byte hash
    */
    static hash(hash) {
        let error = new Error("Expects a 32 byte hash value. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash)) {
            hash = new Buffer(hash, 'hex');
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return xdr.Memo.memoHash(hash);
    }

    /**
    * Creates and returns a "return hash" memo.
    * @param {array|string} hash - 32 byte hash
    */
    static returnHash(hash) {
        let error = new Error("Expects a 32 byte hash value. Got " + hash);

        if (isUndefined(hash)) {
            throw error;
        }

        if (isString(hash) && Buffer.byteLength(hash) != 32) {
            throw error;
        }

        if (!hash.length || hash.length != 32) {
            throw error;
        }

        return xdr.Memo.memoReturn(hash);
    }
}
