import {decodeCheck} from "./strkey";

/**
* @class Account
* Represents a single account in Stellar network and its sequence number.
* Account tracts the sequence number as it is used by TransactionBuilder.
* See https://stellar.org/developers/learn/concepts/accounts.html  for more information about how accounts work in Stellar.
*/

export class Account {

    /**
    * Returns true if the given address is a valid Stellar address.
    */
    static isValidAddress(address) {
        try {
            let decoded = decodeCheck("accountId", address);
            if (decoded.length !== 32) {
                return false;
            }
        } catch(err) {
            return false;
        }
        return true;
    }

    /**
    * Create a new Account object.
    * @param {string} address
    * @param {number} sequence
    */
    constructor(address, sequence) {
        this.address = address;
        this.sequence = sequence;
    }
}
