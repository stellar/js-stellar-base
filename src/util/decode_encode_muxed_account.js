import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';

/**
 * Returns a XDR.MuxedAccount forcing the ed25519 discriminant.
 * @function
 * @param {string} address address to encode to XDR.
 * @returns {xdr.MuxedAccount} MuxedAccount with ed25519 discriminant.
 */
export function decodeAddressToMuxedAccount(address) {
  return xdr.MuxedAccount.keyTypeEd25519(
    StrKey.decodeEd25519PublicKey(address)
  );
}

/**
 * Converts an xdr.MuxedAccount to its string representation, forcing the ed25519 representation.
 * @function
 * @param {xdr.MuxedAccount} muxedAccount .
 * @returns {string} address
 */
export function encodeMuxedAccountToAddress(muxedAccount) {
  let ed25519;
  if (muxedAccount.switch() === xdr.CryptoKeyType.keyTypeEd25519()) {
    ed25519 = muxedAccount.ed25519();
  } else {
    ed25519 = muxedAccount.med25519().ed25519();
  }

  return StrKey.encodeEd25519PublicKey(ed25519);
}
