import xdr from '../xdr';

/**
 * Invokes a single smart contract function.
 *
 * @function
 * @alias Operation.invokeHostFunction
 *
 * @param {object} opts - options object
 * @param {xdr.HostFunction} opts.func - host function to execute (with its
 *    wrapped parameters)
 * @param {xdr.SorobanAuthorizationEntry[]} [opts.auth] - list outlining the
 *    tree of authorizations required for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 */
export function invokeHostFunction(opts) {
  if (!opts.func) {
    throw new TypeError(
      `host function invocation ('func') required (got ${JSON.stringify(opts)})`
    );
  }

  const invokeHostFunctionOp = new xdr.InvokeHostFunctionOp({
    hostFunction: opts.func,
    auth: opts.auth || []
  });

  const opAttributes = {
    body: xdr.OperationBody.invokeHostFunction(invokeHostFunctionOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
