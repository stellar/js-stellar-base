import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';

/**
 * Converts a Stellar address (in G... or M... form) to an XDR MuxedAccount
 * structure, forcing the ed25519 representation by default.
 *
 * This optionally (that is, opt-in only) supports proper muxed accounts, where
 * an M... address will resolve to both its underlying G... address and an ID.
 * Note that this behaviour will eventually be the default.
 *
 * @function
 *
 * @param   {string}  address    a G... or M... address to encode into XDR
 * @param   {boolean} [supportMuxxing]  allows the muxed representation of the
 *     address, extracting the underlying ID from the M... address
 *
 * @returns {xdr.MuxedAccount}  a muxed account object for this address string
 */
export function decodeAddressToMuxedAccount(address, supportMuxxing) {
  if (address[0] === 'M' && supportMuxxing) {
    return _decodeAddressFullyToMuxedAccount(address);
  }

  return xdr.MuxedAccount.keyTypeEd25519(
    StrKey.decodeEd25519PublicKey(address)
  );
}

/**
 * Converts an xdr.MuxedAccount to its string representation.
 *
 * By default, this returns its "G..." string representation (i.e. forcing the
 * ed25519 representation), but can return the "M..." representation via opt-in.
 *
 * @function
 *
 * @param   {xdr.MuxedAccount} muxedAccount  account to stringify
 * @param   {boolean} [supportMuxxing]  converts the object into its full,
 *     proper M... address, encoding both the underlying G... address and the
 *     muxxing ID
 *
 * @returns {string}  stringified G... (corresponding to the underlying pubkey)
 *     or M... address (corresponding to both the key and the muxed ID)
 */
export function encodeMuxedAccountToAddress(muxedAccount, supportMuxxing) {
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeMuxedEd25519()) {
    if (supportMuxxing) {
      return _encodeMuxedAccountFullyToAddress(muxedAccount);
    }
    muxedAccount = muxedAccount.med25519();
  }
  return StrKey.encodeEd25519PublicKey(muxedAccount.ed25519());
}

/**
 * Decodes an "M..." account ID into its MuxedAccount resolution, with the
 * underlying public key and the muxing ID.
 *
 * @param   {string} address    M... account ID
 * @returns {xdr.MuxedAccount}  resolved muxed account object
 */
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

/**
 * Converts an xdr.MuxedAccount into its *true* "M..." string representation.
 *
 * @param  {xdr.MuxedAccount} muxedAccount  account to stringify
 * @returns {string}  M... address mapping the underlying key and ID
 */
function _encodeMuxedAccountFullyToAddress(muxedAccount) {
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeEd25519()) {
    return encodeMuxedAccountToAddress(muxedAccount);
  }

  const muxed = muxedAccount.med25519();
  return StrKey.encodeMed25519PublicKey(
    Buffer.concat([muxed.ed25519(), muxed.id().toXDR('raw')])
  );
}
