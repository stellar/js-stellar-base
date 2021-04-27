import BigNumber from 'bignumber.js';
import isString from 'lodash/isString';
import { StrKey } from './strkey';

/**
 * Create a new Account object.
 *
 * `Account` represents a single account in Stellar network and its sequence
 * number. Account tracks the sequence number as it is used by {@link
 * TransactionBuilder}. See
 * [Accounts](https://stellar.org/developers/learn/concepts/accounts.html) for
 * more information about how accounts work in Stellar.
 *
 * TODO: Muxed account documentation.
 *
 * @constructor
 *
 * @param {string} accountId ID of the account (ex.
 *     `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA` or
 *     `MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAAGZFQ`)
 * @param {string} sequence current sequence number of the account
 */
export class Account {
  constructor(accountId, sequence) {
    if (
      !StrKey.isValidEd25519PublicKey(accountId) &&
      !StrKey.isValidMed25519PublicKey(accountId)
    ) {
      throw new Error('accountId is invalid');
    }
    if (!isString(sequence)) {
      throw new Error('sequence must be of type string');
    }
    this._accountId = accountId;
    this.sequence = new BigNumber(sequence);

    if (StrKey.isValidMed25519PublicKey(accountId)) {
      // TODO: Extract the underlying muxed ID from the address?
      //       We should evaluate whether or not this is necessary first.
      // this._muxedId
    }
  }

  /**
   * Returns Stellar account ID, ex.
   * `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA` or
   * 'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAAGZFQ'
   * (provided you have opted-in to muxed account support)
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
    this.sequence = this.sequence.add(1);
  }
}
