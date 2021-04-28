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
 * Enables easier management of muxed accounts.
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
 * @constructor
 *
 * @param {string} address - either the G... (un-multiplexed yet) or M...
 *     address of the account. If a G address is passed, the ID is initialized
 *     to zero.
 */
export class MuxedAccount {
  constructor(address) {
    if (StrKey.isValidEd25519PublicKey(address)) {
      this._muxedXdr = decodeAddressToMuxedAccount(address, true);
      this._mAddress = encodeMuxedAccountToAddress(this._muxedXdr, true);
      this._gAddress = address;
      this.setId('0');
    } else if (StrKey.isValidMed25519PublicKey(address)) {
      this._mAddress = address;
      this._muxedXdr = decodeAddressToMuxedAccount(this._mAddress, true);
      this._gAddress = encodeMuxedAccountToAddress(this._muxedXdr, false);
      this._id = this._muxedXdr
        .med25519()
        .id()
        .toString();
    } else {
      throw new Error('address is invalid');
    }
  }

  static fromXDRObject(xdrMuxedAccount) {
    if (!(xdrMuxedAccount instanceof xdr.MuxedAccount)) {
      throw new Error('xdrMuxedAccount must be an xdr.MuxedAccount instance');
    }

    const address = encodeMuxedAccountToAddress(xdrMuxedAccount, true);
    return new MuxedAccount(address);
  }

  createSubaccount(newId) {
    return MuxedAccount.fromXDRObject(
      encodeMuxedAccount(this._gAddress, newId)
    );
  }

  asAccount(seqNo) {
    return new Account(this._gAddress, seqNo || '0');
  }

  address() {
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

  asXDRObject() {
    return this._muxedXdr;
  }

  equals(otherMuxedAccount) {
    return this.address() === otherMuxedAccount.address();
  }
}
