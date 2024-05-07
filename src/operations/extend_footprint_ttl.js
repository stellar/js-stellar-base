import xdr from '../xdr';

/**
 * Builds an operation to bump the time-to-live of a footprint (read and written
 * ledger keys). Its only parameter is the number of ledgers (N) **relative** to
 * the last-closed ledger (LCL) at which the entry will be archived, i.e. it
 * will be archived at a ledger >= LCL+N. These are the entries' time to live.
 *
 * The footprint itself is derived from the transaction (see
 * {@link TransactionBuilder}'s `opts.sorobanData` parameter, which is a
 * {@link xdr.SorobanTransactionData} instance that contains fee data & resource
 * usage as part of {@link xdr.SorobanResources}).
 *
 * @function
 * @alias Operation.extendFootprintTtl
 *
 * @param {object} opts - object holding operation parameters
 * @param {number} opts.minimumTtl - the number of ledgers relative to the
 *    last-closed ledger that the footprint entry should live for (note that
 *    this value has to be below the network's `max_entry_ttl` setting)
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Extend Footprint TTL operation
 *    (xdr.ExtendFootprintTTLOp)
 */
export function extendFootprintTtl(opts) {
  if ((opts.minimumTtl ?? -1) <= 0) {
    throw new RangeError("minimumTtl isn't a ledger quantity (uint32)");
  }

  const extendFootprintOp = new xdr.ExtendFootprintTtlOp({
    ext: new xdr.ExtensionPoint(0),
    extendTo: opts.minimumTtl
  });

  const opAttributes = {
    body: xdr.OperationBody.extendFootprintTtl(extendFootprintOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
