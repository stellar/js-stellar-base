import xdr from '../generated/stellar-xdr_generated';

/**
 * Create a new claim claimable balance operation.
 * @function
 * @alias Operation.claimClaimableBalance
 * @param {object} opts Options object
 * @param {string} opts.claimableBalanceId - The claimable balance id to be claimed.
 * @returns {xdr.ClaimClaimableBalanceOp} Claim claimable balance operation
 *
 * @example
 * const op = Operation.claimClaimableBalance({
 *   balanceId: '0da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 *
 */
export function claimClaimableBalance(opts) {
  if (typeof opts.balanceId !== 'string' || opts.balanceId.length < 2) {
    throw new Error('must provide a valid claimable balance Id');
  }

  const discriminant = opts.balanceId.slice(0, 1);
  if (discriminant !== '0') {
    throw new Error(
      `invalid claimable balance Id: ${discriminant} is not a valid type`
    );
  }
  const hexHash = opts.balanceId.slice(1);

  const attributes = {};
  attributes.balanceId = xdr.ClaimableBalanceId.claimableBalanceIdTypeV0(
    xdr.Hash.fromXDR(hexHash, 'hex')
  );
  const claimClaimableBalanceOp = new xdr.ClaimClaimableBalanceOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.claimClaimableBalance(
    claimClaimableBalanceOp
  );
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
