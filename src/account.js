import { StrKey } from './strkey';

/**
 * Create a new Account object.
 *
 * `Account` represents a single account in the Stellar network and its sequence
 * number. Account tracks the sequence number as it is used by {@link
 * TransactionBuilder}. See
 * [Accounts](https://developers.stellar.org/docs/glossary/accounts/) for
 * more information about how accounts work in Stellar.
 *
 * @constructor
 *
 * @param {string} accountId - ID of the account (ex.
 *     `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`). If you
 *     provide a muxed account address, this will throw; use {@link
 *     MuxedAccount} instead.
 * @param {string} sequence  - current sequence number of the account
 */
export class Account {
  constructor(accountId, sequence) {
    if (StrKey.isValidMed25519PublicKey(accountId)) {
      throw new Error('accountId is an M-address; use MuxedAccount instead');
    }

    if (!StrKey.isValidEd25519PublicKey(accountId)) {
      throw new Error('accountId is invalid');
    }
    if (!(typeof sequence === 'string')) {
      throw new Error('sequence must be of type string');
    }

    this._accountId = accountId;
    try {
      this.sequence = BigInt(sequence);
    } catch (e) {
      throw new Error(`sequence is not a number: ${sequence}`);
    }
  }

  /**
   * Returns Stellar account ID, ex.
   * `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`.
   * @returns {string}
   */
  accountId() {
    return this._accountId;
  }

  /**
   * @returns {string}  sequence number for the account as a string
   */
  sequenceNumber() {
    return this.sequence.toString();
  }

  /**
   * Increments sequence number in this object by one.
   * @returns {void}
   */
  incrementSequenceNumber() {
    this.sequence += 1n;
  }
}
