import { Asset } from "../asset.js";
import { Address } from "../address.js";
import { Claimant } from "../claimant.js";
import { LiquidityPoolAsset } from "../liquidity_pool_asset.js";
import { LiquidityPoolId } from "../liquidity_pool_id.js";
import xdr from "../xdr.js";
export interface OperationAttributes {
    body: xdr.OperationBody;
    sourceAccount: xdr.MuxedAccount | null;
}
export interface OperationClass {
    invokeHostFunction(opts: InvokeHostFunctionOpts): xdr.Operation;
    isValidAmount(value: string, allowZero?: boolean): boolean;
    constructAmountRequirementsError(arg: string): string;
    _toXDRAmount(value: string): xdr.Int64;
    _toXDRPrice(price: number | object | string): xdr.Price;
    setSourceAccount(opAttributes: OperationAttributes, opts: {
        source?: string;
    }): void;
    _checkUnsignedIntValue(name: string, value: number | string | undefined, isValidFunction?: ((value: number, name: string) => boolean) | null): number | undefined;
}
export interface ChangeTrustOpts {
    asset: Asset | LiquidityPoolAsset;
    limit?: string;
    source?: string;
}
export interface RestoreFootprintOpts {
    source?: string;
}
export interface ManageDataOpts {
    name: string;
    value: Buffer | string | null;
    source?: string;
}
export interface InflationOpts {
    source?: string;
}
export interface ExtendFootprintTtlOpts {
    extendTo: number;
    source?: string;
}
export interface EndSponsoringFutureReservesOpts {
    source?: string;
}
export interface LiquidityPoolWithdrawOpts {
    liquidityPoolId: string;
    amount: string;
    minAmountA: string;
    minAmountB: string;
    source?: string;
}
export interface AllowTrustOpts {
    trustor: string;
    assetCode: string;
    authorize?: boolean | number;
    source?: string;
}
export interface BeginSponsoringFutureReservesOpts {
    sponsoredId: string;
    source?: string;
}
export interface TrustLineFlagMap {
    authorized?: boolean;
    authorizedToMaintainLiabilities?: boolean;
    clawbackEnabled?: boolean;
}
export interface SetTrustLineFlagsOpts {
    trustor: string;
    asset: Asset;
    flags: TrustLineFlagMap;
    source?: string;
}
export interface SignerOpts {
    ed25519PublicKey?: string;
    sha256Hash?: Buffer | string;
    preAuthTx?: Buffer | string;
    ed25519SignedPayload?: string;
    weight: number | string;
}
export interface SetOptionsOpts {
    inflationDest?: string;
    clearFlags?: number | string;
    setFlags?: number | string;
    masterWeight?: number | string;
    lowThreshold?: number | string;
    medThreshold?: number | string;
    highThreshold?: number | string;
    signer?: SignerOpts;
    homeDomain?: string;
    source?: string;
}
export interface CreatePassiveSellOfferOpts {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: number | object | string;
    source?: string;
}
export interface ManageSellOfferOpts extends CreatePassiveSellOfferOpts {
    offerId?: number | string;
}
export interface ManageBuyOfferOpts {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: number | object | string;
    offerId?: number | string;
    source?: string;
}
export interface PathPaymentStrictSendOpts {
    sendAsset: Asset;
    sendAmount: string;
    destination: string;
    destAsset: Asset;
    destMin: string;
    path?: Asset[];
    source?: string;
}
export interface CreateClaimableBalanceOpts {
    asset: Asset;
    amount: string;
    claimants: Claimant[];
    source?: string;
}
export interface ClaimClaimableBalanceOpts {
    balanceId: string;
    source?: string;
}
export interface ClawbackClaimableBalanceOpts {
    balanceId: string;
    source?: string;
}
export interface BumpSequenceOpts {
    bumpTo: string;
    source?: string;
}
export interface SignerKeyOptions {
    ed25519PublicKey?: string;
    sha256Hash?: Buffer | string;
    preAuthTx?: Buffer | string;
    ed25519SignedPayload?: string;
}
export interface RevokeAccountSponsorshipOpts {
    account: string;
    source?: string;
}
export interface RevokeTrustlineSponsorshipOpts {
    account: string;
    asset: Asset | LiquidityPoolId;
    source?: string;
}
export interface RevokeOfferSponsorshipOpts {
    seller: string;
    offerId: string;
    source?: string;
}
export interface RevokeDataSponsorshipOpts {
    account: string;
    name: string;
    source?: string;
}
export interface RevokeClaimableBalanceSponsorshipOpts {
    balanceId: string;
    source?: string;
}
export interface RevokeLiquidityPoolSponsorshipOpts {
    liquidityPoolId: string;
    source?: string;
}
export interface RevokeSignerSponsorshipOpts {
    account: string;
    signer: SignerKeyOptions;
    source?: string;
}
export interface LiquidityPoolDepositOpts {
    liquidityPoolId: string;
    maxAmountA: string;
    maxAmountB: string;
    minPrice: number | object | string;
    maxPrice: number | object | string;
    source?: string;
}
export interface InvokeHostFunctionOpts {
    func: xdr.HostFunction;
    auth?: xdr.SorobanAuthorizationEntry[];
    source?: string;
}
export interface InvokeContractFunctionOpts {
    contract: string;
    function: string;
    args: xdr.ScVal[];
    auth?: xdr.SorobanAuthorizationEntry[];
    source?: string;
}
export interface CreateCustomContractOpts {
    address: Address;
    wasmHash: Buffer | Uint8Array;
    constructorArgs?: xdr.ScVal[];
    salt?: Buffer | Uint8Array;
    auth?: xdr.SorobanAuthorizationEntry[];
    source?: string;
}
export interface CreateStellarAssetContractOpts {
    asset: Asset | string;
    source?: string;
}
export interface UploadContractWasmOpts {
    wasm: Buffer | Uint8Array;
    source?: string;
}
export interface CreateAccountOpts {
    destination: string;
    startingBalance: string;
    source?: string;
}
export interface AccountMergeOpts {
    destination: string;
    source?: string;
}
export interface PaymentOpts {
    destination: string;
    asset: Asset;
    amount: string;
    source?: string;
}
export interface ClawbackOpts {
    asset: Asset;
    amount: string;
    from: string;
    source?: string;
}
export interface PathPaymentStrictReceiveOpts {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path?: Asset[];
    source?: string;
}
export declare namespace OperationType {
    type CreateAccount = "createAccount";
    type Payment = "payment";
    type PathPaymentStrictReceive = "pathPaymentStrictReceive";
    type PathPaymentStrictSend = "pathPaymentStrictSend";
    type CreatePassiveSellOffer = "createPassiveSellOffer";
    type ManageSellOffer = "manageSellOffer";
    type ManageBuyOffer = "manageBuyOffer";
    type SetOptions = "setOptions";
    type ChangeTrust = "changeTrust";
    type AllowTrust = "allowTrust";
    type AccountMerge = "accountMerge";
    type Inflation = "inflation";
    type ManageData = "manageData";
    type BumpSequence = "bumpSequence";
    type CreateClaimableBalance = "createClaimableBalance";
    type ClaimClaimableBalance = "claimClaimableBalance";
    type BeginSponsoringFutureReserves = "beginSponsoringFutureReserves";
    type EndSponsoringFutureReserves = "endSponsoringFutureReserves";
    type RevokeSponsorship = "revokeSponsorship";
    type Clawback = "clawback";
    type ClawbackClaimableBalance = "clawbackClaimableBalance";
    type SetTrustLineFlags = "setTrustLineFlags";
    type LiquidityPoolDeposit = "liquidityPoolDeposit";
    type LiquidityPoolWithdraw = "liquidityPoolWithdraw";
    type InvokeHostFunction = "invokeHostFunction";
    type ExtendFootprintTTL = "extendFootprintTtl";
    type RestoreFootprint = "restoreFootprint";
}
export type OperationType = OperationType.AccountMerge | OperationType.AllowTrust | OperationType.BeginSponsoringFutureReserves | OperationType.BumpSequence | OperationType.ChangeTrust | OperationType.ClaimClaimableBalance | OperationType.Clawback | OperationType.ClawbackClaimableBalance | OperationType.CreateAccount | OperationType.CreateClaimableBalance | OperationType.CreatePassiveSellOffer | OperationType.EndSponsoringFutureReserves | OperationType.ExtendFootprintTTL | OperationType.Inflation | OperationType.InvokeHostFunction | OperationType.LiquidityPoolDeposit | OperationType.LiquidityPoolWithdraw | OperationType.ManageBuyOffer | OperationType.ManageData | OperationType.ManageSellOffer | OperationType.PathPaymentStrictReceive | OperationType.PathPaymentStrictSend | OperationType.Payment | OperationType.RestoreFootprint | OperationType.RevokeSponsorship | OperationType.SetOptions | OperationType.SetTrustLineFlags;
export declare namespace AuthFlag {
    type required = 1;
    type revocable = 2;
    type immutable = 4;
    type clawbackEnabled = 8;
}
export type AuthFlag = AuthFlag.clawbackEnabled | AuthFlag.immutable | AuthFlag.required | AuthFlag.revocable;
export declare namespace TrustLineFlag {
    type deauthorize = 0;
    type authorize = 1;
    type authorizeToMaintainLiabilities = 2;
}
export type TrustLineFlag = TrustLineFlag.authorize | TrustLineFlag.authorizeToMaintainLiabilities | TrustLineFlag.deauthorize;
export declare namespace Signer {
    interface Ed25519PublicKey {
        ed25519PublicKey: string;
        weight?: number | string;
    }
    interface Sha256Hash {
        sha256Hash: Buffer | string;
        weight?: number | string;
    }
    interface PreAuthTx {
        preAuthTx: Buffer | string;
        weight?: number | string;
    }
    interface Ed25519SignedPayload {
        ed25519SignedPayload: string;
        weight?: number | string;
    }
}
export interface BaseOperation<T extends OperationType = OperationType> {
    type: T;
    source?: string;
}
export interface CreateAccountResult extends BaseOperation<OperationType.CreateAccount> {
    destination: string;
    startingBalance: string;
}
export interface PaymentResult extends BaseOperation<OperationType.Payment> {
    destination: string;
    asset: Asset;
    amount: string;
}
export interface PathPaymentStrictReceiveResult extends BaseOperation<OperationType.PathPaymentStrictReceive> {
    sendAsset: Asset;
    sendMax: string;
    destination: string;
    destAsset: Asset;
    destAmount: string;
    path: Asset[];
}
export interface PathPaymentStrictSendResult extends BaseOperation<OperationType.PathPaymentStrictSend> {
    sendAsset: Asset;
    sendAmount: string;
    destination: string;
    destAsset: Asset;
    destMin: string;
    path: Asset[];
}
export interface CreatePassiveSellOfferResult extends BaseOperation<OperationType.CreatePassiveSellOffer> {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: string;
}
export interface ManageSellOfferResult extends BaseOperation<OperationType.ManageSellOffer> {
    selling: Asset;
    buying: Asset;
    amount: string;
    price: string;
    offerId: string;
}
export interface ManageBuyOfferResult extends BaseOperation<OperationType.ManageBuyOffer> {
    selling: Asset;
    buying: Asset;
    buyAmount: string;
    price: string;
    offerId: string;
}
export interface SetOptionsResult extends BaseOperation<OperationType.SetOptions> {
    inflationDest?: string;
    clearFlags?: AuthFlag;
    setFlags?: AuthFlag;
    masterWeight?: number;
    lowThreshold?: number;
    medThreshold?: number;
    highThreshold?: number;
    homeDomain?: string;
    signer?: Signer.Ed25519PublicKey | Signer.Ed25519SignedPayload | Signer.PreAuthTx | Signer.Sha256Hash;
}
export interface ChangeTrustResult extends BaseOperation<OperationType.ChangeTrust> {
    line: Asset | LiquidityPoolAsset;
    limit: string;
}
export interface AllowTrustResult extends BaseOperation<OperationType.AllowTrust> {
    trustor: string;
    assetCode: string;
    authorize: TrustLineFlag | boolean | undefined;
}
export interface AccountMergeResult extends BaseOperation<OperationType.AccountMerge> {
    destination: string;
}
export type InflationResult = BaseOperation<OperationType.Inflation>;
export interface ManageDataResult extends BaseOperation<OperationType.ManageData> {
    name: string;
    value?: Buffer;
}
export interface BumpSequenceResult extends BaseOperation<OperationType.BumpSequence> {
    bumpTo: string;
}
export interface CreateClaimableBalanceResult extends BaseOperation<OperationType.CreateClaimableBalance> {
    asset: Asset;
    amount: string;
    claimants: Claimant[];
}
export interface ClaimClaimableBalanceResult extends BaseOperation<OperationType.ClaimClaimableBalance> {
    balanceId: string;
}
export interface BeginSponsoringFutureReservesResult extends BaseOperation<OperationType.BeginSponsoringFutureReserves> {
    sponsoredId: string;
}
export type EndSponsoringFutureReservesResult = BaseOperation<OperationType.EndSponsoringFutureReserves>;
export interface RevokeAccountSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
}
export interface RevokeTrustlineSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    asset: Asset | LiquidityPoolId;
}
export interface RevokeOfferSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    seller: string;
    offerId: string;
}
export interface RevokeDataSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    name: string;
}
export interface RevokeClaimableBalanceSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    balanceId: string;
}
export interface RevokeLiquidityPoolSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    liquidityPoolId: string;
}
export interface RevokeSignerSponsorshipResult extends BaseOperation<OperationType.RevokeSponsorship> {
    account: string;
    signer: SignerKeyOptions;
}
export interface ClawbackResult extends BaseOperation<OperationType.Clawback> {
    asset: Asset;
    amount: string;
    from: string;
}
export interface ClawbackClaimableBalanceResult extends BaseOperation<OperationType.ClawbackClaimableBalance> {
    balanceId: string;
}
export interface SetTrustLineFlagsResult extends BaseOperation<OperationType.SetTrustLineFlags> {
    trustor: string;
    asset: Asset;
    flags: {
        authorized?: boolean;
        authorizedToMaintainLiabilities?: boolean;
        clawbackEnabled?: boolean;
    };
}
export interface LiquidityPoolDepositResult extends BaseOperation<OperationType.LiquidityPoolDeposit> {
    liquidityPoolId: string;
    maxAmountA: string;
    maxAmountB: string;
    minPrice: string;
    maxPrice: string;
}
export interface LiquidityPoolWithdrawResult extends BaseOperation<OperationType.LiquidityPoolWithdraw> {
    liquidityPoolId: string;
    amount: string;
    minAmountA: string;
    minAmountB: string;
}
export interface InvokeHostFunctionResult extends BaseOperation<OperationType.InvokeHostFunction> {
    func: xdr.HostFunction;
    auth?: xdr.SorobanAuthorizationEntry[];
}
export interface ExtendFootprintTTLResult extends BaseOperation<OperationType.ExtendFootprintTTL> {
    extendTo: number;
}
export type RestoreFootprintResult = BaseOperation<OperationType.RestoreFootprint>;
/**
 * Union of all possible operation result objects returned by Operation.fromXDRObject.
 *
 * TODO: Once src/index.js is migrated to src/index.ts, re-export this as the `Operation`
 * type alongside the Operation class:
 *   export type { OperationRecord as Operation } from "./operations/types.js"
 * This preserves the public `export type Operation` from types/index.d.ts without
 * conflicting with the class name in the same module.
 */
export type OperationRecord = AccountMergeResult | AllowTrustResult | BeginSponsoringFutureReservesResult | BumpSequenceResult | ChangeTrustResult | ClaimClaimableBalanceResult | ClawbackClaimableBalanceResult | ClawbackResult | CreateAccountResult | CreateClaimableBalanceResult | CreatePassiveSellOfferResult | EndSponsoringFutureReservesResult | ExtendFootprintTTLResult | InflationResult | InvokeHostFunctionResult | LiquidityPoolDepositResult | LiquidityPoolWithdrawResult | ManageBuyOfferResult | ManageDataResult | ManageSellOfferResult | PathPaymentStrictReceiveResult | PathPaymentStrictSendResult | PaymentResult | RestoreFootprintResult | RevokeAccountSponsorshipResult | RevokeClaimableBalanceSponsorshipResult | RevokeDataSponsorshipResult | RevokeLiquidityPoolSponsorshipResult | RevokeOfferSponsorshipResult | RevokeSignerSponsorshipResult | RevokeTrustlineSponsorshipResult | SetOptionsResult | SetTrustLineFlagsResult;
