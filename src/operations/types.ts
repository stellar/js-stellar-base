import { Asset } from "../asset.js";
import xdr from "../xdr.js";
import { Asset } from "../asset.js";

export interface OperationAttributes {
  body: xdr.OperationBody;
  sourceAccount: xdr.MuxedAccount | null;
}

// This can be removed once the Operation class in src/operation.ts is converted to a TypeScript class and the setSourceAccount method is defined on it.
export interface OperationClass {
  isValidAmount(value: string, allowZero?: boolean): boolean;
  constructAmountRequirementsError(arg: string): string;
  _toXDRAmount(value: string): xdr.Int64;
  _toXDRPrice(price: number | object | string): xdr.Price;
  setSourceAccount(
    opAttributes: OperationAttributes,
    opts: { source?: string }
  ): void;
  isValidAmount(value: string, allowZero?: boolean): boolean;
  _toXDRAmount(value: string): unknown;
  constructAmountRequirementsError(arg: string): string;
  _checkUnsignedIntValue(
    name: string,
    value: number | string | undefined,
    isValidFunction?: ((value: number, name: string) => boolean) | null
  ): number | undefined;
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

export interface BumpSequenceOpts {
  bumpTo: string;
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
