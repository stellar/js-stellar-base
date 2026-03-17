import xdr from "./xdr.js";
import { Account } from "./account.js";
import { MuxedAccount } from "./muxed_account.js";
import { Transaction } from "./transaction.js";
import { FeeBumpTransaction } from "./fee_bump_transaction.js";
import { Memo } from "./memo.js";
import { Asset } from "./asset.js";
import { Keypair } from "./keypair.js";
/**
 * Minimum base fee for transactions. If this fee is below the network
 * minimum, the transaction will fail. The more operations in the
 * transaction, the greater the required fee. Use {@link
 * Server#fetchBaseFee} to get an accurate value of minimum transaction
 * fee on the network.
 *
 * @see [Fees](https://developers.stellar.org/docs/glossary/fees/)
 */
export declare const BASE_FEE = "100";
/**
 * @see {@link TransactionBuilder#setTimeout}
 * @see [Timeout](https://developers.stellar.org/api/resources/transactions/post/)
 */
export declare const TimeoutInfinite = 0;
/**
 * Soroban fee parameters for resource-limited transactions.
 */
export interface SorobanFees {
    /** The number of instructions executed by the transaction. */
    instructions: number;
    /** The number of bytes read from the ledger by the transaction. */
    readBytes: number;
    /** The number of bytes written to the ledger by the transaction. */
    writeBytes: number;
    /** The fee to be paid for the transaction, in stroops. */
    resourceFee: bigint;
}
/**
 * Options for constructing a {@link TransactionBuilder}.
 */
export interface TransactionBuilderOptions {
    /** Max fee you're willing to pay per operation in this transaction (**in stroops**). */
    fee: string;
    /** Memo for the transaction. */
    memo?: Memo;
    /**
     * Passphrase of the target Stellar network (e.g. "Public Global Stellar
     * Network ; September 2015" for the pubnet).
     */
    networkPassphrase?: string;
    /** Timebounds for the validity of this transaction. */
    timebounds?: {
        /** 64-bit UNIX timestamp or Date object. */
        minTime?: Date | number | string;
        /** 64-bit UNIX timestamp or Date object. */
        maxTime?: Date | number | string;
    };
    /** Ledger bounds for the validity of this transaction. */
    ledgerbounds?: {
        /** Number of the minimum ledger sequence. */
        minLedger?: number;
        /** Number of the maximum ledger sequence. */
        maxLedger?: number;
    };
    /** Minimum source account sequence number this transaction is valid for. */
    minAccountSequence?: string;
    /** Minimum seconds between source account sequence time and ledger time. */
    minAccountSequenceAge?: number;
    /** Minimum ledgers between source account sequence and current ledger. */
    minAccountSequenceLedgerGap?: number;
    /** List of extra signers required for this transaction. */
    extraSigners?: string[];
    /**
     * An instance of {@link xdr.SorobanTransactionData} or a base64 string.
     * Provides resource estimations for Soroban transactions. Has no effect on
     * non-contract transactions.
     */
    sorobanData?: xdr.SorobanTransactionData | string;
}
/**
 * <p>Transaction builder helps constructs a new `{@link Transaction}` using the
 * given {@link Account} as the transaction's "source account". The transaction
 * will use the current sequence number of the given account as its sequence
 * number and increment the given account's sequence number by one. The given
 * source account must include a private key for signing the transaction or an
 * error will be thrown.</p>
 *
 * <p>Operations can be added to the transaction via their corresponding builder
 * methods, and each returns the TransactionBuilder object so they can be
 * chained together. After adding the desired operations, call the `build()`
 * method on the `TransactionBuilder` to return a fully constructed `{@link
 * Transaction}` that can be signed. The returned transaction will contain the
 * sequence number of the source account and include the signature from the
 * source account.</p>
 *
 * <p><strong>Be careful about unsubmitted transactions!</strong> When you build
 * a transaction, `stellar-sdk` automatically increments the source account's
 * sequence number. If you end up not submitting this transaction and submitting
 * another one instead, it'll fail due to the sequence number being wrong. So if
 * you decide not to use a built transaction, make sure to update the source
 * account's sequence number with
 * [Server.loadAccount](https://stellar.github.io/js-stellar-sdk/Server.html#loadAccount)
 * before creating another transaction.</p>
 *
 * <p>The following code example creates a new transaction with {@link
 * Operation.createAccount} and {@link Operation.payment} operations. The
 * Transaction's source account first funds `destinationA`, then sends a payment
 * to `destinationB`. The built transaction is then signed by
 * `sourceKeypair`.</p>
 *
 * ```
 * var transaction = new TransactionBuilder(source, { fee, networkPassphrase: Networks.TESTNET })
 * .addOperation(Operation.createAccount({
 *     destination: destinationA,
 *     startingBalance: "20"
 * })) // <- funds and creates destinationA
 * .addOperation(Operation.payment({
 *     destination: destinationB,
 *     amount: "100",
 *     asset: Asset.native()
 * })) // <- sends 100 XLM to destinationB
 * .setTimeout(30)
 * .build();
 *
 * transaction.sign(sourceKeypair);
 * ```
 *
 */
export declare class TransactionBuilder {
    source: Account | MuxedAccount;
    operations: xdr.Operation[];
    baseFee: string;
    timebounds: {
        minTime?: Date | number | string;
        maxTime?: Date | number | string;
    } | null;
    ledgerbounds: {
        minLedger?: number;
        maxLedger?: number;
    } | null;
    minAccountSequence: string | null;
    minAccountSequenceAge: number | null;
    minAccountSequenceLedgerGap: number | null;
    extraSigners: string[] | null;
    memo: Memo;
    networkPassphrase: string | null;
    sorobanData: xdr.SorobanTransactionData | null;
    /**
     * @param sourceAccount - source account for this transaction
     * @param opts - options object (see {@link TransactionBuilderOptions})
     */
    constructor(sourceAccount: Account | MuxedAccount, opts?: TransactionBuilderOptions);
    /**
     * Creates a builder instance using an existing {@link Transaction} as a
     * template, ignoring any existing envelope signatures.
     *
     * Note that the sequence number WILL be cloned, so EITHER this transaction or
     * the one it was cloned from will be valid. This is useful in situations
     * where you are constructing a transaction in pieces and need to make
     * adjustments as you go (for example, when filling out Soroban resource
     * information).
     *
     * @param tx - a "template" transaction to clone exactly
     * @param opts - additional options to override the clone, e.g.
     *    {fee: '1000'} will override the existing base fee derived from `tx` (see
     *    the {@link TransactionBuilder} constructor for detailed options)
     *
     * @warning This does not clone the transaction's
     *    {@link xdr.SorobanTransactionData} (if applicable), use
     *    {@link SorobanDataBuilder} and {@link TransactionBuilder.setSorobanData}
     *    as needed, instead..
     *
     * @todo This cannot clone {@link FeeBumpTransaction}s, yet.
     */
    static cloneFrom(tx: Transaction, opts?: Partial<TransactionBuilderOptions>): TransactionBuilder;
    /**
     * Adds an operation to the transaction.
     *
     * @param operation - The xdr operation object, use {@link
     *     Operation} static methods.
     */
    addOperation(operation: xdr.Operation): TransactionBuilder;
    /**
     * Adds an operation to the transaction at a specific index.
     *
     * @param operation - The xdr operation object to add, use {@link Operation} static methods.
     * @param index - The index at which to insert the operation.
     */
    addOperationAt(operation: xdr.Operation, index: number): TransactionBuilder;
    /**
     * Removes the operations from the builder (useful when cloning).
     */
    clearOperations(): TransactionBuilder;
    /**
     * Removes the operation at the specified index from the transaction.
     *
     * @param index - The index of the operation to remove.
     */
    clearOperationAt(index: number): TransactionBuilder;
    /**
     * Adds a memo to the transaction.
     * @param memo - {@link Memo} object
     */
    addMemo(memo: Memo): TransactionBuilder;
    /**
     * Sets a timeout precondition on the transaction.
     *
     *  Because of the distributed nature of the Stellar network it is possible
     *  that the status of your transaction will be determined after a long time
     *  if the network is highly congested. If you want to be sure to receive the
     *  status of the transaction within a given period you should set the {@link
     *  TimeBounds} with `maxTime` on the transaction (this is what `setTimeout`
     *  does internally; if there's `minTime` set but no `maxTime` it will be
     *  added).
     *
     *  A call to `TransactionBuilder.setTimeout` is **required** if Transaction
     *  does not have `max_time` set. If you don't want to set timeout, use
     *  `{@link TimeoutInfinite}`. In general you should set `{@link
     *  TimeoutInfinite}` only in smart contracts.
     *
     *  Please note that Horizon may still return <code>504 Gateway Timeout</code>
     *  error, even for short timeouts. In such case you need to resubmit the same
     *  transaction again without making any changes to receive a status. This
     *  method is using the machine system time (UTC), make sure it is set
     *  correctly.
     *
     * @param timeoutSeconds - Number of seconds the transaction is good.
     *     Can't be negative. If the value is {@link TimeoutInfinite}, the
     *     transaction is good indefinitely.
     *
     * @see {@link TimeoutInfinite}
     * @see https://developers.stellar.org/docs/tutorials/handling-errors/
     */
    setTimeout(timeoutSeconds: number): TransactionBuilder;
    /**
     * If you want to prepare a transaction which will become valid at some point
     * in the future, or be invalid after some time, you can set a timebounds
     * precondition. Internally this will set the `minTime`, and `maxTime`
     * preconditions. Conflicts with `setTimeout`, so use one or the other.
     *
     * @param minEpochOrDate - Either a JS Date object, or a number
     *     of UNIX epoch seconds. The transaction is valid after this timestamp.
     *     Can't be negative. If the value is `0`, the transaction is valid
     *     immediately.
     * @param maxEpochOrDate - Either a JS Date object, or a number
     *     of UNIX epoch seconds. The transaction is valid until this timestamp.
     *     Can't be negative. If the value is `0`, the transaction is valid
     *     indefinitely.
     */
    setTimebounds(minEpochOrDate: Date | number, maxEpochOrDate: Date | number): TransactionBuilder;
    /**
     * If you want to prepare a transaction which will only be valid within some
     * range of ledgers, you can set a ledgerbounds precondition.
     * Internally this will set the `minLedger` and `maxLedger` preconditions.
     *
     * @param minLedger - The minimum ledger this transaction is valid at
     *     or after. Cannot be negative. If the value is `0` (the default), the
     *     transaction is valid immediately.
     *
     * @param maxLedger - The maximum ledger this transaction is valid
     *     before. Cannot be negative. If the value is `0`, the transaction is
     *     valid indefinitely.
     */
    setLedgerbounds(minLedger: number, maxLedger: number): TransactionBuilder;
    /**
     * If you want to prepare a transaction which will be valid only while the
     * account sequence number is
     *
     *     minAccountSequence <= sourceAccountSequence < tx.seqNum
     *
     * Note that after execution the account's sequence number is always raised to
     * `tx.seqNum`. Internally this will set the `minAccountSequence`
     * precondition.
     *
     * @param minAccountSequence - The minimum source account sequence
     *     number this transaction is valid for. If the value is `0` (the
     *     default), the transaction is valid when `sourceAccount's sequence
     *     number == tx.seqNum- 1`.
     */
    setMinAccountSequence(minAccountSequence: string): TransactionBuilder;
    /**
     * For the transaction to be valid, the current ledger time must be at least
     * `minAccountSequenceAge` greater than sourceAccount's `sequenceTime`.
     * Internally this will set the `minAccountSequenceAge` precondition.
     *
     * @param durationInSeconds - The minimum amount of time between
     *     source account sequence time and the ledger time when this transaction
     *     will become valid. If the value is `0`, the transaction is unrestricted
     *     by the account sequence age. Cannot be negative.
     */
    setMinAccountSequenceAge(durationInSeconds: number): TransactionBuilder;
    /**
     * For the transaction to be valid, the current ledger number must be at least
     * `minAccountSequenceLedgerGap` greater than sourceAccount's ledger sequence.
     * Internally this will set the `minAccountSequenceLedgerGap` precondition.
     *
     * @param gap - The minimum number of ledgers between source account
     *     sequence and the ledger number when this transaction will become valid.
     *     If the value is `0`, the transaction is unrestricted by the account
     *     sequence ledger. Cannot be negative.
     */
    setMinAccountSequenceLedgerGap(gap: number): TransactionBuilder;
    /**
     * For the transaction to be valid, there must be a signature corresponding to
     * every Signer in this array, even if the signature is not otherwise required
     * by the sourceAccount or operations. Internally this will set the
     * `extraSigners` precondition.
     *
     * @param extraSigners - required extra signers (as {@link StrKey}s)
     */
    setExtraSigners(extraSigners: string[]): TransactionBuilder;
    /**
     * Set network passphrase for the Transaction that will be built.
     *
     * @param networkPassphrase - passphrase of the target Stellar
     *     network (e.g. "Public Global Stellar Network ; September 2015").
     */
    setNetworkPassphrase(networkPassphrase: string): TransactionBuilder;
    /**
     * Sets the transaction's internal Soroban transaction data (resources,
     * footprint, etc.).
     *
     * For non-contract(non-Soroban) transactions, this setting has no effect. In
     * the case of Soroban transactions, this is either an instance of
     * {@link xdr.SorobanTransactionData} or a base64-encoded string of said
     * structure. This is usually obtained from the simulation response based on a
     * transaction with a Soroban operation (e.g.
     * {@link Operation.invokeHostFunction}, providing necessary resource
     * and storage footprint estimations for contract invocation.
     *
     * @param sorobanData - the {@link xdr.SorobanTransactionData} as a raw xdr
     *    object or a base64 string to be decoded
     *
     * @see {SorobanDataBuilder}
     */
    setSorobanData(sorobanData: xdr.SorobanTransactionData | string): TransactionBuilder;
    /**
     * Creates and adds an invoke host function operation for transferring SAC tokens.
     * This method removes the need for simulation by handling the creation of the
     * appropriate authorization entries and ledger footprint for the transfer operation.
     *
     * @param destination - the address of the recipient of the SAC transfer (should be a valid Stellar address or contract ID)
     * @param asset - the SAC asset to be transferred
     * @param amount - the amount of tokens to be transferred in 7 decimals. IE 1 token with 7 decimals of precision would be represented as "1_0000000"
     * @param sorobanFees - optional Soroban fees for the transaction to override the default fees used
     */
    addSacTransferOperation(destination: string, asset: Asset, amount: bigint | string, sorobanFees?: SorobanFees): TransactionBuilder;
    /**
     * Builds the transaction and increments the source account's sequence
     * number by 1.
     */
    build(): Transaction;
    /**
     * Checks whether any v2 preconditions have been set on this builder.
     */
    hasV2Preconditions(): boolean;
    /**
     * Builds a {@link FeeBumpTransaction}, enabling you to resubmit an existing
     * transaction with a higher fee.
     *
     * @param feeSource - account paying for the transaction,
     *     in the form of either a Keypair (only the public key is used) or
     *     an account ID (in G... or M... form, but refer to `withMuxing`)
     * @param baseFee - max fee willing to pay per operation
     *     in inner transaction (**in stroops**)
     * @param innerTx - {@link Transaction} to be bumped by
     *     the fee bump transaction
     * @param networkPassphrase - passphrase of the target
     *     Stellar network (e.g. "Public Global Stellar Network ; September 2015",
     *     see {@link Networks})
     *
     * @todo Alongside the next major version bump, this type signature can be
     *       changed to be less awkward: accept a MuxedAccount as the `feeSource`
     *       rather than a keypair or string.
     *
     * @note Your fee-bump amount should be >= 10x the original fee.
     * @see  https://developers.stellar.org/docs/glossary/fee-bumps/#replace-by-fee
     */
    static buildFeeBumpTransaction(feeSource: Keypair | string, baseFee: string, innerTx: Transaction, networkPassphrase: string): FeeBumpTransaction;
    /**
     * Build a {@link Transaction} or {@link FeeBumpTransaction} from an
     * xdr.TransactionEnvelope.
     *
     * @param envelope - The transaction envelope
     *     object or base64 encoded string.
     * @param networkPassphrase - The network passphrase of the target
     *     Stellar network (e.g. "Public Global Stellar Network ; September
     *     2015"), see {@link Networks}.
     */
    static fromXDR(envelope: xdr.TransactionEnvelope | string, networkPassphrase: string): FeeBumpTransaction | Transaction;
}
/**
 * Checks whether a provided object is a valid Date.
 * @param d - date object
 */
export declare function isValidDate(d: Date | number | string): d is Date;
