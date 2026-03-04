import xdr from "../xdr.js";
interface InflationOpts {
    source?: string;
}
interface OperationAttributes {
    body: xdr.OperationBody;
    sourceAccount?: xdr.MuxedAccount | null;
}
interface OperationClass {
    setSourceAccount(opAttributes: OperationAttributes, opts: {
        source?: string;
    }): void;
}
/**
 * This operation generates the inflation.
 * @function
 * @alias Operation.inflation
 * @param {object} [opts] Options object
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.Operation} Inflation operation
 */
export declare function inflation(this: OperationClass, opts?: InflationOpts): xdr.Operation;
export {};
