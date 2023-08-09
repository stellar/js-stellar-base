import xdr from './xdr';

/**
 * @typedef CreateInvocation
 * @prop {string} idInput
 * @prop {string} contractId
 * @prop {string} executable
 * @prop
 */

/**
 * @typedef ExecuteInvocation
 * @prop {string} source    TODO
 * @prop {string} function  TODO
 * @prop {any[]}  args      TODO
 */

/**
 * @typedef InvocationTree
 *
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
 *
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

    // sorobanAuthorizedFunctionTypeCreateContractHostFn
    case 1:
      output.type = 'create';
      output.args = {
        executable: inner.executable().toXDR('base64')
      };
      break;

    default:
      throw new Error(`unknown invocation type: ${JSON.stringify(invocation)}`);
  }

  output.subInvocations = tree.subInvocations.map(buildInvocationTreeHelper);
  return output;
}
