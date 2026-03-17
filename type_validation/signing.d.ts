/**
 * Derives an Ed25519 public key from a secret key.
 *
 * @param secretKey - the raw Ed25519 secret key
 */
export declare function generate(secretKey: Buffer | Uint8Array): Buffer;
/**
 * Signs data using an Ed25519 secret key.
 *
 * @param data - the data to sign
 * @param rawSecret - the raw Ed25519 secret key
 */
export declare function sign(data: Buffer, rawSecret: Buffer | Uint8Array): Buffer;
/**
 * Verifies an Ed25519 signature against the given data and public key.
 *
 * @param data - the original signed data
 * @param signature - the signature to verify
 * @param rawPublicKey - the raw Ed25519 public key
 */
export declare function verify(data: Buffer, signature: Buffer, rawPublicKey: Buffer | Uint8Array): boolean;
