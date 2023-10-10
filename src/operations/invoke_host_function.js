import xdr from '../xdr';
import { Address } from '../address';
import { Asset } from '../asset';

/**
 * Invokes a single smart contract host function.
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
 *
 * @see https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
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

/**
 * Returns an operation that invokes a contract function.
 *
 * @function
 * @alias Operation.invokeContractFunction
 *
 * @param {any}         opts - the set of parameters
 * @param {string}      opts.contract - a strkey-fied contract address (`C...`)
 * @param {string}      opts.function - the name of the contract fn to invoke
 * @param {xdr.ScVal[]} opts.args - parameters to pass to the function
 *    invocation (try {@link nativeToScVal} or {@link ScInt} to make building
 *    these easier)
 * @param {xdr.SorobanAuthorizationEntry[]} [opts.auth] - an optional list
 *    outlining the tree of authorizations required for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 *
 * @see Operation.invokeHostFunction
 * @see Contract.call
 * @see Address
 */
export function invokeContractFunction(opts) {
  const c = new Address(opts.contract);
  if (c._type !== 'contract') {
    throw new TypeError(`expected contract strkey instance, got ${c}`);
  }

  return Operation.invokeHostFunction({
    source: opts.source,
    func: xdr.HostFunction.hostFunctionTypeInvokeContract(
      new xdr.InvokeContractArgs({
        contractAddress: c.toScAddress(),
        functionName: opts.function,
        args: opts.args
      })
    ),
    auth: opts.auth
  });
}

/**
 * Returns an operation that creates a custom WASM contract.
 *
 * @function
 * @alias Operation.createCustomContract
 *
 * @param {any}     opts - the set of parameters
 * @param {Address} opts.address - the contract uploader address
 * @param {Buffer}  opts.wasmHash - the SHA-256 hash of the contract WASM you're
 *    uploading (see {@link hash} and {@link Operation.uploadContractWasm})
 * @param {Uint8Array|Buffer} [opts.salt] - an optional salt to distinguish
 *    deployment instances of the same wasm from the same user (if omitted, one
 *    will be generated for you)
 * @param {xdr.SorobanAuthorizationEntry[]} [opts.auth] - an optional list
 *    outlining the tree of authorizations required for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 *
 * @see
 * https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
 */
export function createCustomContract(opts) {
  const salt = Buffer.from(opts.salt || getSalty());

  if (!opts.wasmHash || opts.wasmHash.length !== 32) {
    throw new TypeError(
      `expected hash(contract WASM) in 'opts.wasmHash', got ${opts.wasmHash}`
    );
  }

  return Operation.invokeHostFunction({
    source: opts.source,
    func: xdr.HostFunction.hostFunctionTypeCreateContract(
      new xdr.CreateContractArgs({
        executable: opts.wasmHash,
        contractIdPreimage:
          xdr.ContractIdPreimage.contractIdPreimageFromAddress(
            new xdr.ContractIdPreimageFromAddress({
              address: opts.address.toScAddress(),
              salt
            })
          )
      })
    ),
    auth: opts.auth
  });
}

/**
 * Returns an operation that wraps an existing Stellar asset.
 *
 * @function
 * @alias Operation.createStellarAssetContract
 *
 * @param {any}          opts - the set of parameters
 * @param {Asset|string} opts.asset - the Stellar asset to wrap
 * @param {xdr.SorobanAuthorizationEntry[]} [opts.auth] - an optional list
 *    outlining the tree of authorizations required for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 *
 * @see
 * https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions
 * @see https://soroban.stellar.org/docs/advanced-tutorials/stellar-asset-contract
 * @see Operation.invokeHostFunction
 */
export function createStellarAssetContract(opts) {
  const asset = opts.asset;
  if (typeof asset === 'string') {
    asset = new Asset(asset);
  }

  if (!(asset instanceof Asset)) {
    throw new TypeError(`expected Asset in opts.asset, got ${asset}`);
  }

  return Operation.invokeHostFunction({
    source: opts.source,
    auth: opts.auth,
    func: xdr.HostFunction.hostFunctionTypeCreateContract(
      new xdr.CreateContractArgs({
        executable: xdr.ContractExecutable.contractExecutableToken(),
        contractIdPreimage:
          xdr.ContractIdPreimage.contractIdPreimageFromAsset(asset)
      })
    )
  });
}

/**
 * Returns an operation that uploads WASM for a contract.
 *
 * @function
 * @alias Operation.uploadContractWasm
 *
 * @param {any}               opts - the set of parameters
 * @param {Uint8Array|Buffer} opts.wasm - a WASM blob to upload to the ledger
 * @param {xdr.SorobanAuthorizationEntry[]} [opts.auth] - an optional list
 *    outlining the tree of authorizations required for the call
 * @param {string} [opts.source] - an optional source account
 *
 * @returns {xdr.Operation} an Invoke Host Function operation
 *    (xdr.InvokeHostFunctionOp)
 *
 * @see
 * https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
 */
export function uploadContractWasm(opts) {
  return Operation.invokeHostFunction({
    source: opts.source,
    auth: opts.auth,
    func: xdr.HostFunction.hostFunctionTypeUploadContractWasm(
      Buffer.from(opts.wasm) // coalesce so we can drop `Buffer` someday
    )
  });
}

/** Returns a random 256-bit "salt" value. */
function getSalty() {
  return Keypair.random().xdrPublicKey().value(); // ed25519 is 256 bits, too
}
