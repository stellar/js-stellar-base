import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';

/**
 * Returns a XDR.MuxedAccount forcing the ed25519 discriminant.
 * @function
 * @param {string} address address to encode to XDR.
 * @returns {xdr.MuxedAccount} MuxedAccount with ed25519 discriminant.
 */
export function decodeAddress(address) {
  return xdr.MuxedAccount.keyTypeEd25519(
    StrKey.decodeEd25519PublicKey(address)
  );
}
