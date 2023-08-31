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
// TODO: Support contract deployment, maybe?
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

  /**
   * Returns the address of this contract as an Address type.
   * @returns {Address}
   */
  address() {
    return Address.contract(this._id);
  }

  /**
   * Returns an operation that will invoke this contract call.
   *
   * @param {string} method - name of the method to call
   * @param {...xdr.ScVal} params - arguments to pass to the function call
   * @returns {xdr.Operation} Build a InvokeHostFunctionOp operation to call the
   * contract.
   */
  call(method, ...params) {
    return Operation.invokeHostFunction({
      func: xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: this.address().toScAddress(),
          functionName: method,
          args: params
        })
      ),
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
    return xdr.LedgerKey.contractData(
      new xdr.LedgerKeyContractData({
        contract: this.address().toScAddress(),
        key: xdr.ScVal.scvLedgerKeyContractInstance(),
        durability: xdr.ContractDataDurability.persistent(),
        bodyType: xdr.ContractEntryBodyType.dataEntry()
      })
    );
  }
}
