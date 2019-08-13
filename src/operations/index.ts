import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';
import { Operation, OperationOptions } from '../@types/operation';
import { xdr as xdrDef } from '../@types/xdr';
import { SignerOptions } from '../@types/signer'
import padEnd from 'lodash/padEnd';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import BigNumber from 'bignumber.js';
import { Hyper } from 'js-xdr';
import { best_r } from '../util/continued_fraction';

const ONE = 10000000;
const MAX_INT64 = '9223372036854775807';

function weightCheckFunction(value: number, name: string): boolean {
  if (value >= 0 && value <= 255) {
    return true;
  }
  throw new Error(`${name} value must be between 0 and 255`);
}

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

  static toXdrOperation(body: any, opts: any) {
    const opAttributes = {
        body,
    };
    this.setSourceAccount(opAttributes, opts);
    return new xdr.Operation(opAttributes);
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
        n: parseInt(approx[0].toString(), 10),
        d: parseInt(approx[1].toString(), 10)
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
    if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
      throw new Error('destination is invalid');
    }

    return this.toXdrOperation(xdr.OperationBody.accountMerge(Keypair.fromPublicKey(opts.destination).xdrAccountId()), opts)
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

    let asset: any
    if (opts.assetCode.length <= 4) {
      const code = padEnd(opts.assetCode, 4, '\0');
      asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
    } else if (opts.assetCode.length <= 12) {
      const code = padEnd(opts.assetCode, 12, '\0');
      asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum12(code);
    } else {
      throw new Error('Asset code must be 12 characters at max.');
    }

    const allowTrustOp = new xdr.AllowTrustOp({
      asset,
      authorize: opts.authorize,
      trustor: Keypair.fromPublicKey(opts.trustor).xdrAccountId(),
    });

    return this.toXdrOperation(xdr.OperationBody.allowTrust(allowTrustOp), opts)
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
    if (!isString(opts.bumpTo)) {
      throw new Error('bumpTo must be a string');
    }

    try {
      // eslint-disable-next-line no-new
      new BigNumber(opts.bumpTo);
    } catch (e) {
      throw new Error('bumpTo must be a stringified number');
    }

    const bumpSequenceOp = new xdr.BumpSequenceOp({
      bumpTo: Hyper.fromString(opts.bumpTo),
    });

    return this.toXdrOperation(xdr.OperationBody.bumpSequence(bumpSequenceOp), opts)
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
    if (!isUndefined(opts.limit) && !this.isValidAmount(opts.limit, true)) {
      throw new TypeError(this.constructAmountRequirementsError('limit'));
    }

    let limit: any
    if (opts.limit) {
      limit = this._toXDRAmount(opts.limit);
    } else {
      limit = Hyper.fromString(new BigNumber(MAX_INT64).toString());
    }

    const changeTrustOP = new xdr.ChangeTrustOp({
      limit,
      line: opts.asset.toXDRObject(),
    });

    return this.toXdrOperation(xdr.OperationBody.changeTrust(changeTrustOP), opts)
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

    const createAccountOp = new xdr.CreateAccountOp({
      destination: Keypair.fromPublicKey(opts.destination).xdrAccountId(),
      startingBalance: this._toXDRAmount(opts.startingBalance),
    });

    return this.toXdrOperation(xdr.OperationBody.createAccount(createAccountOp), opts)
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
    if (!this.isValidAmount(opts.amount)) {
      throw new TypeError(this.constructAmountRequirementsError('amount'));
    }
    if (isUndefined(opts.price)) {
      throw new TypeError('price argument is required');
    }

    const createPassiveSellOfferOp = new xdr.CreatePassiveSellOfferOp({
      amount: this._toXDRAmount(opts.amount),
      buying: opts.buying.toXDRObject(),
      price: this._toXDRPrice(opts.price),
      selling: opts.selling.toXDRObject(),
    });

    return this.toXdrOperation(xdr.OperationBody.createPassiveSellOffer(createPassiveSellOfferOp), opts)
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
    return this.toXdrOperation(xdr.OperationBody.inflation(), opts)
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
    if (!this.isValidAmount(opts.buyAmount, true)) {
      throw new TypeError(this.constructAmountRequirementsError('buyAmount'));
    }
    if (isUndefined(opts.price)) {
      throw new TypeError('price argument is required');
    }
    if (!isUndefined(opts.offerId)) {
      opts.offerId = opts.offerId.toString();
    } else {
      opts.offerId = '0';
    }

    const manageBuyOfferOp = new xdr.ManageBuyOfferOp({
      selling: opts.selling.toXDRObject(),
      buying: opts.buying.toXDRObject(),
      buyAmount: this._toXDRAmount(opts.buyAmount),
      price: this._toXDRPrice(opts.price),
      offerId: Hyper.fromString(opts.offerId),
    });

    return this.toXdrOperation(xdr.OperationBody.manageBuyOffer(manageBuyOfferOp), opts)
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
    if (!(isString(opts.name) && opts.name.length <= 64)) {
      throw new Error('name must be a string, up to 64 characters');
    }

    if (
      !isString(opts.value) &&
      !Buffer.isBuffer(opts.value) &&
      opts.value !== null
    ) {
      throw new Error('value must be a string, Buffer or null');
    }

    let dataValue: Buffer
    if (isString(opts.value)) {
      dataValue = Buffer.from(opts.value);
    } else {
      dataValue = opts.value;
    }

    if (dataValue !== null && dataValue.length > 64) {
      throw new Error('value cannot be longer that 64 bytes');
    }

    const manageDataOp = new xdr.ManageDataOp({
      dataName: opts.name,
      dataValue,
    });

    return this.toXdrOperation(xdr.OperationBody.manageDatum(manageDataOp), opts)
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
    if (!this.isValidAmount(opts.amount, true)) {
      throw new TypeError(this.constructAmountRequirementsError('amount'));
    }
    if (isUndefined(opts.price)) {
      throw new TypeError('price argument is required');
    }

    if (!isUndefined(opts.offerId)) {
      opts.offerId = opts.offerId.toString();
    } else {
      opts.offerId = '0';
    }

    const manageSellOfferOp = new xdr.ManageSellOfferOp({
      selling: opts.selling.toXDRObject(),
      buying: opts.buying.toXDRObject(),
      amount: this._toXDRAmount(opts.amount),
      price: this._toXDRPrice(opts.price),
      offerId: Hyper.fromString(opts.offerId),
    });

    return this.toXdrOperation(xdr.OperationBody.manageSellOffer(manageSellOfferOp), opts)
  }

  // deprecated, to be removed after 1.0.1
  static manageOffer(opts: OperationOptions.ManageSellOffer): xdrDef.Operation<Operation.ManageSellOffer> {
    // eslint-disable-next-line no-console
    console.log(
      '[Operation] Operation.manageOffer has been renamed to Operation.manageSellOffer! The old name is deprecated and will be removed in a later version!'
    );

    return this.manageSellOffer(opts);
  }

  /**
   * Returns a XDR PaymentOp. A "payment" operation send the specified amount to the
   * destination account, optionally through a path. XLM payments create the destination
   * account if it does not exist.
   * @function
   * @alias Operation.pathPayment
   * @param {object} opts Options object
   * @param {Asset} opts.sendAsset - The asset to pay with.
   * @param {string} opts.sendMax - The maximum amount of sendAsset to send.
   * @param {string} opts.destination - The destination account to send to.
   * @param {Asset} opts.destAsset - The asset the destination will receive.
   * @param {string} opts.destAmount - The amount the destination receives.
   * @param {Asset[]} opts.path - An array of Asset objects to use as the path.
   * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
   * @returns {xdr.PathPaymentOp} Path Payment operation
   */
  static pathPayment(opts: OperationOptions.PathPayment): xdrDef.Operation<Operation.PathPayment> {
    if(!opts.sendAsset) {
        throw new Error('Must specify a send asset');
    }
    if(!this.isValidAmount(opts.sendMax)) {
        throw new TypeError(this.constructAmountRequirementsError('sendMax'));
    }
    if(!StrKey.isValidEd25519PublicKey(opts.destination)) {
        throw new Error('destination is invalid');
    }
    if(!opts.destAsset) {
        throw new Error('Must provide a destAsset for a payment operation');
    }
    if(!this.isValidAmount(opts.destAmount)) {
        throw new TypeError(this.constructAmountRequirementsError('destAmount'));
    }

    const path = opts.path ? opts.path : [];

    const payment = new xdr.PathPaymentOp({
      sendAsset: opts.sendAsset.toXDRObject(),
      sendMax: this._toXDRAmount(opts.sendMax),
      destination: Keypair.fromPublicKey(opts.destination).xdrAccountId(),
      destAsset: opts.destAsset.toXDRObject(),
      destAmount: this._toXDRAmount(opts.destAmount),
      path: path.map((x) => x.toXDRObject()),
    });

    return this.toXdrOperation(xdr.OperationBody.pathPayment(payment), opts)
  }

  /**
   * Create a payment operation.
   * @function
   * @alias Operation.payment
   * @param {object} opts Options object
   * @param {string} opts.destination - The destination account ID.
   * @param {Asset} opts.asset - The asset to send.
   * @param {string} opts.amount - The amount to send.
   * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
   * @returns {xdr.PaymentOp} Payment operation
   */
  static payment(opts: OperationOptions.Payment): xdrDef.Operation<Operation.Payment> {
    if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
      throw new Error('destination is invalid');
    }
    if (!opts.asset) {
      throw new Error('Must provide an asset for a payment operation');
    }
    if (!this.isValidAmount(opts.amount)) {
      throw new TypeError(this.constructAmountRequirementsError('amount'));
    }

    const paymentOp = new xdr.PaymentOp({
      destination: Keypair.fromPublicKey(opts.destination).xdrAccountId(),
      asset: opts.asset.toXDRObject(),
      amount: this._toXDRAmount(opts.amount),
    });

    return this.toXdrOperation(xdr.OperationBody.payment(paymentOp), opts)
  }

  /**
   * Returns an XDR SetOptionsOp. A "set options" operations set or clear account flags,
   * set the account's inflation destination, and/or add new signers to the account.
   * The flags used in `opts.clearFlags` and `opts.setFlags` can be the following:
   *   - `{@link AuthRequiredFlag}`
   *   - `{@link AuthRevocableFlag}`
   *   - `{@link AuthImmutableFlag}`
   *
   * It's possible to set/clear multiple flags at once using logical or.
   * @function
   * @alias Operation.setOptions
   * @param {object} opts Options object
   * @param {string} [opts.inflationDest] - Set this account ID as the account's inflation destination.
   * @param {(number|string)} [opts.clearFlags] - Bitmap integer for which account flags to clear.
   * @param {(number|string)} [opts.setFlags] - Bitmap integer for which account flags to set.
   * @param {number|string} [opts.masterWeight] - The master key weight.
   * @param {number|string} [opts.lowThreshold] - The sum weight for the low threshold.
   * @param {number|string} [opts.medThreshold] - The sum weight for the medium threshold.
   * @param {number|string} [opts.highThreshold] - The sum weight for the high threshold.
   * @param {object} [opts.signer] - Add or remove a signer from the account. The signer is
   *                                 deleted if the weight is 0. Only one of `ed25519PublicKey`, `sha256Hash`, `preAuthTx` should be defined.
   * @param {string} [opts.signer.ed25519PublicKey] - The ed25519 public key of the signer.
   * @param {Buffer|string} [opts.signer.sha256Hash] - sha256 hash (Buffer or hex string) of preimage that will unlock funds. Preimage should be used as signature of future transaction.
   * @param {Buffer|string} [opts.signer.preAuthTx] - Hash (Buffer or hex string) of transaction that will unlock funds.
   * @param {number|string} [opts.signer.weight] - The weight of the new signer (0 to delete or 1-255)
   * @param {string} [opts.homeDomain] - sets the home domain used for reverse federation lookup.
   * @param {string} [opts.source] - The source account (defaults to transaction source).
   * @returns {xdr.SetOptionsOp}  XDR operation
   * @see [Account flags](https://www.stellar.org/developers/guides/concepts/accounts.html#flags)
   */
  static setOptions<T extends SignerOptions = never>(opts: OperationOptions.SetOptions<T>): xdrDef.Operation<Operation.SetOptions<T>> {
    // TS-TODO: `Partial<SetOptionsOp.IAttributes>`
    const attributes: Record<string, unknown> = {};

    if (opts.inflationDest) {
      if (!StrKey.isValidEd25519PublicKey(opts.inflationDest)) {
        throw new Error('inflationDest is invalid');
      }
      attributes.inflationDest = Keypair.fromPublicKey(
        opts.inflationDest
      ).xdrAccountId();
    }

    attributes.clearFlags = this._checkUnsignedIntValue(
      'clearFlags',
      opts.clearFlags
    );
    attributes.setFlags = this._checkUnsignedIntValue('setFlags', opts.setFlags);
    attributes.masterWeight = this._checkUnsignedIntValue(
      'masterWeight',
      opts.masterWeight,
      weightCheckFunction
    );
    attributes.lowThreshold = this._checkUnsignedIntValue(
      'lowThreshold',
      opts.lowThreshold,
      weightCheckFunction
    );
    attributes.medThreshold = this._checkUnsignedIntValue(
      'medThreshold',
      opts.medThreshold,
      weightCheckFunction
    );
    attributes.highThreshold = this._checkUnsignedIntValue(
      'highThreshold',
      opts.highThreshold,
      weightCheckFunction
    );

    if (!isUndefined(opts.homeDomain) && !isString(opts.homeDomain)) {
      throw new TypeError('homeDomain argument must be of type String');
    }
    attributes.homeDomain = opts.homeDomain;

    if (opts.signer) {
      const weight = this._checkUnsignedIntValue(
        'signer.weight',
        opts.signer.weight,
        weightCheckFunction
      );
      let key;

      let setValues = 0;

      if (opts.signer.ed25519PublicKey) {
        if (!StrKey.isValidEd25519PublicKey(opts.signer.ed25519PublicKey)) {
          throw new Error('signer.ed25519PublicKey is invalid.');
        }
        const rawKey = StrKey.decodeEd25519PublicKey(
          opts.signer.ed25519PublicKey
        );

        // eslint-disable-next-line new-cap
        key = new xdr.SignerKey.signerKeyTypeEd25519(rawKey);
        setValues += 1;
      }

      if (opts.signer.preAuthTx) {
        if (isString(opts.signer.preAuthTx)) {
          opts.signer.preAuthTx = Buffer.from(opts.signer.preAuthTx, 'hex');
        }

        if (
          !(
            Buffer.isBuffer(opts.signer.preAuthTx) &&
            opts.signer.preAuthTx.length === 32
          )
        ) {
          throw new Error('signer.preAuthTx must be 32 bytes Buffer.');
        }

        // eslint-disable-next-line new-cap
        key = new xdr.SignerKey.signerKeyTypePreAuthTx(opts.signer.preAuthTx);
        setValues += 1;
      }

      if (opts.signer.sha256Hash) {
        if (isString(opts.signer.sha256Hash)) {
          opts.signer.sha256Hash = Buffer.from(opts.signer.sha256Hash, 'hex');
        }

        if (
          !(
            Buffer.isBuffer(opts.signer.sha256Hash) &&
            opts.signer.sha256Hash.length === 32
          )
        ) {
          throw new Error('signer.sha256Hash must be 32 bytes Buffer.');
        }

        // eslint-disable-next-line new-cap
        key = new xdr.SignerKey.signerKeyTypeHashX(opts.signer.sha256Hash);
        setValues += 1;
      }

      if (setValues !== 1) {
        throw new Error(
          'Signer object must contain exactly one of signer.ed25519PublicKey, signer.sha256Hash, signer.preAuthTx.'
        );
      }

      attributes.signer = new xdr.Signer({ key, weight });
    }

    const setOptionsOp = new xdr.SetOptionsOp(attributes);

    return this.toXdrOperation(xdr.OperationBody.setOption(setOptionsOp), opts)
  }
}
