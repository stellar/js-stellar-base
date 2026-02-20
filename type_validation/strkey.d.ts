type VersionByteName = "ed25519PublicKey" | "ed25519SecretSeed" | "med25519PublicKey" | "preAuthTx" | "sha256Hash" | "signedPayload" | "contract" | "liquidityPool" | "claimableBalance";
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
     * @param   {Buffer} data   raw data to encode
     * @returns {string}        "G..." representation of the key
     */
    static encodeEd25519PublicKey(data: Buffer): string;
    /**
     * Decodes strkey ed25519 public key to raw data.
     *
     * If the parameter is a muxed account key ("M..."), this will only encode it
     * as a basic Ed25519 key (as if in "G..." format).
     *
     * @param   {string} data   "G..." (or "M...") key representation to decode
     * @returns {Buffer}        raw key
     */
    static decodeEd25519PublicKey(data: string): Buffer;
    /**
     * Returns true if the given Stellar public key is a valid ed25519 public key.
     * @param {string} publicKey public key to check
     * @returns {boolean}
     */
    static isValidEd25519PublicKey(publicKey: string): boolean;
    /**
     * Encodes data to strkey ed25519 seed.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeEd25519SecretSeed(data: Buffer): string;
    /**
     * Decodes strkey ed25519 seed to raw data.
     * @param {string} address data to decode
     * @returns {Buffer}
     */
    static decodeEd25519SecretSeed(address: string): Buffer;
    /**
     * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
     * @param {string} seed seed to check
     * @returns {boolean}
     */
    static isValidEd25519SecretSeed(seed: string): boolean;
    /**
     * Encodes data to strkey med25519 public key.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeMed25519PublicKey(data: Buffer): string;
    /**
     * Decodes strkey med25519 public key to raw data.
     * @param {string} address data to decode
     * @returns {Buffer}
     */
    static decodeMed25519PublicKey(address: string): Buffer;
    /**
     * Returns true if the given Stellar public key is a valid med25519 public key.
     * @param {string} publicKey public key to check
     * @returns {boolean}
     */
    static isValidMed25519PublicKey(publicKey: string): boolean;
    /**
     * Encodes data to strkey preAuthTx.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodePreAuthTx(data: Buffer): string;
    /**
     * Decodes strkey PreAuthTx to raw data.
     * @param {string} address data to decode
     * @returns {Buffer}
     */
    static decodePreAuthTx(address: string): Buffer;
    /**
     * Encodes data to strkey sha256 hash.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeSha256Hash(data: Buffer): string;
    /**
     * Decodes strkey sha256 hash to raw data.
     * @param {string} address data to decode
     * @returns {Buffer}
     */
    static decodeSha256Hash(address: string): Buffer;
    /**
     * Encodes raw data to strkey signed payload (P...).
     * @param   {Buffer} data  data to encode
     * @returns {string}
     */
    static encodeSignedPayload(data: Buffer): string;
    /**
     * Decodes strkey signed payload (P...) to raw data.
     * @param   {string} address  address to decode
     * @returns {Buffer}
     */
    static decodeSignedPayload(address: string): Buffer;
    /**
     * Checks validity of alleged signed payload (P...) strkey address.
     * @param   {string} address  signer key to check
     * @returns {boolean}
     */
    static isValidSignedPayload(address: string): boolean;
    /**
     * Encodes raw data to strkey contract (C...).
     * @param   {Buffer} data  data to encode
     * @returns {string}
     */
    static encodeContract(data: Buffer): string;
    /**
     * Decodes strkey contract (C...) to raw data.
     * @param   {string} address  address to decode
     * @returns {Buffer}
     */
    static decodeContract(address: string): Buffer;
    /**
     * Checks validity of alleged contract (C...) strkey address.
     * @param   {string} address  signer key to check
     * @returns {boolean}
     */
    static isValidContract(address: string): boolean;
    /**
     * Encodes raw data to strkey claimable balance (B...).
     * @param   {Buffer} data  data to encode
     * @returns {string}
     */
    static encodeClaimableBalance(data: Buffer): string;
    /**
     * Decodes strkey contract (B...) to raw data.
     * @param   {string} address  balance to decode
     * @returns {Buffer}
     */
    static decodeClaimableBalance(address: string): Buffer;
    /**
     * Checks validity of alleged claimable balance (B...) strkey address.
     * @param   {string} address  balance to check
     * @returns {boolean}
     */
    static isValidClaimableBalance(address: string): boolean;
    /**
     * Encodes raw data to strkey liquidity pool (L...).
     * @param   {Buffer} data  data to encode
     * @returns {string}
     */
    static encodeLiquidityPool(data: Buffer): string;
    /**
     * Decodes strkey liquidity pool (L...) to raw data.
     * @param   {string} address  address to decode
     * @returns {Buffer}
     */
    static decodeLiquidityPool(address: string): Buffer;
    /**
     * Checks validity of alleged liquidity pool (L...) strkey address.
     * @param   {string} address  pool to check
     * @returns {boolean}
     */
    static isValidLiquidityPool(address: string): boolean;
    /**
     * Returns the strkey type based on the prefix of the given strkey address.
     * @param address The strkey address to check
     * @returns The strkey type or undefined if the prefix is invalid
     */
    static getVersionByteForPrefix(address: string): VersionByteName | undefined;
}
export declare function decodeCheck(versionByteName: string, encoded: string): Buffer;
export declare function encodeCheck(versionByteName: string, data: Buffer): string;
export {};
