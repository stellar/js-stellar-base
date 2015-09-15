import {decodeCheck} from "./strkey";

/**
* @class Account
*/
export class Account {

    /**
    * Returns true if the given address is a valid Stellar address.
    */
    static isValidAddress(address) {
        try {
            decodeCheck("accountId", address);
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
        if (!Account.isValidAddress(address)) {
            throw new Error('address is invalid');
        }
        this.address = address;
        this.sequence = sequence;
    }
}
