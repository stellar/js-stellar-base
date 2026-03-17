import xdr from "./xdr.js";
import { Transaction } from "./transaction.js";
import { TransactionBase } from "./transaction_base.js";
/**
 * Use {@link TransactionBuilder.buildFeeBumpTransaction} to build a
 * FeeBumpTransaction object. If you have an object or base64-encoded string of
 * the transaction envelope XDR use {@link TransactionBuilder.fromXDR}.
 *
 * Once a {@link FeeBumpTransaction} has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link FeeBumpTransaction#sign}) before
 * submitting to the network or forwarding on to additional signers.
 */
export declare class FeeBumpTransaction extends TransactionBase<xdr.FeeBumpTransaction> {
    _feeSource: string;
    _innerTransaction: Transaction;
    /**
     * @param envelope - transaction envelope object or base64 encoded string.
     * @param networkPassphrase - passphrase of the target Stellar network
     *     (e.g. "Public Global Stellar Network ; September 2015").
     */
    constructor(envelope: xdr.TransactionEnvelope | string, networkPassphrase: string);
    /**
     * The inner transaction that this fee bump wraps.
     */
    get innerTransaction(): Transaction;
    /**
     * The operations from the inner transaction.
     */
    get operations(): import("./operations/types.js").OperationRecord[];
    /**
     * The account paying the fee for this transaction.
     */
    get feeSource(): string;
    /**
     * Returns the "signature base" of this transaction, which is the value
     * that, when hashed, should be signed to create a signature that
     * validators on the Stellar Network will accept.
     *
     * It is composed of a 4 prefix bytes followed by the xdr-encoded form
     * of this transaction.
     */
    signatureBase(): Buffer;
    /**
     * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
     */
    toEnvelope(): xdr.TransactionEnvelope;
}
