import xdr from "../xdr.js";
import { OperationClass, InflationOpts, OperationAttributes } from "./types.js";

/**
 * This operation generates the inflation.
 * @alias Operation.inflation
 * @param opts Options object
 * @param opts.source - The optional source account.
 * @returns An inflation operation.
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
