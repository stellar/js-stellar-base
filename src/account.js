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
     * @param {number} sequence current sequence number of the account
     */
    constructor(accountId, sequence) {
        if (!Account.isValidAccountId(accountId)) {
            throw new Error('address is invalid');
        }
        this._accountId = accountId;
        this.sequence = sequence;
        // @deprecated
        this.address = accountId;
    }

    /**
     * Returns true if the given accountId is a valid Stellar account ID.
     * @param {string} address account ID to check
     * @returns {boolean}
     * @deprecated Use {@link Account#isValidAccountId}
     */
    static isValidAddress(address) {
        console.warn("Account#isValidAddress is deprecated, please use Account#isValidAccountId instead");
        return Account.isValidAccountId(address);
    }

    /**
     * Returns true if the given accountId is a valid Stellar account ID.
     * @param {string} accountId account ID to check
     * @returns {boolean}
     */
    static isValidAccountId(accountId) {
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
     * @returns {number}
     */
    sequenceNumber() {
        return this.sequence;
    }

    /**
     * @returns {string}
     * @deprecated Use {@link Account#accountId}
     */
    getAddress() {
        console.warn("Account#getAddress is deprecated, please use Account#accountId instead");
        return this.address;
    }

    /**
     * @returns {number}
     * @deprecated Use {@link Account#sequenceNumber}
     */
    getSequenceNumber() {
        console.warn("Account#getSequenceNumber is deprecated, please use Account#sequenceNumber instead");
        return this.sequence;
    }
}
