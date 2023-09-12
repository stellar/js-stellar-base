import { Address } from './address';
import { Operation } from './operation';
import xdr from './xdr';
import { StrKey } from './strkey';

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
 *     `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE`).
 */
export class Contract {
  constructor(contractId) {
    try {
      // First, try it as a strkey
      this._id = StrKey.decodeContract(contractId);
    } catch (_) {
      throw new Error(`Invalid contract ID: ${contractId}`);
    }
  }

  /**
   * Returns Stellar contract ID as a strkey, ex.
   * `CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE`.
   * @returns {string}
   */
  contractId() {
    return StrKey.encodeContract(this._id);
  }

  /** @returns {string} the ID as a strkey (C...) */
  toString() {
    return this.contractId();
  }

  /** @returns {Address} the wrapped address of this contract */
  address() {
    return Address.contract(this._id);
  }

  /**
   * Returns an operation that will invoke this contract call.
   *
   * @param {string}        method   name of the method to call
   * @param {...xdr.ScVal}  params   arguments to pass to the function call
   *
   * @returns {xdr.Operation}   an InvokeHostFunctionOp operation to call the
   *    contract with the given method and parameters
   */
  call(method, ...params) {
    return Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: this.address().toScAddress(),
          functionName: xdr.ScVal.scvSymbol(method),
          args: params
        })
      ),
      auth: []
    });
  }

  /**
   * Returns the read-only footprint entries necessary for any invocations to
   * this contract, for convenience when adding it to your transaction's overall
   * footprint or doing bump/restore operations.
   *
   * @returns {xdr.LedgerKey[]} the ledger keys containing the contract's code
   *    (first) and its deployed contract instance (second)
   */
  getFootprint() {
    return [
      xdr.LedgerKey.contractCode(
        new xdr.LedgerKeyContractCode({ hash: this._id })
      ),
      xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
          contract: this.address().toScAddress(),
          key: xdr.ScVal.scvLedgerKeyContractInstance(),
          durability: xdr.ContractDataDurability.persistent()
        })
      )
    ];
  }
}
