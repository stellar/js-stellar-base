import xdr from "../xdr.js";
import {
  InflationOpts,
  InflationResult,
  OperationAttributes,
  OperationClass,
} from "./types.js";

/**
 * This operation generates the inflation.
 * @param opts - Options object
 * @param opts.source - The optional source account.
 */
export function inflation(
  this: OperationClass,
  opts: InflationOpts = {},
): xdr.Operation<InflationResult> {
  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.inflation(),
  };
  this.setSourceAccount(opAttributes, opts);
  return new xdr.Operation(opAttributes);
}
