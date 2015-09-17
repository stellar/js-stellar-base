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
