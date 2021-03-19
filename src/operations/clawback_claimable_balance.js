import xdr from '../generated/stellar-xdr_generated';

/**
 * Creates a clawback operation for a claimable balance.
 *
 * @function
 * @alias Operation.clawbackClaimableBalance
 * @param {object} opts - Options object
 * @param {string} opts.balanceId - The claimable balance ID to be clawed back.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 *
 * @return {xdr.Operation} Clawback claimable balance operation
 *
 * @example
 * const op = Operation.clawbackClaimableBalance({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 *
 * @link https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-claimable-balance-operation
 */
export function clawbackClaimableBalance(opts = {}) {
  if (
    typeof opts.balanceId !== 'string' ||
    opts.balanceId.length !== 8 + 64 /* 8b discriminant + 64b string */
  ) {
    throw new Error('must provide a valid claimable balance id');
  }

  const attributes = {
    balanceId: xdr.ClaimableBalanceId.fromXDR(opts.balanceId, 'hex')
  };

  const opAttributes = {
    body: xdr.OperationBody.clawbackClaimableBalance(
      new xdr.ClawbackClaimableBalanceOp(attributes)
    )
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
