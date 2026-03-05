import xdr from "../xdr.js";
export interface OperationAttributes {
    body: xdr.OperationBody;
    sourceAccount: xdr.MuxedAccount | null;
}
export interface OperationClass {
    setSourceAccount(opAttributes: OperationAttributes, opts: {
        source?: string;
  isValidAmount(value: string, allowZero?: boolean): boolean;
  _toXDRAmount(value: string): unknown;
  constructAmountRequirementsError(arg: string): string;
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
