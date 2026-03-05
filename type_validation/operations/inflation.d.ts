import xdr from "../xdr.js";
import { OperationClass, InflationOpts } from "./types.js";
/**
 * This operation generates the inflation.
 * @alias Operation.inflation
 * @param opts Options object
 * @param opts.source - The optional source account.
 * @returns An inflation operation.
 */
export declare function inflation(this: OperationClass, opts?: InflationOpts): xdr.Operation;
