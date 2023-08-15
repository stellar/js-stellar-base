import xdr from './xdr';

/**
 * Supports building {@link xdr.SorobanTransactionData} structures with various
 * items set to specific values.
 *
 * This is recommended for when you are building
 * {@link Operation.bumpFootprintExpiration} /
 * {@link Operation.restoreFootprint} operations to avoid (re)building the entire
 * data structure from scratch.
 *
 * @constructor
 *
 * @param {string | xdr.SorobanTransactionData} [sorobanData]  either a
 *      base64-encoded string that represents an
 *      {@link xdr.SorobanTransactionData} instance or an XDR instance itself
 *      (it will be copied); if omitted, it starts with an empty instance
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
export class SorobanDataBuilder {
  _data;

  constructor(sorobanData) {
    let data;

    if (typeof sorobanData === 'string' || ArrayBuffer.isView(sorobanData)) {
      data = SorobanDataBuilder.fromXDR(sorobanData);
    } else if (!sorobanData) {
      data = new xdr.SorobanTransactionData({
        resources: new xdr.SorobanResources({
          footprint: new xdr.LedgerFootprint({ readOnly: [], readWrite: [] }),
          instructions: 0,
          readBytes: 0,
          writeBytes: 0,
          extendedMetaDataSizeBytes: 0
        }),
        ext: new xdr.ExtensionPoint(0),
        refundableFee: new xdr.Int64(0)
      });
    } else {
      data = xdr.SorobanTransactionData.fromXDR(sorobanData.toXDR()); // copy
    }

    this._data = data;
  }

  /**
   * Decodes and builds a {@link xdr.SorobanTransactionData} instance.
   * @param {Uint8Array|Buffer|string} data   raw input to decode
   * @returns {xdr.SorobanTransactionData}
   */
  static fromXDR(data) {
    return xdr.SorobanTransactionData.fromXDR(
      data,
      typeof data === 'string' ? 'base64' : 'raw'
    );
  }

  /**
   * Sets the "refundable" fee portion of the Soroban data.
   * @param {number | bigint | string} fee  the refundable fee to set (int64)
   * @returns {SorobanDataBuilder}
   */
  setRefundableFee(fee) {
    this._data.refundableFee(new xdr.Int64(fee));
    return this;
  }

  /**
   * Sets up the resource metrics.
   *
   * You should almost NEVER need this, as its often generated / provided to you
   * by transaction simulation/preflight from a Soroban RPC server.
   *
   * @param {number} cpuInstrs      number of CPU instructions
   * @param {number} readBytes      number of bytes being read
   * @param {number} writeBytes     number of bytes being written
   * @param {number} metadataBytes  number of extended metadata bytes
   *
   * @returns {SorobanDataBuilder}
   */
  setResources(cpuInstrs, readBytes, writeBytes, metadataBytes) {
    this._data.resources().instructions(cpuInstrs);
    this._data.resources().readBytes(readBytes);
    this._data.resources().writeBytes(writeBytes);
    this._data.resources().extendedMetaDataSizeBytes(metadataBytes);

    return this;
  }

  /**
   * Appends the given ledger keys to the existing storage access footprint.
   * @param {xdr.LedgerKey[]} readOnly   read-only keys to add
   * @param {xdr.LedgerKey[]} readWrite  read-write keys to add
   * @returns {SorobanDataBuilder} this builder instance
   */
  appendFootprint(readOnly, readWrite) {
    return this.setFootprint(
      this.getReadOnly().concat(readOnly),
      this.getReadWrite().concat(readWrite)
    );
  }

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
   * @param {xdr.LedgerKey[]|null} [readOnly]   the set of ledger keys to set in
   *    the read-only portion of the transaction's `sorobanData`, or `null |
   *    undefined` to keep the existing keys
   * @param {xdr.LedgerKey[]|null} [readWrite]  the set of ledger keys to set in
   *    the read-write portion of the transaction's `sorobanData`, or `null |
   *    undefined` to keep the existing keys
   * @returns {SorobanDataBuilder} this builder instance
   */
  setFootprint(readOnly, readWrite) {
    if (readOnly !== null) {
      // null means "leave me alone"
      this.setReadOnly(readOnly);
    }
    if (readWrite !== null) {
      this.setReadWrite(readWrite);
    }
    return this;
  }

  /**
   * @param {xdr.LedgerKey[]} readOnly  read-only keys in the access footprint
   * @returns {SorobanDataBuilder}
   */
  setReadOnly(readOnly) {
    this._data
      .resources()
      .footprint()
      .readOnly(readOnly ?? []);
    return this;
  }

  /**
   * @param {xdr.LedgerKey[]} readWrite  read-write keys in the access footprint
   * @returns {SorobanDataBuilder}
   */
  setReadWrite(readWrite) {
    this._data
      .resources()
      .footprint()
      .readWrite(readWrite ?? []);
    return this;
  }

  /**
   * @returns {xdr.SorobanTransactionData} a copy of the final data structure
   */
  build() {
    return xdr.SorobanTransactionData.fromXDR(this._data.toXDR()); // clone
  }

  //
  // getters follow
  //

  /** @returns {xdr.LedgerKey[]} the read-only storage access pattern */
  getReadOnly() {
    return this._data.resources().footprint().readOnly();
  }

  /** @returns {xdr.LedgerKey[]} the read-write storage access pattern */
  getReadWrite() {
    return this._data.resources().footprint().readWrite();
  }
}
