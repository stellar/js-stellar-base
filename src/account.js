import BigNumber from 'bignumber.js';
import isString from 'lodash/isString';
import {Keypair} from './keypair';
import {decodeCheck} from "./strkey";

export class Account {
    /**
     * Create a new Account object.
     *
     * `Account` represents a single account in Stellar network and it's sequence number.
     * Account tracts the sequence number as it is used by {@link TransactionBuilder}.
     * See [Accounts](https://stellar.org/developers/learn/concepts/accounts.html) for more information about how
     * accounts work in Stellar.
     * @constructor
     * @param {string} accountId ID of the account (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
     * @param {string} sequence current sequence number of the account
     */
    constructor(accountId, sequence) {
        if (!Keypair.isValidPublicKey(accountId)) {
            throw new Error('accountId is invalid');
        }
        if (!isString(sequence)) {
            throw new Error('sequence must be of type string');
        }
        this._accountId = accountId;
        this.sequence = new BigNumber(sequence);
    }

    /**
     * Returns true if the given accountId is a valid Stellar account ID.
     * @param {string} accountId account ID to check
     * @returns {boolean}
     * @deprecated Use {@link Keypair.isValidPublicKey}
     */
    static isValidAccountId(accountId) {
        console.warn('Account.isValidAccountId is deprecated. Use Keypair.isValidPublicKey.');
        try {
            let decoded = decodeCheck("accountId", accountId);
            if (decoded.length !== 32) {
                return false;
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * Returns Stellar account ID, ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
     * @returns {string}
     */
    accountId() {
        return this._accountId;
    }

    /**
     * @returns {string}
     */
    sequenceNumber() {
        return this.sequence.toString();
    }

    /**
     * Increments sequence number in this object by one.
     */
    incrementSequenceNumber() {
        this.sequence = this.sequence.add(1);
    }
}
