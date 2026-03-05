import xdr from "../xdr.js";
import { BumpSequenceOpts, OperationClass } from "./types.js";
/**
 * This operation bumps sequence number.
 * @alias Operation.bumpSequence
 * @param opts - Options object
 * @param opts.bumpTo - Sequence number to bump to.
 * @param opts.source - The optional source account.
 */
export declare function bumpSequence(this: OperationClass, opts: BumpSequenceOpts): xdr.Operation;
