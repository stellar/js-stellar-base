import isString from 'lodash/isString';

import xdr from './generated/stellar-xdr_generated';
import { Account } from './account';
import { StrKey } from './strkey';
import {
  decodeAddressToMuxedAccount,
  encodeMuxedAccountToAddress,
  encodeMuxedAccount
} from './util/decode_encode_muxed_account';

/**
 * Represents a muxed account for transactions and operations.
 *
 * A muxed (or *multiplexed*) account (defined rigorously in
 * [CAP-27](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md))
 * is one that resolves a single Stellar `G...`` address to many different
 * underlying IDs.
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
 * Like {@link Account}, it represents an account in the Stellar network and its
 * sequence number, and tracks it when used with {@link TransactionBuilder}.
 *
 * @constructor
 *
 * @param {string} accountId  - either the G... (un-multiplexed yet) or M...
 *     address of the account. If a G address is passed, the ID is initialized
 *     to zero.
 * @param {string} sequence   - current sequence number of the account
 */
export class MuxedAccount {
  constructor(accountId, sequence) {
    let gAddress;
    if (StrKey.isValidEd25519PublicKey(accountId)) {
      this._muxedXdr = decodeAddressToMuxedAccount(accountId, true);
      this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr, true);
      gAddress = accountId;
      this.setId('0');
    } else if (StrKey.isValidMed25519PublicKey(accountId)) {
      this._mAddress = accountId;
      this._muxedXdr = decodeAddressToMuxedAccount(this._mAddress, true);
      gAddress = encodeMuxedAccountToAddress(this._muxedXdr, false);
      this.setId(
        this._muxedXdr
          .med25519()
          .id()
          .toString()
      );
    } else {
      throw new Error('accountId is invalid');
    }

    this.account = new Account(gAddress, sequence);
  }

  static fromXDRObject(xdrMuxedAccount, sequence) {
    if (!(xdrMuxedAccount instanceof xdr.MuxedAccount)) {
      throw new Error('xdrMuxedAccount must be an xdr.MuxedAccount instance');
    }

    const address = encodeMuxedAccountToAddress(xdrMuxedAccount, true);
    return new MuxedAccount(address, sequence || '0');
  }

  createSubaccount(newId, newSequenceNumber) {
    return MuxedAccount.fromXDRObject(
      encodeMuxedAccount(this.account.accountId(), newId),
      newSequenceNumber
    );
  }

  underlyingAccountId() {
    return this.account.accountId();
  }

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
    this._id = id;
    return this;
  }

  /**
   * @returns {string}  sequence number for the account as a string
   */
  sequenceNumber() {
    return this.account.sequenceNumber();
  }

  /**
   * Increments sequence number in this object by one.
   * @returns {void}
   */
  incrementSequenceNumber() {
    this.account.incrementSequenceNumber();
  }

  asXDRObject() {
    return this._muxedXdr;
  }

  equals(otherMuxedAccount) {
    return this.accountId() === otherMuxedAccount.accountId();
  }
}
