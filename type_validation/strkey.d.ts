type VersionByteName = "claimableBalance" | "contract" | "ed25519PublicKey" | "ed25519SecretSeed" | "liquidityPool" | "med25519PublicKey" | "preAuthTx" | "sha256Hash" | "signedPayload";
/**
 * StrKey is a helper class that allows encoding and decoding Stellar keys
 * to/from strings, i.e. between their binary (Buffer, xdr.PublicKey, etc.) and
 * string (i.e. "GABCD...", etc.) representations.
 */
export declare class StrKey {
    static types: Record<string, VersionByteName>;
    /**
     * Encodes `data` to strkey ed25519 public key.
     *
     * @param data - raw data to encode
     */
    static encodeEd25519PublicKey(data: Buffer): string;
    /**
     * Decodes strkey ed25519 public key to raw data.
     *
     * If the parameter is a muxed account key ("M..."), this will only encode it
     * as a basic Ed25519 key (as if in "G..." format).
     *
     * @param data - "G..." (or "M...") key representation to decode
     */
    static decodeEd25519PublicKey(data: string): Buffer;
    /**
     * Returns true if the given Stellar public key is a valid ed25519 public key.
     *
     * @param publicKey - public key to check
     */
    static isValidEd25519PublicKey(publicKey: string): boolean;
    /**
     * Encodes data to strkey ed25519 seed.
     *
     * @param data - data to encode
     */
    static encodeEd25519SecretSeed(data: Buffer): string;
    /**
     * Decodes strkey ed25519 seed to raw data.
     *
     * @param address - data to decode
     */
    static decodeEd25519SecretSeed(address: string): Buffer;
    /**
     * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
     *
     * @param seed - seed to check
     */
    static isValidEd25519SecretSeed(seed: string): boolean;
    /**
     * Encodes data to strkey med25519 public key.
     *
     * @param data - data to encode
     */
    static encodeMed25519PublicKey(data: Buffer): string;
    /**
     * Decodes strkey med25519 public key to raw data.
     *
     * @param address - data to decode
     */
    static decodeMed25519PublicKey(address: string): Buffer;
    /**
     * Returns true if the given Stellar public key is a valid med25519 public key.
     *
     * @param publicKey - public key to check
     */
    static isValidMed25519PublicKey(publicKey: string): boolean;
    /**
     * Encodes data to strkey preAuthTx.
     *
     * @param data - data to encode
     */
    static encodePreAuthTx(data: Buffer): string;
    /**
     * Decodes strkey PreAuthTx to raw data.
     *
     * @param address - data to decode
     */
    static decodePreAuthTx(address: string): Buffer;
    /**
     * Encodes data to strkey sha256 hash.
     *
     * @param data - data to encode
     */
    static encodeSha256Hash(data: Buffer): string;
    /**
     * Decodes strkey sha256 hash to raw data.
     *
     * @param address - data to decode
     */
    static decodeSha256Hash(address: string): Buffer;
    /**
     * Encodes raw data to strkey signed payload (P...).
     *
     * @param data - data to encode
     */
    static encodeSignedPayload(data: Buffer): string;
    /**
     * Decodes strkey signed payload (P...) to raw data.
     *
     * @param address - address to decode
     */
    static decodeSignedPayload(address: string): Buffer;
    /**
     * Checks validity of alleged signed payload (P...) strkey address.
     *
     * @param address - signer key to check
     */
    static isValidSignedPayload(address: string): boolean;
    /**
     * Encodes raw data to strkey contract (C...).
     *
     * @param data - data to encode
     */
    static encodeContract(data: Buffer): string;
    /**
     * Decodes strkey contract (C...) to raw data.
     *
     * @param address - address to decode
     */
    static decodeContract(address: string): Buffer;
    /**
     * Checks validity of alleged contract (C...) strkey address.
     *
     * @param address - signer key to check
     */
    static isValidContract(address: string): boolean;
    /**
     * Encodes raw data to strkey claimable balance (B...).
     *
     * @param data - data to encode
     */
    static encodeClaimableBalance(data: Buffer): string;
    /**
     * Decodes strkey claimable balance (B...) to raw data.
     *
     * @param address - balance to decode
     */
    static decodeClaimableBalance(address: string): Buffer;
    /**
     * Checks validity of alleged claimable balance (B...) strkey address.
     *
     * @param address - balance to check
     */
    static isValidClaimableBalance(address: string): boolean;
    /**
     * Encodes raw data to strkey liquidity pool (L...).
     *
     * @param data - data to encode
     */
    static encodeLiquidityPool(data: Buffer): string;
    /**
     * Decodes strkey liquidity pool (L...) to raw data.
     *
     * @param address - address to decode
     */
    static decodeLiquidityPool(address: string): Buffer;
    /**
     * Checks validity of alleged liquidity pool (L...) strkey address.
     *
     * @param address - pool to check
     */
    static isValidLiquidityPool(address: string): boolean;
    /**
     * Returns the strkey type based on the prefix of the given strkey address,
     * or undefined if the prefix is invalid.
     *
     * @param address - the strkey address to check
     */
    static getVersionByteForPrefix(address: string): VersionByteName | undefined;
}
/**
 * Decodes and validates a strkey-encoded string, verifying the version byte
 * and checksum.
 *
 * @param versionByteName - the expected strkey type
 * @param encoded - the strkey-encoded string to decode
 */
export declare function decodeCheck(versionByteName: string, encoded: string): Buffer;
/**
 * Encodes raw data into a strkey-encoded string with a version byte and
 * CRC16 checksum.
 *
 * @param versionByteName - the strkey type to encode as
 * @param data - the raw data to encode
 */
export declare function encodeCheck(versionByteName: string, data: Buffer): string;
export {};
