import xdr from "../xdr.js";
import { OperationClass, ManageDataOpts } from "./types.js";
/**
 * This operation adds data entry to the ledger.
 * @function
 * @alias Operation.manageData
 * @param {object} opts Options object
 * @param {string} opts.name - The name of the data entry.
 * @param {string|Buffer} opts.value - The value of the data entry.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.ManageDataOp} Manage Data operation
 */
export declare function manageData(this: OperationClass, opts: ManageDataOpts): xdr.Operation;
