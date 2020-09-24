import xdr from '../generated/stellar-xdr_generated';

/**
 * Create a new claim claimable balance operation.
 * @function
 * @alias Operation.claimClaimableBalance
 * @param {object} opts Options object
 * @param {string} opts.balanceId - The claimable balance id to be claimed.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} Claim claimable balance operation
 *
 * @example
 * const op = Operation.claimClaimableBalance({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 *
 */
export function claimClaimableBalance(opts = {}) {
  if (typeof opts.balanceId !== 'string') {
    throw new Error('must provide a valid claimable balance Id');
  }
  const attributes = {};
  attributes.balanceId = xdr.ClaimableBalanceId.fromXDR(opts.balanceId, 'hex');
  const claimClaimableBalanceOp = new xdr.ClaimClaimableBalanceOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.claimClaimableBalance(
    claimClaimableBalanceOp
  );
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
