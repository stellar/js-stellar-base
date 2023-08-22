import { Asset } from './asset';
import { Address } from './address';
import { scValToNative } from './scval';

/**
 * @typedef CreateInvocation
 * @prop {any}    args          a base64-encoded {@link xdr.CreateContractArgs}
 * @prop {string} executable    a base64-encoded {@link xdr.ContractExecutable}
 */
/**
 * @typedef ExecuteInvocation
 * @prop {string} source    the strkey of the contract (C...) being invoked
 * @prop {string} function  the name of the function being invoked
 * @prop {any[]}  args      the natively-represented parameters to the function
 *    invocation (see {@link scValToNative}) for rules on how they're
 *    represented a JS types
 */
/**
 * @typedef InvocationTree
 * @prop {'execute' | 'create'} type  the type of invocation occurring, either
 *    contract creation or host function execution
 * @prop {CreateInvocation | ExecuteInvocation} args  the parameters to the
 *    invocation, depending on the type
 * @prop {InvocationTree[]} invocations   any sub-invocations that (may) occur
 *    as a result of this invocation (i.e. a tree of call stacks)
 */

/**
 * Turns a raw invocation tree into a human-readable format.
 *
 * This is designed to make the invocation tree easier to understand in order to
 * inform users about the side-effects of their contract calls. This will help
 * make informed decisions about whether or not a particular invocation will
 * result in what you expect it to.
 *
 * @param {xdr.SorobanAuthorizedInvocation} root  the raw XDR of the invocation,
 *    likely acquired from transaction simulation. this is either from the
 *    {@link Operation.invokeHostFunction} itself (the `func` field), or from
 *    the authorization entries ({@link SorobanAuthorizationEntry}, the
 *    `rootInvocation` field)
 *
 * @returns {InvocationTree}  a human-readable version of the invocation tree
 */
export function buildInvocationTree(root) {
  const fn = root.function();

  /** @type {InvocationTree} */
  let output = {};

  /** @type {xdr.CreateContractArgs | xdr.InvokeContractArgs} */
  const inner = fn.value();

  switch (fn.switch().value) {
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
    case 1: {
      output.type = 'create';
      output.args = {
        type: 'sac'
      };

      // If the executable is a WASM, the preimage MUST be an address. If it's a
      // token, the preimage MUST be an asset. This is a cheeky way to check
      // that, because wasm=0, address=1 and token=1, asset=0 in the XDR switch
      // values.
      //
      // The first part may not be true in V2, but we'd need to update this code
      // anyway so it can still be an error.
      const [exec, preimage] = [inner.executable(), inner.contractIdPreimage()];
      if (!Boolean(exec.switch().value) !== Boolean(preimage.switch().value)) {
        throw new Error(
          `creation function appears invalid: ${JSON.stringify(inner)}`
        );
      }

      switch (exec.switch().value) {
        // contractExecutableWasm
        case 0: {
          /** @type {xdr.ContractIdPreimageFromAddress} */
          const details = preimage.fromAddress();

          output.args.type = 'wasm';
          output.args.args = {
            hash: exec.wasmHash().toString('hex'),
            address: Address.fromScAddress(details.address()).toString(),
            salt: details.salt().toString('hex')
          };
          break;
        }

        // contractExecutableToken
        case 1:
          output.args.type = 'sac';
          output.args.asset = Asset.fromOperation(
            preimage.fromAsset()
          ).toString();
          break;
      }

      break;
    }

    default:
      throw new Error(
        `unknown invocation type (${fn.switch()}): ${JSON.stringify(fn)}`
      );
  }

  output.subInvocations = root
    .subInvocations()
    .map((i) => buildInvocationTree(i));
  return output;
}
