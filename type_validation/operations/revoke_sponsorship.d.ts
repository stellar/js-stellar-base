import xdr from "../xdr.js";
import { RevokeAccountSponsorshipOpts, RevokeTrustlineSponsorshipOpts, RevokeOfferSponsorshipOpts, RevokeDataSponsorshipOpts, RevokeClaimableBalanceSponsorshipOpts, RevokeLiquidityPoolSponsorshipOpts, RevokeSignerSponsorshipOpts, OperationClass } from "./types.js";
/**
 * Create a "revoke sponsorship" operation for an account.
 *
 * @alias Operation.revokeAccountSponsorship
 * @param opts - Options object
 * @param opts.account - The sponsored account ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeAccountSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 * });
 */
export declare function revokeAccountSponsorship(this: OperationClass, opts?: RevokeAccountSponsorshipOpts): xdr.Operation;
/**
 * Create a "revoke sponsorship" operation for a trustline.
 *
 * @alias Operation.revokeTrustlineSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID which owns the trustline.
 * @param opts.asset - The trustline asset.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeTrustlineSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   asset: new StellarBase.LiquidityPoolId(
 *     'USDUSD',
 *     'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 *   )
 * });
 */
export declare function revokeTrustlineSponsorship(this: OperationClass, opts?: RevokeTrustlineSponsorshipOpts): xdr.Operation;
/**
 * Create a "revoke sponsorship" operation for an offer.
 *
 * @alias Operation.revokeOfferSponsorship
 * @param opts - Options object
 * @param opts.seller - The account ID which created the offer.
 * @param opts.offerId - The offer ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeOfferSponsorship({
 *   seller: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   offerId: '1234'
 * });
 */
export declare function revokeOfferSponsorship(this: OperationClass, opts?: RevokeOfferSponsorshipOpts): xdr.Operation;
/**
 * Create a "revoke sponsorship" operation for a data entry.
 *
 * @alias Operation.revokeDataSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID which owns the data entry.
 * @param opts.name - The name of the data entry.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeDataSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   name: 'foo'
 * });
 */
export declare function revokeDataSponsorship(this: OperationClass, opts?: RevokeDataSponsorshipOpts): xdr.Operation;
/**
 * Create a "revoke sponsorship" operation for a claimable balance.
 *
 * @alias Operation.revokeClaimableBalanceSponsorship
 * @param opts - Options object
 * @param opts.balanceId - The sponsored claimable balance ID.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeClaimableBalanceSponsorship({
 *   balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
 * });
 */
export declare function revokeClaimableBalanceSponsorship(this: OperationClass, opts?: RevokeClaimableBalanceSponsorshipOpts): xdr.Operation;
/**
 * Creates a "revoke sponsorship" operation for a liquidity pool.
 *
 * @alias Operation.revokeLiquidityPoolSponsorship
 * @param opts - Options object.
 * @param opts.liquidityPoolId - The sponsored liquidity pool ID in 'hex' string.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeLiquidityPoolSponsorship({
 *   liquidityPoolId: 'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7',
 * });
 */
export declare function revokeLiquidityPoolSponsorship(this: OperationClass, opts?: RevokeLiquidityPoolSponsorshipOpts): xdr.Operation;
/**
 * Create a "revoke sponsorship" operation for a signer.
 *
 * @alias Operation.revokeSignerSponsorship
 * @param opts - Options object
 * @param opts.account - The account ID where the signer sponsorship is being removed from.
 * @param opts.signer - The signer whose sponsorship is being removed.
 * @param opts.signer.ed25519PublicKey - The ed25519 public key of the signer.
 * @param opts.signer.sha256Hash - sha256 hash (Buffer or hex string).
 * @param opts.signer.preAuthTx - Hash (Buffer or hex string) of transaction.
 * @param opts.source - The source account for the operation. Defaults to the transaction's source account.
 *
 * @example
 * const op = Operation.revokeSignerSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7',
 *   signer: {
 *     ed25519PublicKey: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
 *   }
 * })
 */
export declare function revokeSignerSponsorship(this: OperationClass, opts?: RevokeSignerSponsorshipOpts): xdr.Operation;
