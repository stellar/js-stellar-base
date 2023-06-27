import xdr from '../xdr';

/**
 * TODO
 *
 * @function
 * @alias Operation.restoreFootprintOp
 *
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} a Bump Footprint Expiration operation
 *    (xdr.RestoreFootprintOp)
 */
export function restoreFootprint(opts = {}) {

  const op = new xdr.RestoreFootprintOp({ ext: new xdr.ExtensionPoint(0)});
  const opAttributes = {
    body: xdr.OperationBody.restoreFootprint(op)
  };
  this.setSourceAccount(opAttributes, opts ?? {});
  return new xdr.Operation(opAttributes);
}
