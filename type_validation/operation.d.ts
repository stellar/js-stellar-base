import xdr from "./xdr.js";
import * as ops from "./operations/index.js";
import type { OperationAttributes, OperationRecord, OperationType as _OperationType, BaseOperation as _BaseOperation, CreateAccountResult, PaymentResult, PathPaymentStrictReceiveResult, PathPaymentStrictSendResult, CreatePassiveSellOfferResult, ManageSellOfferResult, ManageBuyOfferResult, SetOptionsResult, ChangeTrustResult, AllowTrustResult, AccountMergeResult, InflationResult, ManageDataResult, BumpSequenceResult, CreateClaimableBalanceResult, ClaimClaimableBalanceResult, BeginSponsoringFutureReservesResult, EndSponsoringFutureReservesResult, RevokeAccountSponsorshipResult, RevokeTrustlineSponsorshipResult, RevokeOfferSponsorshipResult, RevokeDataSponsorshipResult, RevokeClaimableBalanceSponsorshipResult, RevokeLiquidityPoolSponsorshipResult, RevokeSignerSponsorshipResult, ClawbackResult, ClawbackClaimableBalanceResult, SetTrustLineFlagsResult, LiquidityPoolDepositResult, LiquidityPoolWithdrawResult, InvokeHostFunctionResult, ExtendFootprintTTLResult, RestoreFootprintResult } from "./operations/types.js";
/**
 * When set using `{@link Operation.setOptions}` option, requires the issuing
 * account to give other accounts permission before they can hold the issuing
 * account’s credit.
 *
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export declare const AuthRequiredFlag: number;
/**
 * When set using `{@link Operation.setOptions}` option, allows the issuing
 * account to revoke its credit held by other accounts.
 *
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export declare const AuthRevocableFlag: number;
/**
 * When set using `{@link Operation.setOptions}` option, then none of the
 * authorization flags can be set and the account can never be deleted.
 *
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export declare const AuthImmutableFlag: number;
/**
 * When set using `{@link Operation.setOptions}` option, then any trustlines
 * created by this account can have a ClawbackOp operation submitted for the
 * corresponding asset.
 *
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export declare const AuthClawbackEnabledFlag: number;
/**
 * `Operation` class represents
 * [operations](https://developers.stellar.org/docs/glossary/operations/) in
 * Stellar network.
 *
 * Use one of static methods to create operations:
 * * `{@link Operation.createAccount}`
 * * `{@link Operation.payment}`
 * * `{@link Operation.pathPaymentStrictReceive}`
 * * `{@link Operation.pathPaymentStrictSend}`
 * * `{@link Operation.manageSellOffer}`
 * * `{@link Operation.manageBuyOffer}`
 * * `{@link Operation.createPassiveSellOffer}`
 * * `{@link Operation.setOptions}`
 * * `{@link Operation.changeTrust}`
 * * `{@link Operation.allowTrust}`
 * * `{@link Operation.accountMerge}`
 * * `{@link Operation.inflation}`
 * * `{@link Operation.manageData}`
 * * `{@link Operation.bumpSequence}`
 * * `{@link Operation.createClaimableBalance}`
 * * `{@link Operation.claimClaimableBalance}`
 * * `{@link Operation.beginSponsoringFutureReserves}`
 * * `{@link Operation.endSponsoringFutureReserves}`
 * * `{@link Operation.revokeAccountSponsorship}`
 * * `{@link Operation.revokeTrustlineSponsorship}`
 * * `{@link Operation.revokeOfferSponsorship}`
 * * `{@link Operation.revokeDataSponsorship}`
 * * `{@link Operation.revokeClaimableBalanceSponsorship}`
 * * `{@link Operation.revokeLiquidityPoolSponsorship}`
 * * `{@link Operation.revokeSignerSponsorship}`
 * * `{@link Operation.clawback}`
 * * `{@link Operation.clawbackClaimableBalance}`
 * * `{@link Operation.setTrustLineFlags}`
 * * `{@link Operation.liquidityPoolDeposit}`
 * * `{@link Operation.liquidityPoolWithdraw}`
 * * `{@link Operation.invokeHostFunction}`, which has the following additional
 *   "pseudo-operations" that make building host functions easier:
 *   - `{@link Operation.createStellarAssetContract}`
 *   - `{@link Operation.invokeContractFunction}`
 *   - `{@link Operation.createCustomContract}`
 *   - `{@link Operation.uploadContractWasm}`
 * * `{@link Operation.extendFootprintTtlOp}`
 * * `{@link Operation.restoreFootprint}`
 *
 */
export declare class Operation {
    /** Sets the source account on the operation attributes from the opts. */
    static setSourceAccount(opAttributes: OperationAttributes, opts: {
        source?: string;
    }): void;
    /**
     * Deconstructs the raw XDR operation object into the structured object that
     * was used to create the operation (i.e. the `opts` parameter to most ops).
     *
     * @param operation - An XDR Operation.
     */
    static fromXDRObject<T extends OperationRecord = OperationRecord>(operation: xdr.Operation): T;
    /**
     * Validates that a given amount is possible for a Stellar asset.
     *
     * Specifically, this means that the amount is well, a valid number, but also
     * that it is within the int64 range and has no more than 7 decimal levels of
     * precision.
     *
     * Note that while smart contracts allow larger amounts, this is oriented
     * towards validating the standard Stellar operations.
     *
     * @param value - the amount to validate
     * @param allowZero - optionally, whether or not zero is valid (default: no)
     */
    static isValidAmount(value: unknown, allowZero?: boolean): boolean;
    /** Returns a standard error message for invalid amount arguments. */
    static constructAmountRequirementsError(arg: string): string;
    /**
     * Returns value converted to uint32 value or undefined.
     * If `value` is not `Number`, `String` or `Undefined` then throws an error.
     * Used in {@link Operation.setOptions}.
     *
     * @param name - name of the property (used in error message only)
     * @param value - value to check
     * @param isValidFunction - function to check other constraints (the argument will be a `Number`)
     */
    static _checkUnsignedIntValue(name: string, value: number | string | undefined, isValidFunction?: ((value: number, name: string) => boolean) | null): number | undefined;
    /**
     * Converts a string amount to an XDR Int64 value (scaled by 10^7).
     *
     * @param value - the amount as a string
     */
    static _toXDRAmount(value: string): xdr.Int64;
    /**
     * Converts an XDR Int64 amount to a decimal string (divided by 10^7).
     *
     * @param value - the XDR amount
     */
    static _fromXDRAmount(value: xdr.Int64): string;
    /**
     * Converts an XDR Price (n/d) to a decimal string.
     *
     * @param price - the XDR price object
     */
    static _fromXDRPrice(price: xdr.Price): string;
    /**
     * Converts a number, string, or `{n, d}` object to an XDR Price.
     *
     * @param price - the price as a number, string, or `{n, d}` fraction
     */
    static _toXDRPrice(price: number | string | {
        n: number;
        d: number;
    }): xdr.Price;
    static accountMerge: typeof ops.accountMerge;
    static allowTrust: typeof ops.allowTrust;
    static bumpSequence: typeof ops.bumpSequence;
    static changeTrust: typeof ops.changeTrust;
    static createAccount: typeof ops.createAccount;
    static createClaimableBalance: typeof ops.createClaimableBalance;
    static claimClaimableBalance: typeof ops.claimClaimableBalance;
    static clawbackClaimableBalance: typeof ops.clawbackClaimableBalance;
    static createPassiveSellOffer: typeof ops.createPassiveSellOffer;
    static inflation: typeof ops.inflation;
    static manageData: typeof ops.manageData;
    static manageSellOffer: typeof ops.manageSellOffer;
    static manageBuyOffer: typeof ops.manageBuyOffer;
    static pathPaymentStrictReceive: typeof ops.pathPaymentStrictReceive;
    static pathPaymentStrictSend: typeof ops.pathPaymentStrictSend;
    static payment: typeof ops.payment;
    static setOptions: typeof ops.setOptions;
    static beginSponsoringFutureReserves: typeof ops.beginSponsoringFutureReserves;
    static endSponsoringFutureReserves: typeof ops.endSponsoringFutureReserves;
    static revokeAccountSponsorship: typeof ops.revokeAccountSponsorship;
    static revokeTrustlineSponsorship: typeof ops.revokeTrustlineSponsorship;
    static revokeOfferSponsorship: typeof ops.revokeOfferSponsorship;
    static revokeDataSponsorship: typeof ops.revokeDataSponsorship;
    static revokeClaimableBalanceSponsorship: typeof ops.revokeClaimableBalanceSponsorship;
    static revokeLiquidityPoolSponsorship: typeof ops.revokeLiquidityPoolSponsorship;
    static revokeSignerSponsorship: typeof ops.revokeSignerSponsorship;
    static clawback: typeof ops.clawback;
    static setTrustLineFlags: typeof ops.setTrustLineFlags;
    static liquidityPoolDeposit: typeof ops.liquidityPoolDeposit;
    static liquidityPoolWithdraw: typeof ops.liquidityPoolWithdraw;
    static invokeHostFunction: typeof ops.invokeHostFunction;
    static extendFootprintTtl: typeof ops.extendFootprintTtl;
    static restoreFootprint: typeof ops.restoreFootprint;
    static createStellarAssetContract: typeof ops.createStellarAssetContract;
    static invokeContractFunction: typeof ops.invokeContractFunction;
    static createCustomContract: typeof ops.createCustomContract;
    static uploadContractWasm: typeof ops.uploadContractWasm;
}
export declare namespace Operation {
    type BaseOperation<T extends _OperationType = _OperationType> = _BaseOperation<T>;
    type CreateAccount = CreateAccountResult;
    type Payment = PaymentResult;
    type PathPaymentStrictReceive = PathPaymentStrictReceiveResult;
    type PathPaymentStrictSend = PathPaymentStrictSendResult;
    type CreatePassiveSellOffer = CreatePassiveSellOfferResult;
    type ManageSellOffer = ManageSellOfferResult;
    type ManageBuyOffer = ManageBuyOfferResult;
    type SetOptions = SetOptionsResult;
    type ChangeTrust = ChangeTrustResult;
    type AllowTrust = AllowTrustResult;
    type AccountMerge = AccountMergeResult;
    type Inflation = InflationResult;
    type ManageData = ManageDataResult;
    type BumpSequence = BumpSequenceResult;
    type CreateClaimableBalance = CreateClaimableBalanceResult;
    type ClaimClaimableBalance = ClaimClaimableBalanceResult;
    type BeginSponsoringFutureReserves = BeginSponsoringFutureReservesResult;
    type EndSponsoringFutureReserves = EndSponsoringFutureReservesResult;
    type RevokeAccountSponsorship = RevokeAccountSponsorshipResult;
    type RevokeTrustlineSponsorship = RevokeTrustlineSponsorshipResult;
    type RevokeOfferSponsorship = RevokeOfferSponsorshipResult;
    type RevokeDataSponsorship = RevokeDataSponsorshipResult;
    type RevokeClaimableBalanceSponsorship = RevokeClaimableBalanceSponsorshipResult;
    type RevokeLiquidityPoolSponsorship = RevokeLiquidityPoolSponsorshipResult;
    type RevokeSignerSponsorship = RevokeSignerSponsorshipResult;
    type Clawback = ClawbackResult;
    type ClawbackClaimableBalance = ClawbackClaimableBalanceResult;
    type SetTrustLineFlags = SetTrustLineFlagsResult;
    type LiquidityPoolDeposit = LiquidityPoolDepositResult;
    type LiquidityPoolWithdraw = LiquidityPoolWithdrawResult;
    type InvokeHostFunction = InvokeHostFunctionResult;
    type ExtendFootprintTTL = ExtendFootprintTTLResult;
    type RestoreFootprint = RestoreFootprintResult;
}
