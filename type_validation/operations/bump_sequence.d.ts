import xdr from "../xdr.js";
import { BumpSequenceOpts, OperationClass } from "./types.js";
/**
 * This operation bumps sequence number.
 * @function
 * @alias Operation.bumpSequence
 * @param {object} opts Options object
 * @param {string} opts.bumpTo - Sequence number to bump to.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.BumpSequenceOp} Operation
 */
export declare function bumpSequence(this: OperationClass, opts: BumpSequenceOpts): xdr.Operation;
