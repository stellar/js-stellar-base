import { Hyper } from "@stellar/js-xdr";
import xdr from "../xdr.js";
import {
  ManageBuyOfferOpts,
  OperationAttributes,
  OperationClass
} from "./types.js";

/**
 * Returns a XDR ManageBuyOfferOp. A "manage buy offer" operation creates, updates, or
 * deletes a buy offer.
 * @function
 * @alias Operation.manageBuyOffer
 * @param {object} opts Options object
 * @param {Asset} opts.selling - What you're selling.
 * @param {Asset} opts.buying - What you're buying.
 * @param {string} opts.buyAmount - The total amount you're buying. If 0, deletes the offer.
 * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `buying` in terms of `selling`.
 * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
 * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
 * @param {number|string} [opts.offerId ] - If `0`, will create a new offer (default). Otherwise, edits an exisiting offer.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
 * @returns {xdr.ManageBuyOfferOp} Manage Buy Offer operation
 */
export function manageBuyOffer(
  this: OperationClass,
  opts: ManageBuyOfferOpts
): xdr.Operation {
  if (!this.isValidAmount(opts.buyAmount, true)) {
    throw new TypeError(this.constructAmountRequirementsError("buyAmount"));
  }

  if (opts.price === undefined) {
    throw new TypeError("price argument is required");
  }

  const offerId = opts.offerId !== undefined ? opts.offerId.toString() : "0";

  const manageBuyOfferOp = new xdr.ManageBuyOfferOp({
    selling: opts.selling.toXDRObject(),
    buying: opts.buying.toXDRObject(),
    buyAmount: this._toXDRAmount(opts.buyAmount),
    price: this._toXDRPrice(opts.price),
    offerId: Hyper.fromString(offerId) as unknown as xdr.Int64
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.manageBuyOffer(manageBuyOfferOp)
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(
    opAttributes as {
      sourceAccount: xdr.MuxedAccount | null;
      body: xdr.OperationBody;
    }
  );
}
