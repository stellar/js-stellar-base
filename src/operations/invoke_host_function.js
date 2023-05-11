import xdr from '../xdr';

/**
 * Invokes a single smart contract function.
 *
 * @function
 * @alias Operation.invokeHostFunction
 *
 * @param {object} opts - options object
 * @param {xdr.HostFunctionArgs} opts.args - parameters to pass to the host
 *    function being invoked
 * @param {xdr.ContractAuth[]} [opts.auth] - list of authorizations for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 */
export function invokeHostFunction(opts) {
  if (!opts.args) {
    throw new TypeError(
      `function arguments ('args') required (got ${JSON.stringify(opts)})`
    );
  }

  const hostFn = new xdr.HostFunction({args: opts.args, auth: opts.auth || []});
  return this.invokeHostFunctions({ source: opts.source, functions: [hostFn] });
}

/**
 * Invokes multiple smart contract functions via a single operation.
 *
 * @function
 * @alias Operation.invokeHostFunctions
 *
 * @param {object} opts - options for the operation
 * @param {xdr.HostFunction[]} opts.functions - a list of contract functions to
 *    invoke in this operation. 
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp) with xdr.HostFunction instances corresponding
 *    to each invocation
 *
 */
export function invokeHostFunctions(opts) {
  
  const invokeHostFunctionOp = new xdr.InvokeHostFunctionOp({ functions: opts.functions });
  const opAttributes = {
    body: xdr.OperationBody.invokeHostFunction(invokeHostFunctionOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
