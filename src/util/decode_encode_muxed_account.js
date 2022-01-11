import isString from 'lodash/isString';

import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';

/**
 * Converts a Stellar address (in G... or M... form) to an `xdr.MuxedAccount`
 * structure, using the ed25519 representation when possible.
 *
 * This supports full muxed accounts by default, where an M... address will
 * resolve to both its underlying G... address and an ID.
 *
 * @param   {string}  address   G... or M... address to encode into XDR
 * @returns {xdr.MuxedAccount}  a muxed account object for this address string
 */
export function decodeAddressToMuxedAccount(address) {
  if (StrKey.isValidMed25519PublicKey(address)) {
    return _decodeAddressFullyToMuxedAccount(address);
  }

  return xdr.MuxedAccount.keyTypeEd25519(
    StrKey.decodeEd25519PublicKey(address)
  );
}

/**
 * Converts an xdr.MuxedAccount to its StrKey representation.
 *
 * This returns its "M..." string representation if there is a muxing ID within
 * the object and returns the "G..." representation otherwise.
 *
 * @param   {xdr.MuxedAccount} muxedAccount   Raw account to stringify
 * @returns {string} Stringified G... (corresponding to the underlying pubkey)
 *     or M... address (corresponding to both the key and the muxed ID)
 *
 * @see https://stellar.org/protocol/sep-23
 */
export function encodeMuxedAccountToAddress(muxedAccount) {
  if (
    muxedAccount.switch().value ===
    xdr.CryptoKeyType.keyTypeMuxedEd25519().value
  ) {
    return _encodeMuxedAccountFullyToAddress(muxedAccount);
  }

  return StrKey.encodeEd25519PublicKey(muxedAccount.ed25519());
}

/**
 * Transform a Stellar address (G...) and an ID into its XDR representation.
 *
 * @param  {string} address   - a Stellar G... address
 * @param  {string} id        - a Uint64 ID represented as a string
 *
 * @return {xdr.MuxedAccount} - XDR representation of the above muxed account
 */
export function encodeMuxedAccount(address, id) {
  if (!StrKey.isValidEd25519PublicKey(address)) {
    throw new Error('address should be a Stellar account ID (G...)');
  }
  if (!isString(id)) {
    throw new Error('id should be a string representing a number (uint64)');
  }

  return xdr.MuxedAccount.keyTypeMuxedEd25519(
    new xdr.MuxedAccountMed25519({
      id: xdr.Uint64.fromString(id),
      ed25519: StrKey.decodeEd25519PublicKey(address)
    })
  );
}

/**
 * Extracts the underlying base (G...) address from an M-address.
 * @param  {string} address  a muxed account address (M...)
 * @return {string} a Stellar public key address (G...)
 */
export function extractBaseAddress(address) {
  if (!StrKey.isValidMed25519PublicKey(address)) {
    throw new TypeError('address should be a muxed account (M...)');
  }

  const muxedAccount = decodeAddressToMuxedAccount(address);
  return StrKey.encodeEd25519PublicKey(muxedAccount.med25519().ed25519());
}

// Decodes an "M..." account ID into its MuxedAccount object representation.
function _decodeAddressFullyToMuxedAccount(address) {
  const rawBytes = StrKey.decodeMed25519PublicKey(address);

  // Decoding M... addresses cannot be done through a simple
  // MuxedAccountMed25519.fromXDR() call, because the definition is:
  //
  //    constructor(attributes: { id: Uint64; ed25519: Buffer });
  //
  // Note the ID is the first attribute. However, the ID comes *last* in the
  // stringified (base32-encoded) address itself (it's the last 8-byte suffix).
  // The `fromXDR()` method interprets bytes in order, so we need to parse out
  // the raw binary into its requisite parts, i.e. use the MuxedAccountMed25519
  // constructor directly.
  //
  // Refer to https://github.com/stellar/go/blob/master/xdr/muxed_account.go#L26
  // for the Golang implementation of the M... parsing.
  return xdr.MuxedAccount.keyTypeMuxedEd25519(
    new xdr.MuxedAccountMed25519({
      id: xdr.Uint64.fromXDR(rawBytes.slice(-8)),
      ed25519: rawBytes.slice(0, -8)
    })
  );
}

// Converts an xdr.MuxedAccount into its *true* "M..." string representation.
function _encodeMuxedAccountFullyToAddress(muxedAccount) {
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeEd25519()) {
    return encodeMuxedAccountToAddress(muxedAccount);
  }

  const muxed = muxedAccount.med25519();
  return StrKey.encodeMed25519PublicKey(
    Buffer.concat([muxed.ed25519(), muxed.id().toXDR('raw')])
  );
}
