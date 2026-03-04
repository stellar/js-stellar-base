import { Hyper } from "@stellar/js-xdr";
import xdr from "../xdr.js";
import {
  ManageSellOfferOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * Returns a XDR ManageSellOfferOp. A "manage sell offer" operation creates, updates, or
 * deletes an offer.
 * @function
 * @alias Operation.manageSellOffer
 * @param {object} opts Options object
 * @param {Asset} opts.selling - What you're selling.
 * @param {Asset} opts.buying - What you're buying.
 * @param {string} opts.amount - The total amount you're selling. If 0, deletes the offer.
 * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `selling` in terms of `buying`.
 * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
 * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
 * @param {number|string} [opts.offerId ] - If `0`, will create a new offer (default). Otherwise, edits an exisiting offer.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
 * @returns {xdr.ManageSellOfferOp} Manage Sell Offer operation
 */
export function manageSellOffer(
  this: OperationClass,
  opts: ManageSellOfferOpts
): xdr.Operation {
  if (!this.isValidAmount(opts.amount, true)) {
    throw new TypeError(this.constructAmountRequirementsError("amount"));
  }

  if (opts.price === undefined) {
    throw new TypeError("price argument is required");
  }

  const offerId = opts.offerId !== undefined ? opts.offerId.toString() : "0";

  const manageSellOfferOp = new xdr.ManageSellOfferOp({
    selling: opts.selling.toXDRObject(),
    buying: opts.buying.toXDRObject(),
    amount: this._toXDRAmount(opts.amount),
    price: this._toXDRPrice(opts.price),
    offerId: Hyper.fromString(offerId) as unknown as xdr.Int64
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.manageSellOffer(manageSellOfferOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(
    opAttributes as {
      sourceAccount: xdr.MuxedAccount | null;
      body: xdr.OperationBody;
    }
  );
}
