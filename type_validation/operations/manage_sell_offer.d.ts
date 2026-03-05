import xdr from "../xdr.js";
import { ManageSellOfferOpts, OperationClass } from "./types.js";
/**
 * Returns a XDR ManageSellOfferOp. A "manage sell offer" operation creates, updates, or
 * deletes an offer.
 * @alias Operation.manageSellOffer
 * @param opts - Options object
 * @param opts.selling - What you're selling.
 * @param opts.buying - What you're buying.
 * @param opts.amount - The total amount you're selling. If 0, deletes the offer.
 * @param opts.price - Price of 1 unit of `selling` in terms of `buying`.
 * @param opts.price.n - If `opts.price` is an object: the price numerator
 * @param opts.price.d - If `opts.price` is an object: the price denominator
 * @param opts.offerId - If `0`, will create a new offer (default). Otherwise, edits an existing offer.
 * @param opts.source - The source account (defaults to transaction source).
 * @throws Throws `Error` when the best rational approximation of `price` cannot be found.
 */
export declare function manageSellOffer(this: OperationClass, opts: ManageSellOfferOpts): xdr.Operation;
