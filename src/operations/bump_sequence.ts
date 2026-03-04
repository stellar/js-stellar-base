import { Hyper } from "@stellar/js-xdr";
import BigNumber from "../util/bignumber.js";
import xdr from "../xdr.js";
import {
  BumpSequenceOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * This operation bumps sequence number.
 * @function
 * @alias Operation.bumpSequence
 * @param {object} opts Options object
 * @param {string} opts.bumpTo - Sequence number to bump to.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.BumpSequenceOp} Operation
 */
export function bumpSequence(
  this: OperationClass,
  opts: BumpSequenceOpts
): xdr.Operation {
  if (typeof opts.bumpTo !== "string") {
    throw new Error("bumpTo must be a string");
  }

  try {
    // eslint-disable-next-line no-new
    new BigNumber(opts.bumpTo);
  } catch {
    throw new Error("bumpTo must be a stringified number");
  }

  const bumpSequenceOp = new xdr.BumpSequenceOp({
    bumpTo: Hyper.fromString(opts.bumpTo) as unknown as xdr.Int64
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.bumpSequence(bumpSequenceOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(
    opAttributes as {
      sourceAccount: xdr.MuxedAccount | null;
      body: xdr.OperationBody;
    }
  );
}
