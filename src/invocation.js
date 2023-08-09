import { Address } from './address';
import { scValToNative } from './scval';
/**
 * @typedef CreateInvocation
 * @prop {any}    args          TODO
 * @prop {string} contractId    TODO
 * @prop {string} executable    TODO
 * @prop
 */

/**
 * @typedef ExecuteInvocation
 * @prop {string} source    the strkey of the contract (C...) being invoked
 * @prop {string} function  the name of the function being invoked
 * @prop {any[]}  args      the natively-represented parameters to the function
 *      invocation (see {@link scValToNative}) for rules on how they're
 *      represented a JS types
 */

/**
 * @typedef InvocationTree
 * @prop {'execute' | 'create'} type
 * @prop {CreateInvocation | ExecuteInvocation} args
 * @prop {InvocationTree[]} invocations
 */

/**
 *
 * @param {xdr.SorobanAuthorizedInvocation} rootInvocation
 * @returns {InvocationTree}
 */
export function buildInvocationTree(rootInvocation) {
  return buildInvocationTreeHelper(rootInvocation);
}

/**
 * @borrows buildInvocationTree
 * @param {xdr.SorobanAuthorizedInvocation} rootInvocation
 * @returns {InvocationTree}
 */
function buildInvocationTreeHelper(tree) {
  /** @type {InvocationTree} */
  let output;

  const fn = tree.function();
  /** @type {xdr.CreateContractArgs | xdr.InvokeContractArgs} */
  const inner = fn.value();

  switch (fn.switch()) {
    // sorobanAuthorizedFunctionTypeContractFn
    case 0:
      output.type = 'execute';
      output.args = {
        source: new Address.fromScAddress(inner.contractAddress()).toString(),
        function: inner.functionName(),
        args: inner.args().map((arg) => scValToNative(arg))
      };
      break;

    // sorobanAuthorizedFunctionTypeCreateContractHostFn
    case 1:
      output.type = 'create';
      //   TODO: Format these in a way that is readable & friendly.
      output.args = {
        executable: inner.executable().toXDR('base64'),
        args: inner.contractIdPreimage().toXDR('base64')
      };
      break;

    default:
      throw new Error(`unknown invocation type: ${JSON.stringify(fn)}`);
  }

  output.subInvocations = tree.subInvocations.map(buildInvocationTreeHelper);
  return output;
}
