import xdr from "../xdr.js";
import { PathPaymentStrictSendOpts, OperationClass } from "./types.js";
/**
 * Creates a PathPaymentStrictSend operation.
 *
 * A `PathPaymentStrictSend` operation sends the specified amount to the
 * destination account crediting at least `destMin` of `destAsset`, optionally
 * through a path. XLM payments create the destination account if it does not
 * exist.
 *
 * @alias Operation.pathPaymentStrictSend
 * @see https://developers.stellar.org/docs/start/list-of-operations/#path-payment-strict-send
 *
 * @param opts - Options object
 * @param opts.sendAsset - asset to pay with
 * @param opts.sendAmount - amount of sendAsset to send (excluding fees)
 * @param opts.destination - destination account to send to
 * @param opts.destAsset - asset the destination will receive
 * @param opts.destMin - minimum amount of destAsset to be received
 * @param opts.path - array of Asset objects to use as the path
 * @param opts.source - The source account for the payment. Defaults to the transaction's source account.
 */
export declare function pathPaymentStrictSend(this: OperationClass, opts: PathPaymentStrictSendOpts): xdr.Operation;
