import xdr from "../xdr.js";
import { OperationClass, InflationOpts } from "./types.js";
/**
 * This operation generates the inflation.
 * @function
 * @alias Operation.inflation
 * @param {object} [opts] Options object
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.Operation} Inflation operation
 */
export declare function inflation(this: OperationClass, opts?: InflationOpts): xdr.Operation;
