'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPassiveOffer = createPassiveOffer;

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _stellarXdr_generated = require('../generated/stellar-xdr_generated');

var _stellarXdr_generated2 = _interopRequireDefault(_stellarXdr_generated);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a XDR CreatePasiveOfferOp. A "create passive offer" operation creates an
 * offer that won't consume a counter offer that exactly matches this offer. This is
 * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
 * to manage this offer after using this operation to create it.
 * @function
 * @alias Operation.createPassiveOffer
 * @param {object} opts Options object
 * @param {Asset} opts.selling - What you're selling.
 * @param {Asset} opts.buying - What you're buying.
 * @param {string} opts.amount - The total amount you're selling. If 0, deletes the offer.
 * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `selling` in terms of `buying`.
 * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
 * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
 * @returns {xdr.CreatePassiveOfferOp} Create Passive Offer operation
 */
function createPassiveOffer(opts) {
  var attributes = {};
  attributes.selling = opts.selling.toXDRObject();
  attributes.buying = opts.buying.toXDRObject();
  if (!this.isValidAmount(opts.amount)) {
    throw new TypeError(this.constructAmountRequirementsError('amount'));
  }
  attributes.amount = this._toXDRAmount(opts.amount);
  if ((0, _isUndefined2.default)(opts.price)) {
    throw new TypeError('price argument is required');
  }
  attributes.price = this._toXDRPrice(opts.price);
  var createPassiveOfferOp = new _stellarXdr_generated2.default.CreatePassiveOfferOp(attributes);

  var opAttributes = {};
  opAttributes.body = _stellarXdr_generated2.default.OperationBody.createPassiveOffer(createPassiveOfferOp);
  this.setSourceAccount(opAttributes, opts);

  return new _stellarXdr_generated2.default.Operation(opAttributes);
}