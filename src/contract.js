import { Operation } from './operation';
import xdr from './xdr';

/**
 * Create a new Contract object.
 *
 * `Contract` represents a single contract in the Stellar network, embodying the
 * interface of the contract. See
 * [Contracts](https://soroban.stellar.org/docs/learn/interacting-with-contracts)
 * for more information about how contracts work in Stellar.
 *
 * @constructor
 *
 * @param {string} contractId - ID of the contract (ex.
 *     `000000000000000000000000000000000000000000000000000000000000000001`).
 */
// TODO: Support contract deployment, maybe?
export class Contract {
  // TODO: Figure out contract owner/id stuff here. How should we represent that?
  constructor(contractId) {
    // TODO: Add methods based on the contractSpec (or do that elsewhere?)
    this._id = Buffer.from(contractId, 'hex');
  }

  /**
   * Returns Stellar contract ID as a hex string, ex.
   * `000000000000000000000000000000000000000000000000000000000000000001`.
   * @returns {string}
   */
  contractId() {
    return this._id.toString('hex');
  }

  /**
   * Returns an operation that will invoke this contract call.
   *
   * @todo Allow easily building `Operation`s that invoke multiple contract
   * calls at once via this abstraction layer. For example, something like
   *
   * ```js
   * let [ a, b ] = [someId1, someId2].map(id => { new Contract(id) });
   *
   * let combinedOp = Operation.invokeHostFunctions({
   *  source: undefined, // optional
   *  functions: [
   *    a.partialCall("hello"),
   *    a.partialCall("transfer", ...),
   *    b.partialCall("increment"),
   *  ]
   * });
   * ```
   *
   * @param {string} method - name of the method to call
   * @param {...xdr.ScVal} params - arguments to pass to the function call
   * @returns {xdr.Operation} Build a InvokeHostFunctionOp operation to call the
   * contract.
   */
  call(method, ...params) {
    const contractId = Buffer.from(this._id, 'hex');

    return Operation.invokeHostFunction({
      args: xdr.HostFunctionArgs.hostFunctionTypeInvokeContract([
        xdr.ScVal.scvBytes(contractId),
        xdr.ScVal.scvSymbol(method),
        ...params
      ]),
      auth: []
    });
  }

  /**
   * Returns the read-only footprint entry necessary for any invocations to this
   * contract, for convenience when adding it to your transaction's overall
   * footprint.
   *
   * @returns {xdr.LedgerKey} the contract's executable data ledger key
   */
  getFootprint() {
    const contractId = Buffer.from(this._id, 'hex');

    return xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contractId,
        key: xdr.ScVal.scvLedgerKeyContractExecutable()
      })
    );
  }
}
