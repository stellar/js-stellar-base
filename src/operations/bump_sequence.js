import {default as xdr} from "../generated/stellar-xdr_generated";
import {Hyper} from "js-xdr";
import BigNumber from 'bignumber.js';
import isString from 'lodash/isString';

/**
 * This operation bumps sequence number.
 * @function
 * @alias Operation.bumpSequence
 * @param {object} opts
 * @param {string} opts.bumpTo - Sequence number to bump to.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.BumpSequenceOp}
 */
export const bumpSequence = function(opts) {
  let attributes = {};

  if (!isString(opts.bumpTo)) {
    throw new Error("bumpTo must be a string");
  }

  try {
    new BigNumber(opts.bumpTo);
  } catch (e) {
    throw new Error("bumpTo must be a stringified number");
  }

  attributes.bumpTo = Hyper.fromString(opts.bumpTo);

  let bumpSequenceOp = new xdr.BumpSequenceOp(attributes);

  let opAttributes = {};
  opAttributes.body = xdr.OperationBody.bumpSequence(bumpSequenceOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
};