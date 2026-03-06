import xdr from "../xdr.js";
import { CreateCustomContractOpts, CreateStellarAssetContractOpts, InvokeContractFunctionOpts, InvokeHostFunctionOpts, OperationClass, UploadContractWasmOpts } from "./types.js";
/**
 * Invokes a single smart contract host function.
 *
 * @alias Operation.invokeHostFunction
 *
 * @param opts - options object
 * @param opts.func - host function to execute (with its wrapped parameters)
 * @param opts.auth - list outlining the tree of authorizations required for the call
 * @param opts.source - an optional source account
 *
 * @see https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
 * @see Operation.invokeContractFunction
 * @see Operation.createCustomContract
 * @see Operation.createStellarAssetContract
 * @see Operation.uploadContractWasm
 * @see Contract.call
 */
export declare function invokeHostFunction(this: OperationClass, opts: InvokeHostFunctionOpts): xdr.Operation;
/**
 * Returns an operation that invokes a contract function.
 *
 * @alias Operation.invokeContractFunction
 *
 * @param opts - the set of parameters
 * @param opts.contract - a strkey-fied contract address (`C...`)
 * @param opts.function - the name of the contract fn to invoke
 * @param opts.args - parameters to pass to the function invocation
 * @param opts.auth - an optional list outlining the tree of authorizations required for the call
 * @param opts.source - an optional source account
 *
 * @see Operation.invokeHostFunction
 * @see Contract.call
 * @see Address
 */
export declare function invokeContractFunction(this: OperationClass, opts: InvokeContractFunctionOpts): xdr.Operation;
/**
 * Returns an operation that creates a custom WASM contract and atomically
 * invokes its constructor.
 *
 * @alias Operation.createCustomContract
 *
 * @param opts - the set of parameters
 * @param opts.address - the contract uploader address
 * @param opts.wasmHash - the SHA-256 hash of the contract WASM you're uploading
 * @param opts.constructorArgs - the optional parameters to pass to the constructor
 * @param opts.salt - an optional, 32-byte salt to distinguish deployment instances
 * @param opts.auth - an optional list outlining the tree of authorizations required for the call
 * @param opts.source - an optional source account
 *
 * @see https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
 */
export declare function createCustomContract(this: OperationClass, opts: CreateCustomContractOpts): xdr.Operation;
/**
 * Returns an operation that wraps a Stellar asset into a token contract.
 *
 * @alias Operation.createStellarAssetContract
 *
 * @param opts - the set of parameters
 * @param opts.asset - the Stellar asset to wrap, either as an {@link Asset} object or in canonical form (SEP-11, `code:issuer`)
 * @param opts.source - an optional source account
 *
 * @see https://stellar.org/protocol/sep-11#alphanum4-alphanum12
 * @see https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions
 * @see https://soroban.stellar.org/docs/advanced-tutorials/stellar-asset-contract
 * @see Operation.invokeHostFunction
 */
export declare function createStellarAssetContract(this: OperationClass, opts: CreateStellarAssetContractOpts): xdr.Operation;
/**
 * Returns an operation that uploads WASM for a contract.
 *
 * @alias Operation.uploadContractWasm
 *
 * @param opts - the set of parameters
 * @param opts.wasm - a WASM blob to upload to the ledger
 * @param opts.source - an optional source account
 *
 * @see https://soroban.stellar.org/docs/fundamentals-and-concepts/invoking-contracts-with-transactions#function
 */
export declare function uploadContractWasm(this: OperationClass, opts: UploadContractWasmOpts): xdr.Operation;
