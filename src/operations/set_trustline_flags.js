//
// Not implemented until https://github.com/stellar/stellar-core/pull/2918 merges.
//
// import xdr from '../generated/stellar-xdr_generated';

/**
 * Creates a trustline flag setting operation.
 *
 * @function
 * @alias Operation.setTrustlineFlags
 *
 * @param {object} opts - Options object
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @return {xdr.SetTrustlineFlagsOp}
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#set-trustline-flags-operation
 */
export function setTrustlineFlags(opts = {}) {
  throw new Error('Not implemented.', opts);
}
