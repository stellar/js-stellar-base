import xdr from "./xdr.js";
import { Memo } from "./memo.js";
import { TransactionBase } from "./transaction_base.js";
import { OperationRecord } from "./operations/types.js";
/**
 * Use {@link TransactionBuilder} to build a transaction object. If you have an
 * object or base64-encoded string of the transaction envelope XDR, use {@link
 * TransactionBuilder.fromXDR}.
 *
 * Once a Transaction has been created, its attributes and operations should not
 * be changed. You should only add signatures (using {@link Transaction#sign})
 * to a Transaction object before submitting to the network or forwarding on to
 * additional signers.
 *
 */
export declare class Transaction extends TransactionBase<xdr.Transaction | xdr.TransactionV0> {
    _envelopeType: xdr.EnvelopeType;
    _source: string;
    _memo: xdr.Memo;
    _sequence: string;
    _operations: OperationRecord[];
    _timeBounds?: {
        minTime: string;
        maxTime: string;
    };
    _ledgerBounds?: {
        minLedger: number;
        maxLedger: number;
    };
    _minAccountSequence?: string;
    _minAccountSequenceAge?: xdr.Uint64;
    _minAccountSequenceLedgerGap?: number;
    _extraSigners?: xdr.SignerKey[];
    /**
     * @param envelope - transaction envelope object or base64 encoded string
     * @param networkPassphrase - passphrase of the target stellar network
     *     (e.g. "Public Global Stellar Network ; September 2015")
     */
    constructor(envelope: xdr.TransactionEnvelope | string, networkPassphrase: string);
    /**
     * The time bounds for this transaction, with `minTime` and `maxTime` as
     * 64-bit unix timestamps (strings).
     */
    get timeBounds(): {
        minTime: string;
        maxTime: string;
    } | undefined;
    set timeBounds(_value: {
        minTime: string;
        maxTime: string;
    } | undefined);
    /**
     * The ledger bounds for this transaction, with `minLedger` (uint32) and
     * `maxLedger` (uint32, or 0 for no upper bound).
     */
    get ledgerBounds(): {
        minLedger: number;
        maxLedger: number;
    } | undefined;
    set ledgerBounds(_value: {
        minLedger: number;
        maxLedger: number;
    } | undefined);
    /** The minimum account sequence (64-bit, as a string). */
    get minAccountSequence(): string | undefined;
    set minAccountSequence(_value: string | undefined);
    /** The minimum account sequence age (64-bit number of seconds). */
    get minAccountSequenceAge(): xdr.Uint64 | undefined;
    set minAccountSequenceAge(_value: xdr.Uint64 | undefined);
    /** The minimum account sequence ledger gap (32-bit number of ledgers). */
    get minAccountSequenceLedgerGap(): number | undefined;
    set minAccountSequenceLedgerGap(_value: number | undefined);
    /**
     * Array of extra signers as XDR objects; use {@link SignerKey.encodeSignerKey}
     * to convert to StrKey strings.
     */
    get extraSigners(): xdr.SignerKey[] | undefined;
    set extraSigners(_value: xdr.SignerKey[] | undefined);
    /** The sequence number for this transaction. */
    get sequence(): string;
    set sequence(_value: string);
    /** The source account for this transaction. */
    get source(): string;
    set source(_value: string);
    /** The list of operations in this transaction. */
    get operations(): OperationRecord[];
    set operations(_value: OperationRecord[]);
    /** The memo attached to this transaction. */
    get memo(): Memo<import("./memo.js").MemoType>;
    set memo(_value: Memo<import("./memo.js").MemoType>);
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
    /**
     * Calculate the claimable balance ID for an operation within the transaction.
     *
     * @param opIndex - the index of the CreateClaimableBalance op
     *
     * @throws for invalid `opIndex` value, if op at `opIndex` is not
     *    `CreateClaimableBalance`, or for general XDR un/marshalling failures
     *
     * @see https://github.com/stellar/go/blob/d712346e61e288d450b0c08038c158f8848cc3e4/txnbuild/transaction.go#L392-L435
     *
     */
    getClaimableBalanceId(opIndex: number): string;
}
