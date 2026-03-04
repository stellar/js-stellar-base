import xdr from "./xdr.js";
type IntLike = bigint | number | string;
/**
 * Supports building {@link xdr.SorobanTransactionData} structures with various
 * items set to specific values.
 *
 * This is recommended for when you are building
 * {@link Operation.extendFootprintTtl} / {@link Operation.restoreFootprint}
 * operations and need to {@link TransactionBuilder.setSorobanData} to avoid
 * (re)building the entire data structure from scratch.
 *
 * @constructor
 *
 * @param {string | xdr.SorobanTransactionData} [sorobanData]  either a
 *      base64-encoded string that represents an
 *      {@link xdr.SorobanTransactionData} instance or an XDR instance itself
 *      (it will be copied); if omitted or "falsy" (e.g. an empty string), it
 *      starts with an empty instance
 *
 * @example
 * // You want to use an existing data blob but override specific parts.
 * const newData = new SorobanDataBuilder(existing)
 *   .setReadOnly(someLedgerKeys)
 *   .setRefundableFee("1000")
 *   .build();
 *
 * // You want an instance from scratch
 * const newData = new SorobanDataBuilder()
 *   .setFootprint([someLedgerKey], [])
 *   .setRefundableFee("1000")
 *   .build();
 */
export declare class SorobanDataBuilder {
    private _data;
    constructor(sorobanData?: Buffer | Uint8Array | xdr.SorobanTransactionData | string);
    /**
     * Decodes and builds a {@link xdr.SorobanTransactionData} instance.
     * @param data raw input to decode
     * @returns the decoded instance as an XDR object
     */
    static fromXDR(data: Buffer | Uint8Array | string): xdr.SorobanTransactionData;
    /**
     * Sets the resource fee portion of the Soroban data.
     * @param fee the resource fee to set (int64)
     * @returns the builder instance, for chaining
     */
    setResourceFee(fee: IntLike): SorobanDataBuilder;
    /**
     * Sets up the resource metrics.
     *
     * You should almost NEVER need this, as its often generated / provided to you
     * by transaction simulation/preflight from a Soroban RPC server.
     *
     * @param cpuInstrs      number of CPU instructions
     * @param diskReadBytes  number of bytes being read from disk
     * @param writeBytes     number of bytes being written to disk/memory
     *
     * @returns the builder instance, for chaining
     */
    setResources(cpuInstrs: number, diskReadBytes: number, writeBytes: number): SorobanDataBuilder;
    /**
     * Appends the given ledger keys to the existing storage access footprint.
     * @param readOnly   read-only keys to add
     * @param readWrite  read-write keys to add
     * @returns the builder instance, for chaining
     */
    appendFootprint(readOnly: xdr.LedgerKey[], readWrite: xdr.LedgerKey[]): SorobanDataBuilder;
    /**
     * Sets the storage access footprint to be a certain set of ledger keys.
     *
     * You can also set each field explicitly via
     * {@link SorobanDataBuilder.setReadOnly} and
     * {@link SorobanDataBuilder.setReadWrite} or add to the existing footprint
     * via {@link SorobanDataBuilder.appendFootprint}.
     *
     * Passing `null|undefined` to either parameter will IGNORE the existing
     * values. If you want to clear them, pass `[]`, instead.
     *
     * @param readOnly   the set of ledger keys to set in the read-only portion of the transaction's `sorobanData`, or `null | undefined` to keep the existing keys
     * @param readWrite  the set of ledger keys to set in the read-write portion of the transaction's `sorobanData`, or `null | undefined` to keep the existing keys
     * @returns the builder instance, for chaining
     */
    setFootprint(readOnly?: xdr.LedgerKey[] | null, readWrite?: xdr.LedgerKey[] | null): SorobanDataBuilder;
    /**
     * @param readOnly  read-only keys in the access footprint
     * @returns the builder instance, for chaining
     */
    setReadOnly(readOnly?: xdr.LedgerKey[]): SorobanDataBuilder;
    /**
     * @param readWrite  read-write keys in the access footprint
     * @returns the builder instance, for chaining
     */
    setReadWrite(readWrite?: xdr.LedgerKey[]): SorobanDataBuilder;
    /**
     * @returns {xdr.SorobanTransactionData} a copy of the final data structure
     */
    build(): xdr.SorobanTransactionData;
    /** @returns the read-only storage access pattern */
    getReadOnly(): xdr.LedgerKey[];
    /** @returns the read-write storage access pattern */
    getReadWrite(): xdr.LedgerKey[];
    /** @returns the storage access pattern */
    getFootprint(): xdr.LedgerFootprint;
}
export {};
