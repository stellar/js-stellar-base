import isUndefined from 'lodash/isUndefined';
import { Hyper } from 'js-xdr';
import xdr from '../generated/stellar-xdr_generated';
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
export function manageSellOffer(opts) {
  const attributes = {};
  attributes.selling = opts.selling.toXDRObject();
  attributes.buying = opts.buying.toXDRObject();
  if (!this.isValidAmount(opts.amount, true)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  if (isUndefined(opts.price)) {
    throw new TypeError('price argument is required');
  }
  attributes.price = this._toXDRPrice(opts.price);

  if (!isUndefined(opts.offerId)) {
    opts.offerId = opts.offerId.toString();
  } else {
    opts.offerId = '0';
  }

  attributes.offerId = Hyper.fromString(opts.offerId);
  const manageSellOfferOp = new xdr.ManageSellOfferOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.manageSellOffer(manageSellOfferOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
