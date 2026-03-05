import xdr from "../xdr.js";
import { CreatePassiveSellOfferOpts, OperationClass } from "./types.js";
/**
 * Returns a XDR CreatePasiveSellOfferOp. A "create passive offer" operation creates an
 * offer that won't consume a counter offer that exactly matches this offer. This is
 * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
 * to manage this offer after using this operation to create it.
 * @alias Operation.createPassiveSellOffer
 * @param opts Options object
 * @param opts.selling - What you're selling.
 * @param opts.buying - What you're buying.
 * @param opts.amount - The total amount you're selling. If 0, deletes the offer.
 * @param opts.price - Price of 1 unit of `selling` in terms of `buying`.
 * @param opts.price.n - If `opts.price` is an object: the price numerator
 * @param opts.price.d - If `opts.price` is an object: the price denominator
 * @param opts.source - The source account (defaults to transaction source).
 * @throws Throws `Error` when the best rational approximation of `price` cannot be found.
 */
export declare function createPassiveSellOffer(this: OperationClass, opts: CreatePassiveSellOfferOpts): xdr.Operation;
