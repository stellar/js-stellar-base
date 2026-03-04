import xdr from "../xdr.js";
import { OperationClass, InflationOpts, OperationAttributes } from "./types.js";

/**
 * This operation generates the inflation.
 * @function
 * @alias Operation.inflation
 * @param {object} [opts] Options object
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.Operation} Inflation operation
 */
export function inflation(
  this: OperationClass,
  opts: InflationOpts = {}
): xdr.Operation {
  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.inflation()
  };
  this.setSourceAccount(opAttributes, opts);
  return new xdr.Operation(opAttributes);
}
