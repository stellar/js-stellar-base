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
     * @param {string} address ID of the account
     * @param {number} sequence current sequence number of the account
     */
    constructor(address, sequence) {
        if (!Account.isValidAddress(address)) {
            throw new Error('address is invalid');
        }
        this.address = address;
        this.sequence = sequence;
    }

    /**
     * Returns true if the given address is a valid Stellar address.
     * @param {string} address account ID to check
     * @returns {boolean}
     */
    static isValidAddress(address) {
        try {
            let decoded = decodeCheck("accountId", address);
            if (decoded.length !== 32) {
                return false;
            }
        } catch (err) {
            return false;
        }
        return true;
    }

    /**
     * @returns {string}
     */
    getAddress() {
        return this.address;
    }

    /**
     * @returns {number}
     */
    getSequenceNumber() {
        return this.sequence;
    }
}
