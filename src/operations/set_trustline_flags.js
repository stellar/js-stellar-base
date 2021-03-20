import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';

/**
 * Creates a trustline flag configuring operation.
 *
 * @function
 * @alias Operation.setTrustLineFlags
 *
 * @param {object} opts - Options object
 * @param {string} opts.trustor     - the account whose trustline this is
 * @param {Asset}  opts.asset       - the asset on the trustline
 * @param {[xdr.TrustLineFlags]} opts.clearFlags - the flags to clear
 * @param {[xdr.TrustLineFlags]} opts.setFlags   - the flags to set
 *
 * @param {string} [opts.source] - The source account for the operation.
 *                                 Defaults to the transaction's source account.
 *
 * @return {xdr.SetTrustLineFlagsOp}
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#set-trustline-flags-operation
 */
export function setTrustLineFlags(opts = {}) {
  const attributes = {};

  /* eslint no-bitwise: "off" */

  let clearFlag = 0;
  if (opts.clearFlags instanceof Array) {
    opts.clearFlags.forEach((x) => {
      clearFlag |= x.value;
    });
  } else if (opts.clearFlags !== undefined) {
    throw new Error('clearFlags should be an array of xdr.TrustLineFlags');
  }

  let setFlag = 0;
  if (opts.setFlags instanceof Array) {
    opts.setFlags.forEach((x) => {
      setFlag |= x.value;
    });
  } else {
    throw new Error('setFlags should be an array of xdr.TrustLineFlags');
  }

  attributes.trustor = Keypair.fromPublicKey(opts.trustor).xdrAccountId();
  attributes.asset = opts.asset.toXDRObject();
  attributes.clearFlags = clearFlag;
  attributes.setFlags = setFlag;

  const opAttributes = {
    body: xdr.OperationBody.setTrustLineFlags(
      new xdr.SetTrustLineFlagsOp(attributes)
    )
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
