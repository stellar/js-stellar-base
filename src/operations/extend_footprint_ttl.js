import xdr from '../xdr';

/**
 * Builds an operation to bump the time-to-live of a footprint (read and written
 * ledger keys). Its only parameter is the new, absolute ledger sequence number
 * at which the entry will expire.
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
 * @param {number} opts.extendTo - the absolute ledger sequence number at which
 *     the transaction's ledger keys will now expire
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Extend Footprint TTL operation
 *    (xdr.ExtendFootprintTTLOp)
 */
export function extendFootprintTtl(opts) {
  if ((opts.extendTo ?? -1) <= 0) {
    throw new RangeError("extendTo isn't a ledger quantity (uint32)");
  }

  const extendFootprintOp = new xdr.ExtendFootprintTtlOp({
    ext: new xdr.ExtensionPoint(0),
    extendTo: opts.extendTo
  });

  const opAttributes = {
    body: xdr.OperationBody.extendFootprintTtl(extendFootprintOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
