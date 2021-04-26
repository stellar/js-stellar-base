import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';

/**
 * Returns a XDR.MuxedAccount forcing the ed25519 discriminant.
 * @function
 * @param   {string} address    address to encode to XDR.
 * @returns {xdr.MuxedAccount}  MuxedAccount with ed25519 discriminant.
 */
export function decodeAddressToMuxedAccount(address, dontForceDiscriminant) {
  if (address[0] === 'M' && dontForceDiscriminant) {
    return decodeAddressToProperMuxedAccount(address);
  }

  return xdr.MuxedAccount.keyTypeEd25519(
    StrKey.decodeEd25519PublicKey(address)
  );
}

/**
 * Decodes an "M..." account ID into its MuxedAccount resolution, with the
 * underlying public key and the muxing ID.
 *
 * @param   {string} address    M... account ID
 * @returns {xdr.MuxedAccount}  resolved muxed account object
 */
export function decodeAddressToProperMuxedAccount(address) {
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
 * Converts an xdr.MuxedAccount to its "G..." string representation (i.e.
 * forcing the ed25519 representation).
 *
 * @function
 * @param   {xdr.MuxedAccount} muxedAccount  account to stringify
 * @returns {string}  G... address corresponding to the underlying pubkey
 */
export function encodeMuxedAccountToAddress(
  muxedAccount,
  dontForceDiscriminant
) {
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeMuxedEd25519()) {
    if (dontForceDiscriminant) {
      return encodeMuxedAccountToProperAddress(muxedAccount);
    }
    muxedAccount = muxedAccount.med25519();
  }
  return StrKey.encodeEd25519PublicKey(muxedAccount.ed25519());
}

/**
 * Converts an xdr.MuxedAccount into its *true* "M..." string representation.
 *
 * @param  {xdr.MuxedAccount} muxedAccount  account to stringify
 * @returns {string}  M... address mapping the underlying key and ID
 */
export function encodeMuxedAccountToProperAddress(muxedAccount) {
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeEd25519()) {
    return encodeMuxedAccountToAddress(muxedAccount);
  }

  const muxed = muxedAccount.med25519();
  return StrKey.encodeMed25519PublicKey(
    Buffer.concat([muxed.ed25519(), muxed.id().toXDR('raw')])
  );
}
