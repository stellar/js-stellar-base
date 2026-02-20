import xdr from "./xdr.js";
/**
 * A container class with helpers to convert between signer keys
 * (`xdr.SignerKey`) and {@link StrKey}s.
 *
 * It's primarly used for manipulating the `extraSigners` precondition on a
 * {@link Transaction}.
 *
 * @see {@link TransactionBuilder.setExtraSigners}
 */
export declare class SignerKey {
    /**
     * Decodes a StrKey address into an xdr.SignerKey instance.
     *
     * Only ED25519 public keys (G...), pre-auth transactions (T...), hashes
     * (H...), and signed payloads (P...) can be signer keys.
     *
     * @param   {string} address  a StrKey-encoded signer address
     * @returns {xdr.SignerKey}
     */
    static decodeAddress(address: string): xdr.SignerKey;
    /**
     * Encodes a signer key into its StrKey equivalent.
     *
     * @param   {xdr.SignerKey} signerKey   the signer
     * @returns {string} the StrKey representation of the signer
     */
    static encodeSignerKey(signerKey: xdr.SignerKey): string;
}
