import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';
import { Operation, OperationOptions } from '../@types/operation';
import { xdr as xdrDef } from '../@types/xdr';
import padEnd from 'lodash/padEnd';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import BigNumber from 'bignumber.js';
import { Hyper } from 'js-xdr';
import { best_r } from '../util/continued_fraction';

export { pathPayment } from './path_payment';
export { payment } from './payment';
export { setOptions } from './set_options';

const ONE = 10000000;
const MAX_INT64 = '9223372036854775807';

export abstract class BaseOperation {
  // TS-TODO: remove any
  static setSourceAccount(opAttributes: any, opts: any) {
    if (opts.source) {
      if (!StrKey.isValidEd25519PublicKey(opts.source)) {
        throw new Error('Source address is invalid');
      }
      opAttributes.sourceAccount = Keypair.fromPublicKey(
        opts.source
      ).xdrAccountId();
    }
  }

  static constructAmountRequirementsError(arg: string) {
    return `${arg} argument must be of type String, represent a positive number and have at most 7 digits after the decimal`;
  }

  static isValidAmount(value: string, allowZero = false) {
    if (!isString(value)) {
      return false;
    }

    let amount;
    try {
      amount = new BigNumber(value);
    } catch (e) {
      return false;
    }

    if (
      // == 0
      (!allowZero && amount.isZero()) ||
      // < 0
      amount.isNegative() ||
      // > Max value
      amount.times(ONE).greaterThan(new BigNumber(MAX_INT64).toString()) ||
      // Decimal places (max 7)
      amount.decimalPlaces() > 7 ||
      // NaN or Infinity
      amount.isNaN() ||
      !amount.isFinite()
    ) {
      return false;
    }

    return true;
  }

  /**
   * @private
   * @param {string|BigNumber} value Value
   * @returns {Hyper} XDR amount
   */
  static _toXDRAmount(value: string | BigNumber): Hyper {
    const amount = new BigNumber(value).mul(ONE);
    return Hyper.fromString(amount.toString());
  }

  // TS-TODO: Create price interface an use here.
  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {object} XDR price object
   */
  static _toXDRPrice(price: any) {
    let xdrObject;
    if (price.n && price.d) {
      xdrObject = new xdr.Price(price);
    } else {
      price = new BigNumber(price);
      const approx = best_r(price);
      xdrObject = new xdr.Price({
        n: parseInt(approx[0], 10),
        d: parseInt(approx[1], 10)
      });
    }

    if (xdrObject.n() < 0 || xdrObject.d() < 0) {
      throw new Error('price must be positive');
    }

    return xdrObject;
  }

  /**
   * Transfers native balance to destination account.
   * @function
   * @alias Operation.accountMerge
   * @param {object} opts Options object
   * @param {string} opts.destination - Destination to merge the source account into.
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @returns {xdr.AccountMergeOp} Account Merge operation
   */
  static accountMerge(opts: OperationOptions.AccountMerge): xdrDef.Operation<Operation.AccountMerge> {
    const opAttributes = {};
    if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
      throw new Error('destination is invalid');
    }
    opAttributes.body = xdr.OperationBody.accountMerge(
      Keypair.fromPublicKey(opts.destination).xdrAccountId()
    );
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
   * account to hold your account's credit for a given asset.
   * @function
   * @alias Operation.allowTrust
   * @param {object} opts Options object
   * @param {string} opts.trustor - The trusting account (the one being authorized)
   * @param {string} opts.assetCode - The asset code being authorized.
   * @param {boolean} opts.authorize - True to authorize the line, false to deauthorize.
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @returns {xdr.AllowTrustOp} Allow Trust operation
   */
  static allowTrust(opts: OperationOptions.AllowTrust): xdrDef.Operation<Operation.AllowTrust> {
    if (!StrKey.isValidEd25519PublicKey(opts.trustor)) {
      throw new Error('trustor is invalid');
    }
    // TS-TODO: Maybe use conditional types for attributes
    const attributes = {};
    attributes.trustor = Keypair.fromPublicKey(opts.trustor).xdrAccountId();
    if (opts.assetCode.length <= 4) {
      const code = padEnd(opts.assetCode, 4, '\0');
      attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
    } else if (opts.assetCode.length <= 12) {
      const code = padEnd(opts.assetCode, 12, '\0');
      attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum12(code);
    } else {
      throw new Error('Asset code must be 12 characters at max.');
    }
    attributes.authorize = opts.authorize;
    const allowTrustOp = new xdr.AllowTrustOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.allowTrust(allowTrustOp);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * This operation bumps sequence number.
   * @function
   * @alias Operation.bumpSequence
   * @param {object} opts Options object
   * @param {string} opts.bumpTo - Sequence number to bump to.
   * @param {string} [opts.source] - The optional source account.
   * @returns {xdr.BumpSequenceOp} Operation
   */
  static bumpSequence(opts: OperationOptions.BumpSequence): xdrDef.Operation<Operation.BumpSequence> {
    const attributes = {};

    if (!isString(opts.bumpTo)) {
      throw new Error('bumpTo must be a string');
    }

    try {
      // eslint-disable-next-line no-new
      new BigNumber(opts.bumpTo);
    } catch (e) {
      throw new Error('bumpTo must be a stringified number');
    }

    attributes.bumpTo = Hyper.fromString(opts.bumpTo);

    const bumpSequenceOp = new xdr.BumpSequenceOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.bumpSequence(bumpSequenceOp);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
   * trust line for a given asset from the source account to another. The issuer being
   * trusted and the asset code are in the given Asset object.
   * @function
   * @alias Operation.changeTrust
   * @param {object} opts Options object
   * @param {Asset} opts.asset - The asset for the trust line.
   * @param {string} [opts.limit] - The limit for the asset, defaults to max int64.
   *                                If the limit is set to "0" it deletes the trustline.
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @returns {xdr.ChangeTrustOp} Change Trust operation
   */
  static changeTrust(opts: OperationOptions.ChangeTrust): xdrDef.Operation<Operation.ChangeTrust> {
    const attributes = {};
    attributes.line = opts.asset.toXDRObject();
    if (!isUndefined(opts.limit) && !this.isValidAmount(opts.limit, true)) {
      throw new TypeError(this.constructAmountRequirementsError('limit'));
    }

    if (opts.limit) {
      attributes.limit = this._toXDRAmount(opts.limit);
    } else {
      attributes.limit = Hyper.fromString(new BigNumber(MAX_INT64).toString());
    }

    if (opts.source) {
      attributes.source = opts.source.masterKeypair;
    }
    const changeTrustOP = new xdr.ChangeTrustOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.changeTrust(changeTrustOP);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * Create and fund a non existent account.
   * @function
   * @alias Operation.createAccount
   * @param {object} opts Options object
   * @param {string} opts.destination - Destination account ID to create an account for.
   * @param {string} opts.startingBalance - Amount in XLM the account should be funded for. Must be greater
   *                                   than the [reserve balance amount](https://www.stellar.org/developers/learn/concepts/fees.html).
   * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
   * @returns {xdr.CreateAccountOp} Create account operation
   */
  static createAccount(opts: OperationOptions.CreateAccount): xdrDef.Operation<Operation.CreateAccount> {
    if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
      throw new Error('destination is invalid');
    }
    if (!this.isValidAmount(opts.startingBalance)) {
      throw new TypeError(
        this.constructAmountRequirementsError('startingBalance')
      );
    }
    const attributes = {};
    attributes.destination = Keypair.fromPublicKey(
      opts.destination
    ).xdrAccountId();
    attributes.startingBalance = this._toXDRAmount(opts.startingBalance);
    const createAccountOp = new xdr.CreateAccountOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.createAccount(createAccountOp);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * Returns a XDR CreatePasiveSellOfferOp. A "create passive offer" operation creates an
   * offer that won't consume a counter offer that exactly matches this offer. This is
   * useful for offers just used as 1:1 exchanges for path payments. Use manage offer
   * to manage this offer after using this operation to create it.
   * @function
   * @alias Operation.createPassiveSellOffer
   * @param {object} opts Options object
   * @param {Asset} opts.selling - What you're selling.
   * @param {Asset} opts.buying - What you're buying.
   * @param {string} opts.amount - The total amount you're selling. If 0, deletes the offer.
   * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `selling` in terms of `buying`.
   * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
   * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
   * @returns {xdr.CreatePassiveSellOfferOp} Create Passive Sell Offer operation
   */
  static createPassiveSellOffer(opts: OperationOptions.CreatePassiveSellOffer): xdrDef.Operation<Operation.CreatePassiveSellOffer> {
    const attributes = {};
    attributes.selling = opts.selling.toXDRObject();
    attributes.buying = opts.buying.toXDRObject();
    if (!this.isValidAmount(opts.amount)) {
      throw new TypeError(this.constructAmountRequirementsError('amount'));
    }
    attributes.amount = this._toXDRAmount(opts.amount);
    if (isUndefined(opts.price)) {
      throw new TypeError('price argument is required');
    }
    attributes.price = this._toXDRPrice(opts.price);
    const createPassiveSellOfferOp = new xdr.CreatePassiveSellOfferOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.createPassiveSellOffer(
      createPassiveSellOfferOp
    );
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  // deprecated, to be removed after 1.0.1
  static createPassiveOffer(opts: OperationOptions.CreatePassiveSellOffer): xdrDef.Operation<Operation.CreatePassiveSellOffer> {
    // eslint-disable-next-line no-console
    console.log(
      '[Operation] Operation.createPassiveOffer has been renamed to Operation.createPassiveSellOffer! The old name is deprecated and will be removed in a later version!'
    );

    return this.createPassiveSellOffer(opts);
  }

  /**
   * This operation generates the inflation.
   * @function
   * @alias Operation.inflation
   * @param {object} [opts] Options object
   * @param {string} [opts.source] - The optional source account.
   * @returns {xdr.InflationOp} Inflation operation
   */
  static inflation(opts: OperationOptions.Inflation = {}): xdrDef.Operation<Operation.Inflation> {
    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.inflation();
    this.setSourceAccount(opAttributes, opts);
    return new xdr.Operation(opAttributes);
  }

  /**
   * Returns a XDR ManageBuyOfferOp. A "manage buy offer" operation creates, updates, or
   * deletes a buy offer.
   * @function
   * @alias Operation.manageBuyOffer
   * @param {object} opts Options object
   * @param {Asset} opts.selling - What you're selling.
   * @param {Asset} opts.buying - What you're buying.
   * @param {string} opts.buyAmount - The total amount you're buying. If 0, deletes the offer.
   * @param {number|string|BigNumber|Object} opts.price - Price of 1 unit of `selling` in terms of `buying`.
   * @param {number} opts.price.n - If `opts.price` is an object: the price numerator
   * @param {number} opts.price.d - If `opts.price` is an object: the price denominator
   * @param {number|string} [opts.offerId ] - If `0`, will create a new offer (default). Otherwise, edits an exisiting offer.
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @throws {Error} Throws `Error` when the best rational approximation of `price` cannot be found.
   * @returns {xdr.ManageBuyOfferOp} Manage Buy Offer operation
   */
  static manageBuyOffer(opts: OperationOptions.ManageBuyOffer): xdrDef.Operation<Operation.ManageBuyOffer> {
    const attributes = {};
    attributes.selling = opts.selling.toXDRObject();
    attributes.buying = opts.buying.toXDRObject();
    if (!this.isValidAmount(opts.buyAmount, true)) {
      throw new TypeError(this.constructAmountRequirementsError('buyAmount'));
    }
    attributes.buyAmount = this._toXDRAmount(opts.buyAmount);
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
    const manageBuyOfferOp = new xdr.ManageBuyOfferOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.manageBuyOffer(manageBuyOfferOp);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

  /**
   * This operation adds data entry to the ledger.
   * @function
   * @alias Operation.manageData
   * @param {object} opts Options object
   * @param {string} opts.name - The name of the data entry.
   * @param {string|Buffer} opts.value - The value of the data entry.
   * @param {string} [opts.source] - The optional source account.
   * @returns {xdr.ManageDataOp} Manage Data operation
   */
  static manageData(opts: OperationOptions.ManageData): xdrDef.Operation<Operation.ManageData> {
    const attributes = {};

    if (!(isString(opts.name) && opts.name.length <= 64)) {
      throw new Error('name must be a string, up to 64 characters');
    }
    attributes.dataName = opts.name;

    if (
      !isString(opts.value) &&
      !Buffer.isBuffer(opts.value) &&
      opts.value !== null
    ) {
      throw new Error('value must be a string, Buffer or null');
    }

    if (isString(opts.value)) {
      attributes.dataValue = Buffer.from(opts.value);
    } else {
      attributes.dataValue = opts.value;
    }

    if (attributes.dataValue !== null && attributes.dataValue.length > 64) {
      throw new Error('value cannot be longer that 64 bytes');
    }

    const manageDataOp = new xdr.ManageDataOp(attributes);

    const opAttributes = {};
    opAttributes.body = xdr.OperationBody.manageDatum(manageDataOp);
    this.setSourceAccount(opAttributes, opts);

    return new xdr.Operation(opAttributes);
  }

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
  static manageSellOffer(opts: OperationOptions.ManageSellOffer): xdrDef.Operation<Operation.ManageSellOffer> {
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

  // deprecated, to be removed after 1.0.1
  static manageOffer(opts: OperationOptions.ManageSellOffer): xdrDef.Operation<Operation.ManageSellOffer> {
    // eslint-disable-next-line no-console
    console.log(
      '[Operation] Operation.manageOffer has been renamed to Operation.manageSellOffer! The old name is deprecated and will be removed in a later version!'
    );

    return this.manageSellOffer(opts);
  }
}
