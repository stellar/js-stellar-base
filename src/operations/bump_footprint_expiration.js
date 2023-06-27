import xdr from '../xdr';

/**
 * TODO
 *
 * @function
 * @alias Operation.bumpFootprintExpiration
 *
 * @param {object} opts - options object
 * @param {number} opts.ledgersToExpire -
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} a Bump Footprint Expiration operation
 *    (xdr.BumpFootprintExpirationOp)
 */
export function bumpFootprintExpiration(opts) {
  if ((opts.ledgersToExpire ?? -1) <= 0) {
    throw new RangeError('ledgersToExpire isnt a ledger quantity (uint32)');
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
