import { Asset } from "../asset.js";
import { Address } from "../address.js";
import { Claimant } from "../claimant.js";
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
    isValidAmount(value: string, allowZero?: boolean): boolean;
    _toXDRAmount(value: string): unknown;
    constructAmountRequirementsError(arg: string): string;
    _checkUnsignedIntValue(name: string, value: number | string | undefined, isValidFunction?: ((value: number, name: string) => boolean) | null): number | undefined;
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
