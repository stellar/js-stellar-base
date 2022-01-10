import isString from 'lodash/isString';
import BigNumber from 'bignumber.js';

import { StrKey } from './strkey';
import {
  MUXED_ACCOUNT_FORCE_ED25519,
  decodeAddressToMuxedAccount,
  encodeMuxedAccountToAddress,
  encodeMuxedAccount
} from './util/decode_encode_muxed_account';

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
    if (!isString(sequence)) {
      throw new Error('sequence must be of type string');
    }

    this._accountId = accountId;
    this.sequence = new BigNumber(sequence);
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
    this.sequence = this.sequence.add(1);
  }
}

/**
 * Represents a muxed account for transactions and operations.
 *
 * A muxed (or *multiplexed*) account (defined in
 * [CAP-27](https://stellar.org/protocol/cap-27) and
 * [SEP-23](https://stellar.org/protocol/sep-23)) is one that resolves a single
 * Stellar `G...`` account to many different underlying IDs.
 *
 * For example, you may have a single Stellar address for accounting purposes:
 *   GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ
 *
 * Yet would like to use it for 4 different family members:
 *   1: MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAAGZFQ
 *   2: MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAALIWQ
 *   3: MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAAPYHQ
 *   4: MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAAQLQQ
 *
 * This object makes it easy to create muxed accounts from regular accounts,
 * duplicate them, get/set the underlying IDs, etc. without mucking around with
 * the raw XDR.
 *
 * Because muxed accounts are purely an off-chain convention, they all share the
 * sequence number tied to their underlying G... account. Thus, this object
 * *requires* an {@link Account} instance to be passed in, so that muxed
 * instances of an account can collectively modify the sequence number whenever
 * a muxed account is used as the source of a @{link Transaction} with {@link
 * TransactionBuilder}.
 *
 * @constructor
 *
 * @param {Account}   account - the @{link Account} instance representing the
 *                              underlying G... address
 * @param {string}    id      - a stringified uint64 value that represents the
 *                              ID of the muxed account
 *
 * @see https://developers.stellar.org/docs/glossary/muxed-accounts/
 */
export class MuxedAccount {
  constructor(baseAccount, id) {
    const accountId = baseAccount.accountId();
    if (!StrKey.isValidEd25519PublicKey(accountId)) {
      throw new Error('accountId is invalid');
    }

    this.account = baseAccount;
    this._muxedXdr = encodeMuxedAccount(accountId, id);
    this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr);
    this._id = id;
  }

  /**
   * Parses an M-address into a MuxedAccount object.
   *
   * @param  {string} mAddress    - an M-address to transform
   * @param  {string} sequenceNum - the sequence number of the underlying {@link
   *     Account}, to use for the underlying base account (@link
   *     MuxedAccount.baseAccount). If you're using the SDK, you can use
   *     `server.loadAccount` to fetch this if you don't know it.
   *
   * @return {MuxedAccount}
   */
  static fromAddress(mAddress, sequenceNum) {
    const muxedAccount = decodeAddressToMuxedAccount(mAddress);
    const gAddress = encodeMuxedAccountToAddress(
      muxedAccount,
      MUXED_ACCOUNT_FORCE_ED25519
    );
    const id = muxedAccount
      .med25519()
      .id()
      .toString();

    return new MuxedAccount(new Account(gAddress, sequenceNum), id);
  }

  /**
   * @return {Account} the underlying account object shared among all muxed
   *     accounts with this Stellar public key (G... address)
   */
  baseAccount() {
    return this.account;
  }

  /**
   * @return {string} the M-address representing this account's (G-address, ID)
   */
  accountId() {
    return this._mAddress;
  }

  id() {
    return this._id;
  }

  setId(id) {
    if (!isString(id)) {
      throw new Error('id should be a string representing a number (uint64)');
    }

    this._muxedXdr = encodeMuxedAccount(this.account.accountId(), id);
    this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr);
    this._id = id;
    return this;
  }

  /**
   * Accesses the underlying account's sequence number.
   * @return {string}  strigified sequence number for the underlying account
   */
  sequenceNumber() {
    return this.account.sequenceNumber();
  }

  /**
   * Increments the underlying account's sequence number by one.
   * @return {void}
   */
  incrementSequenceNumber() {
    return this.account.incrementSequenceNumber();
  }

  /**
   * @return {xdr.MuxedAccount} the XDR object representing this muxed account's
   *     G-address and uint64 ID
   */
  toXDRObject() {
    return this._muxedXdr;
  }

  equals(otherMuxedAccount) {
    return this.accountId() === otherMuxedAccount.accountId();
  }
}
