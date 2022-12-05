import xdr from '../xdr';

/**
 * Invokes a smart contract function
 *
 * @function
 * @alias Operation.invokeHostFunction
 *
 * @param {object} opts - options object
 * @param {xdr.HostFunction} opts.function - host function to invoke
 * @param {xdr.LedgerFootprint} [opts.footprint]    - operation source account (defaults to
 *     transaction source)
 *
 * @returns {xdr.Operation} an Invoke Host Function operation (xdr.InvokeHostFunctionOp)
 */
export function invokeHostFunction(opts) {
  if (!opts.function) {
    throw new TypeError('function argument is required');
  }

  const invokeHostFunctionOp = new xdr.InvokeHostFunctionOp({
    function: opts.function,
    footprint: opts.footprint
  });
  const opAttributes = {
    body: xdr.OperationBody.invokeHostFunction(invokeHostFunctionOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
