import {default as xdr} from "../generated/stellar-xdr_generated";
 
/**
  * This operation generates the inflation.
  * @function
  * @alias Operation.inflation
  * @param {object} [opts]
  * @param {string} [opts.source] - The optional source account.
  * @returns {xdr.InflationOp}
  */
export const inflation = function(opts={}) {
    let opAttributes = {};
    opAttributes.body = xdr.OperationBody.inflation();
    this.setSourceAccount(opAttributes, opts);
    return new xdr.Operation(opAttributes);
};