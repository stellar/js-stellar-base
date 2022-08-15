import xdr from '../xdr';

/**
 * Invokes a smart contract function
 *
 * @function
 * @alias Operation.invokeHostFunction
 *
 * @param {object} opts - options object
 * @param {xdr.HostFunction} opts.function - destination to merge the source account into
 * @param {xdr.ScVal[]} opts.parameters - destination to merge the source account into
 * @param {xdr.LedgerFootprint} [opts.footprint]    - operation source account (defaults to
 *     transaction source)
 *
 * @returns {xdr.Operation} an Invoke Host Function operation (xdr.InvokeHostFunctionOp)
 */
export function invokeHostFunction(opts) {
  const opAttributes = {};
  try {
    opAttributes.body = xdr.OperationBody.invokeHostfunction(
      new InvokeHostFunctionOp({
        function: opts.function,
        parameters: opts.parameters,
        footprint: opts.footprint
      })
    );
  } catch (e) {
    throw new Error('destination is invalid');
  }
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
