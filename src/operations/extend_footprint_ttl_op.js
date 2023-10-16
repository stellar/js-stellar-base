import xdr from '../xdr';

/**
 * Builds an operation to bump the expiration of a footprint (read and written
 * ledger keys). Its only parameter is the number of ledgers to extend
 * expiration for.
 *
 * The footprint itself is derived from the transaction (see
 * {@link TransactionBuilder}'s `opts.sorobanData` parameter, which is a
 * {@link xdr.SorobanTransactionData} instance that contains fee data & resource
 * usage as part of {@link xdr.SorobanResources}).
 *
 * @function
 * @alias Operation.extendFootprintTtlOp
 *
 * @param {object} opts - object holding operation parameters
 * @param {number} opts.extendTo - the number of ledgers past the LCL
 *    (last closed ledger) by which to extend the validity of the ledger keys in
 *    this transaction
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} a Bump Footprint Expiration operation
 *    (xdr.ExtendFootprintTTLOp)
 */
export function extendFootprintTtlOp(opts) {
  if ((opts.extendTo ?? -1) <= 0) {
    throw new RangeError("extendTo isn't a ledger quantity (uint32)");
  }

  const bumpFootprintOp = new xdr.ExtendFootprintTtlOp({
    ext: new xdr.ExtensionPoint(0),
    extendTo: opts.extendTo
  });

  const opAttributes = {
    body: xdr.OperationBody.extendFootprintTtl(bumpFootprintOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
