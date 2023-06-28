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
 * @alias Operation.bumpFootprintExpiration
 *
 * @param {object} opts - object holding operation parameters
 * @param {number} opts.ledgersToExpire - the number of ledgers past the LCL
 *    (last closed ledger) by which to extend the validity of the ledger keys in
 *    this transaction
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} a Bump Footprint Expiration operation
 *    (xdr.BumpFootprintExpirationOp)
 */
export function bumpFootprintExpiration(opts) {
  if ((opts.ledgersToExpire ?? -1) <= 0) {
    throw new RangeError("ledgersToExpire isn't a ledger quantity (uint32)");
  }

  const bumpFootprintOp = new xdr.BumpFootprintExpirationOp({
    ext: new xdr.ExtensionPoint(0),
    ledgersToExpire: opts.ledgersToExpire
  });

  const opAttributes = {
    body: xdr.OperationBody.bumpFootprintExpiration(bumpFootprintOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
