import xdr from "../xdr.js";
import { OperationClass, PaymentOpts } from "./types.js";
/**
 * Create a payment operation.
 *
 * @function
 * @alias Operation.payment
 * @see https://developers.stellar.org/docs/start/list-of-operations/#payment
 *
 * @param opts - options object
 * @param opts.destination - destination account ID
 * @param opts.asset - asset to send
 * @param opts.amount - amount to send
 * @param opts.source - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns The resulting payment operation (xdr.PaymentOp)
 */
export declare function payment(this: OperationClass, opts: PaymentOpts): xdr.Operation;
