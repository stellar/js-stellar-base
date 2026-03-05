import xdr from "../xdr.js";
import { OperationClass, ManageDataOpts } from "./types.js";
/**
 * This operation adds data entry to the ledger.
 * @alias Operation.manageData
 * @param opts Options object
 * @param opts.name - The name of the data entry.
 * @param opts.value - The value of the data entry.
 * @param opts.source - The optional source account.
 * @returns A Manage Data operation
 */
export declare function manageData(this: OperationClass, opts: ManageDataOpts): xdr.Operation;
