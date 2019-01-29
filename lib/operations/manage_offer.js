'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manageOffer = manageOffer;

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _jsXdr = require('js-xdr');

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a XDR ManageOfferOp. A "manage offer" operation creates, updates, or
 * deletes an offer.
 * @function
 * @alias Operation.manageOffer
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
 * @returns {xdr.ManageOfferOp} Manage Offer operation
 */
function manageOffer(opts) {
  var attributes = {};
  attributes.selling = opts.selling.toXDRObject();
  attributes.buying = opts.buying.toXDRObject();
  if (!this.isValidAmount(opts.amount, true)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  if ((0, _isUndefined2.default)(opts.price)) {
    throw new TypeError('price argument is required');
  }
  attributes.price = this._toXDRPrice(opts.price);

  if (!(0, _isUndefined2.default)(opts.offerId)) {
    opts.offerId = opts.offerId.toString();
  } else {
    opts.offerId = '0';
  }

  attributes.offerId = _jsXdr.UnsignedHyper.fromString(opts.offerId);
  var manageOfferOp = new _stellarXdr_generated2.default.ManageOfferOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.manageOffer(manageOfferOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}