import { Asset } from "../asset.js";
import xdr from "../xdr.js";

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

export interface LiquidityPoolDepositOpts {
  liquidityPoolId: string;
  maxAmountA: string;
  maxAmountB: string;
  minPrice: number | object | string;
  maxPrice: number | object | string;
  source?: string;
}
