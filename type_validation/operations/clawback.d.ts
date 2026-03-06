import xdr from "../xdr.js";
import { ClawbackOpts, OperationClass } from "./types.js";
/**
 * Creates a clawback operation.
 *
 * @function
 * @alias Operation.clawback
 *
 * @param opts - Options object
 * @param opts.asset - The asset being clawed back.
 * @param opts.amount - The amount of the asset to claw back.
 * @param opts.from - The public key of the (optionally-muxed)
 *     account to claw back from.
 * @param opts.source - The source account for the operation.
 *     Defaults to the transaction's source account.
 *
 * @returns The clawback operation
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#clawback-operation
 */
export declare function clawback(this: OperationClass, opts: ClawbackOpts): xdr.Operation;
