import { Operation } from './operation';
import xdr from './xdr';

/**
 * Create a new Contract object.
 *
 * `Contract` represents a single contract in the Stellar network. Contract embodies the interface of the contract. See
 * [Contracts](https://developers.stellar.org/docs/glossary/contracts/) for
 * more information about how contracts work in Stellar.
 *
 * @constructor
 *
 * @param {string} contractId - ID of the contract (ex.
 *     `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`).
 */
// TODO: Support contract deployment, maybe
export class Contract {
  // TODO: Figure out contract owner/id stuff here. How should we represent that?
  constructor(contractId) {
    // TODO: Add methods based on the contractSpec (or do that elsewhere?)
    this._id = contractId;
  }

  /**
   * Returns Stellar contract ID, ex.
   * `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`.
   * @returns {string}
   */
  contractId() {
    return this._id;
  }

  /**
   * @param {string} fn - name of the function to call
   * @param {...xdr.ScVal} params - arguments to pass to the function call
   * @returns {xdr.Operation} Build a InvokeHostFunctionOp operation to call the contract.
   */
  call(fn, ...params) {
    return Operation.invokeHostFunction({
      function: xdr.HostFunction.hostFnCall(),
      parameters: [
        xdr.ScVal.obj(xdr.ScObject.bin(this._id)),
        xdr.ScVal.obj(xdr.ScObject.bin(fn)),
        ...params
      ],
      // TODO: Figure out how to calculate this or get it from the user?
      footprint: new xdr.LedgerFootprint({ readOnly: [], readWrite: [] })
    });
  }
}
