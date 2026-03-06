import xdr from "../xdr.js";
import { OperationClass, PathPaymentStrictReceiveOpts } from "./types.js";
/**
 * Creates a PathPaymentStrictReceive operation.
 *
 * A `PathPaymentStrictReceive` operation sends the specified amount to the
 * destination account. It credits the destination with `destAmount` of
 * `destAsset`, while debiting at most `sendMax` of `sendAsset` from the source.
 * The transfer optionally occurs through a path. XLM payments create the
 * destination account if it does not exist.
 *
 * @function
 * @alias Operation.pathPaymentStrictReceive
 * @see https://developers.stellar.org/docs/start/list-of-operations/#path-payment-strict-receive
 *
 * @param opts - Options object
 * @param opts.sendAsset - asset to pay with
 * @param opts.sendMax - maximum amount of sendAsset to send
 * @param opts.destination - destination account to send to
 * @param opts.destAsset - asset the destination will receive
 * @param opts.destAmount - amount the destination receives
 * @param opts.path - array of Asset objects to use as the path
 * @param opts.source - The source account for the payment.
 *     Defaults to the transaction's source account.
 *
 * @returns The resulting path payment strict receive op
 */
export declare function pathPaymentStrictReceive(this: OperationClass, opts: PathPaymentStrictReceiveOpts): xdr.Operation;
