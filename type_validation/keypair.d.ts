import xdr from "./xdr.js";
/**
 * `Keypair` represents public (and secret) keys of the account.
 *
 * Currently `Keypair` only supports ed25519 but in a future this class can be abstraction layer for other
 * public-key signature systems.
 *
 * Use more convenient methods to create `Keypair` object:
 * * `{@link Keypair.fromPublicKey}`
 * * `{@link Keypair.fromSecret}`
 * * `{@link Keypair.random}`
 *
 * @constructor
 * @param keys At least one of keys must be provided.
 * @param keys.type Public-key signature system name. (currently only `ed25519` keys are supported)
 * @param [keys.publicKey] Raw public key
 * @param [keys.secretKey] Raw secret key (32-byte secret seed in ed25519`)
 */
export declare class Keypair {
    readonly type: string;
    private _publicKey;
    private _secretSeed?;
    private _secretKey?;
    constructor(keys: {
        type: string;
        publicKey?: Buffer;
        secretKey?: Buffer;
    });
    /**
     * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
     * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
     * @param secret secret key (ex. `SDAK....`)
     */
    static fromSecret(secret: string): Keypair;
    /**
     * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
     *
     * @param rawSeed Raw 32-byte ed25519 secret key seed
     */
    static fromRawEd25519Seed(rawSeed: Buffer): Keypair;
    /**
     * Returns `Keypair` object representing network master key.
     * @param networkPassphrase passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
     */
    static master(networkPassphrase: string): Keypair;
    /**
     * Creates a new `Keypair` object from public key.
     * @param publicKey public key (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
     */
    static fromPublicKey(publicKey: string): Keypair;
    /**
     * Create a random `Keypair` object.
     */
    static random(): Keypair;
    xdrAccountId(): xdr.AccountId;
    xdrPublicKey(): xdr.PublicKey;
    /**
     * Creates a {@link xdr.MuxedAccount} object from the public key.
     *
     * You will get a different type of muxed account depending on whether or not
     * you pass an ID.
     *
     * @param [id] - stringified integer indicating the underlying muxed
     *     ID of the new account object
     */
    xdrMuxedAccount(id?: string): xdr.MuxedAccount;
    /**
     * Returns raw public key bytes
     */
    rawPublicKey(): Buffer;
    /**
     * Returns the signature hint for this keypair.
     * The hint is the last 4 bytes of the account ID XDR representation.
     */
    signatureHint(): Buffer;
    /**
     * Returns public key associated with this `Keypair` object.
     */
    publicKey(): string;
    /**
     * Returns secret key associated with this `Keypair` object
     * @returns Secret key encoded in Stellar format (e.g., `SDAK....`)
     * @throws {Error} Throws if no secret key is available
     */
    secret(): string;
    /**
     * Returns raw secret key bytes.
     * @throws {Error} Throws if no secret seed is available
     */
    rawSecretKey(): Buffer;
    /**
     * Returns `true` if this `Keypair` object contains secret key and can sign.
     */
    canSign(): boolean;
    /**
     * Signs data.
     * @param data Data to sign
     * @throws {Error} Throws if no secret key is available
     */
    sign(data: Buffer): Buffer;
    /**
     * Verifies if `signature` for `data` is valid.
     * @param data Signed data
     * @param signature Signature
     */
    verify(data: Buffer, signature: Buffer): boolean;
    /**
     * Returns the decorated signature (hint+sig) for arbitrary data.
     *
     * @param  data  arbitrary data to sign
     * @return the raw signature structure which can be added directly to a transaction envelope
     *
     * @see TransactionBase.addDecoratedSignature
     */
    signDecorated(data: Buffer): xdr.DecoratedSignature;
    /**
     * Returns the raw decorated signature (hint+sig) for a signed payload signer.
     *
     *  The hint is defined as the last 4 bytes of the signer key XORed with last
     *  4 bytes of the payload (zero-left-padded if necessary).
     *
     * @param data data to both sign and treat as the payload
     *
     * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0040.md#signature-hint
     * @see TransactionBase.addDecoratedSignature
     */
    signPayloadDecorated(data: Buffer): xdr.DecoratedSignature;
}
