import xdr from "../xdr.js";
export interface OperationAttributes {
    body: xdr.OperationBody;
    sourceAccount: xdr.MuxedAccount | null;
}
export interface OperationClass {
    setSourceAccount(opAttributes: OperationAttributes, opts: {
        source?: string;
    }): void;
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
