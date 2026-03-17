import xdr from "./xdr.js";
import { Keypair } from "./keypair.js";
/**
 * @ignore
 */
export declare class TransactionBase<TTx extends xdr.FeeBumpTransaction | xdr.Transaction | xdr.TransactionV0> {
    _tx: TTx;
    _signatures: xdr.DecoratedSignature[];
    _fee: string;
    _networkPassphrase: string;
    constructor(tx: TTx, signatures: xdr.DecoratedSignature[], fee: string, networkPassphrase: string);
    /** The list of signatures for this transaction. */
    get signatures(): xdr.DecoratedSignature[];
    set signatures(_value: xdr.DecoratedSignature[]);
    /** The underlying XDR transaction object. */
    get tx(): TTx;
    set tx(_value: TTx);
    /** The total fee for this transaction, in stroops. */
    get fee(): string;
    set fee(_value: string);
    /** The network passphrase for this transaction. */
    get networkPassphrase(): string;
    set networkPassphrase(_networkPassphrase: string);
    /**
     * Signs the transaction with the given {@link Keypair}.
     * @param keypairs - Keypairs of signers
     */
    sign(...keypairs: Keypair[]): void;
    /**
     * Signs a transaction with the given {@link Keypair}. Useful if someone sends
     * you a transaction XDR for you to sign and return (see
     * [addSignature](#addSignature) for more information).
     *
     * When you get a transaction XDR to sign....
     * - Instantiate a `Transaction` object with the XDR
     * - Use {@link Keypair} to generate a keypair object for your Stellar seed.
     * - Run `getKeypairSignature` with that keypair
     * - Send back the signature along with your publicKey (not your secret seed!)
     *
     * Example:
     * ```javascript
     * // `transactionXDR` is a string from the person generating the transaction
     * const transaction = new Transaction(transactionXDR, networkPassphrase);
     * const keypair = Keypair.fromSecret(myStellarSeed);
     * return transaction.getKeypairSignature(keypair);
     * ```
     *
     * Returns the base64-encoded signature string for the given keypair.
     *
     * @param keypair - Keypair of signer
     */
    getKeypairSignature(keypair: Keypair): string;
    /**
     * Add a signature to the transaction. Useful when a party wants to pre-sign
     * a transaction but doesn't want to give access to their secret keys.
     * This will also verify whether the signature is valid.
     *
     * Here's how you would use this feature to solicit multiple signatures.
     * - Use `TransactionBuilder` to build a new transaction.
     * - Make sure to set a long enough timeout on that transaction to give your
     * signers enough time to sign!
     * - Once you build the transaction, use `transaction.toXDR()` to get the
     * base64-encoded XDR string.
     * - _Warning!_ Once you've built this transaction, don't submit any other
     * transactions onto your account! Doing so will invalidate this pre-compiled
     * transaction!
     * - Send this XDR string to your other parties. They can use the instructions
     * for [getKeypairSignature](#getKeypairSignature) to sign the transaction.
     * - They should send you back their `publicKey` and the `signature` string
     * from [getKeypairSignature](#getKeypairSignature), both of which you pass to
     * this function.
     *
     * @param publicKey - the public key of the signer
     * @param signature - the base64 value of the signature XDR
     */
    addSignature(publicKey?: string, signature?: string): void;
    /**
     * Add a decorated signature directly to the transaction envelope.
     *
     * @param signature - raw signature to add
     *
     * @see Keypair.signDecorated
     * @see Keypair.signPayloadDecorated
     */
    addDecoratedSignature(signature: xdr.DecoratedSignature): void;
    /**
     * Add `hashX` signer preimage as signature.
     * @param preimage - preimage of hash used as signer
     */
    signHashX(preimage: Buffer | string): void;
    /**
     * Returns a hash for this transaction, suitable for signing.
     */
    hash(): Buffer;
    /** Returns the signature base for this transaction, to be overridden by subclasses. */
    signatureBase(): Buffer;
    /** Returns the XDR transaction envelope, to be overridden by subclasses. */
    toEnvelope(): xdr.TransactionEnvelope;
    /**
     * Returns the transaction envelope as a base64-encoded XDR string.
     */
    toXDR(): string;
}
