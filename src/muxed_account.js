import isString from 'lodash/isString';

import xdr from './generated/stellar-xdr_generated';
import { Account } from './account';
import { StrKey } from './strkey';
import {
  decodeAddressToMuxedAccount,
  encodeMuxedAccountToAddress
} from './util/decode_encode_muxed_account';

/**
 * Represents a muxed account for transactions and operations.
 *
 * A muxed (or *multiplexed*) account (defined rigorously in
 * [CAP-27](https://stellar.org/protocol/cap-27) and briefly in
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
 * duplicate them, retrieve the underlying IDs, etc. without mucking around with
 * the raw XDR.
 *
 * Because muxed accounts are purely an off-chain convention, they all share the
 * sequence number tied to the underlying G... account. Thus, this object
 * *requires* an {@link Account} instance to be passed in, so that muxed
 * instances of an account can collectively modify the sequence number whenever
 * a muxed account is used as the source of a @{link Transaction} with {@link
 * TransactionBuilder}.
 *
 * @constructor
 *
 * @param {Account}   account - the @{link Account} instance representing the
 *     underlying G... address
 * @param {string}    id      - a stringified uint64 value that represents the
 *     ID of the muxed account
 */
export class MuxedAccount {
  constructor(baseAccount, id) {
    if (!(baseAccount instanceof Account)) {
      throw new Error(
        `baseAccount should be Account, not ${typeof baseAccount}`
      );
    }

    const accountId = baseAccount.accountId();
    if (!StrKey.isValidEd25519PublicKey(accountId)) {
      throw new Error('accountId is invalid');
    }

    this.account = baseAccount;
    this._muxedXdr = decodeAddressToMuxedAccount(accountId, true);
    this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr, true);
    this.setId(id);
  }

  /**
   * Creates a muxed account with the *same base* address but a *new* ID.
   *
   * @param  {string} newId - the ID of the new muxed account
   * @return {MuxedAccount} a new instance w/ the specified parameters
   */
  createSubaccount(newId) {
    return new MuxedAccount(this.account, newId);
  }

  /**
   * @return {Account} the underlying account object shared among all muxed
   *     accounts with this Stellar address
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

    this._muxedXdr.med25519().id(xdr.Uint64.fromString(id));
    this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr, true);
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
  asXDRObject() {
    return this._muxedXdr;
  }

  equals(otherMuxedAccount) {
    return this.accountId() === otherMuxedAccount.accountId();
  }
}
