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
 * @constructor
 *
 * @param envelope - transaction envelope
 *     object or base64 encoded string
 * @param networkPassphrase - passphrase of the target stellar
 *     network (e.g. "Public Global Stellar Network ; September 2015")
 *
 * @extends TransactionBase
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
    constructor(envelope: xdr.TransactionEnvelope | string, networkPassphrase: string);
    /**
     * @type {object}
     * @property {string} 64 bit unix timestamp
     * @property {string} 64 bit unix timestamp
     * @readonly
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
     * @type {object}
     * @property {number} minLedger - smallest ledger bound (uint32)
     * @property {number} maxLedger - largest ledger bound (or 0 for inf)
     * @readonly
     */
    get ledgerBounds(): {
        minLedger: number;
        maxLedger: number;
    } | undefined;
    set ledgerBounds(_value: {
        minLedger: number;
        maxLedger: number;
    } | undefined);
    /**
     * 64 bit account sequence
     * @readonly
     * @type {string}
     */
    get minAccountSequence(): string | undefined;
    set minAccountSequence(_value: string | undefined);
    /**
     * 64 bit number of seconds
     * @type {number}
     * @readonly
     */
    get minAccountSequenceAge(): xdr.Uint64 | undefined;
    set minAccountSequenceAge(_value: xdr.Uint64 | undefined);
    /**
     * 32 bit number of ledgers
     * @type {number}
     * @readonly
     */
    get minAccountSequenceLedgerGap(): number | undefined;
    set minAccountSequenceLedgerGap(_value: number | undefined);
    /**
     * array of extra signers as XDR objects; use {@link SignerKey.encodeSignerKey}
     * to convert to StrKey strings
     * @type {xdr.SignerKey[]}
     * @readonly
     */
    get extraSigners(): xdr.SignerKey[] | undefined;
    set extraSigners(_value: xdr.SignerKey[] | undefined);
    /**
     * @type {string}
     * @readonly
     */
    get sequence(): string;
    set sequence(_value: string);
    /**
     * @type {string}
     * @readonly
     */
    get source(): string;
    set source(_value: string);
    /**
     * @type {Array.<xdr.Operation>}
     * @readonly
     */
    get operations(): OperationRecord[];
    set operations(_value: OperationRecord[]);
    /**
     * @type {string}
     * @readonly
     */
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
     * @param opIndex   the index of the CreateClaimableBalance op
     * @returns a hex string representing the claimable balance ID
     *
     * @throws {RangeError}   for invalid `opIndex` value
     * @throws {TypeError}    if op at `opIndex` is not `CreateClaimableBalance`
     * @throws for general XDR un/marshalling failures
     *
     * @see https://github.com/stellar/go/blob/d712346e61e288d450b0c08038c158f8848cc3e4/txnbuild/transaction.go#L392-L435
     *
     */
    getClaimableBalanceId(opIndex: number): string;
}
