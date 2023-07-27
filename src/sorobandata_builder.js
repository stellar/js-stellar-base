import xdr from './xdr';

/**
 * Supports building {@link xdr.SorobanTransactionData} structures with various
 * items set to specific values.
 *
 * This is recommended for when you are building
 * {@link Operation.bumpFootprintExpiration} /
 * {@link Operation.restoreFootprint} operations to avoid building the entire
 * data structure from scratch.
 *
 * @constructor
 *
 * @param {string | null | xdr.SorobanTransactionData} sorobanData  one of: a
 *      base64-encoded string that represents an
 *      {@link xdr.SorobanTransactionData} instance, an instance itself, or
 *      `null` to start from an empty instance
 *
 * @example
 * // You want to use an existing data blob but override specific parts.
 * const newData = new SorobanDataBuilder(existing)
 *   .setReadOnly(someLedgerKey)
 *   .setRefundableFee("1000")
 *   .build();
 */
export class SorobanDataBuilder {
  _data;

  constructor(sorobanData) {
    let data;

    if (typeof sorobanData === 'string') {
      data = xdr.SorobanTransactionData.fromXDR(sorobanData, 'base64');
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
      data = sorobanData;
    }

    this._data = data;
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
   * Sets the storage access footprint to be a certain set of ledger keys.
   *
   * You can also set each field explicitly via
   * {@link SorobanDataBuilder.setReadOnly} and
   * {@link SorobanDataBuilder.setReadWrite}.
   *
   * @param {xdr.LedgerKey[] | null} readOnly   the set of ledger keys to set in
   *    the read-only portion of the transaction's `sorobanData`. if null is
   *    passed, the field is left untouched (so if you want to clear it, pass an
   *    empty array)
   * @param {xdr.LedgerKey[] | null} readWrite  the set of ledger keys to set in
   *    the read-write portion of the transaction's `sorobanData`. if null is
   *    passed, the field is left untouched (so if you want to clear it, pass an
   *    empty array)
   *
   * @returns {SorobanDataBuilder}
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

  setReadOnly(readOnly) {
    this.sorobanData
      .resources()
      .footprint()
      .readOnly(readOnly ?? []);
    return this;
  }

  setReadWrite(readWrite) {
    this.sorobanData
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
}
