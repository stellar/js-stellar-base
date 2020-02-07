/* eslint-disable no-bitwise */

import { Hyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import trimEnd from 'lodash/trimEnd';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isFinite from 'lodash/isFinite';
import { best_r } from './util/continued_fraction';
import { Asset } from './asset';
import { StrKey } from './strkey';
import { Keypair } from './keypair';
import xdr from './generated/stellar-xdr_generated';
import * as ops from './operations/index';

const ONE = 10000000;
const MAX_INT64 = '9223372036854775807';

/**
 * When set using `{@link Operation.setOptions}` option, requires the issuing account to
 * give other accounts permission before they can hold the issuing account’s credit.
 * @constant
 * @see [Account flags](https://www.stellar.org/developers/guides/concepts/accounts.html#flags)
 */
export const AuthRequiredFlag = 1 << 0;
/**
 * When set using `{@link Operation.setOptions}` option, allows the issuing account to
 * revoke its credit held by other accounts.
 * @constant
 * @see [Account flags](https://www.stellar.org/developers/guides/concepts/accounts.html#flags)
 */
export const AuthRevocableFlag = 1 << 1;
/**
 * When set using `{@link Operation.setOptions}` option, then none of the authorization flags
 * can be set and the account can never be deleted.
 * @constant
 * @see [Account flags](https://www.stellar.org/developers/guides/concepts/accounts.html#flags)
 */
export const AuthImmutableFlag = 1 << 2;

/**
 * `Operation` class represents [operations](https://www.stellar.org/developers/guides/concepts/operations.html) in Stellar network.
 * Use one of static methods to create operations:
 * * `{@link Operation.createAccount}`
 * * `{@link Operation.payment}`
 * * `{@link Operation.pathPaymentStrictReceive}`
 * * `{@link Operation.pathPaymentStrictSend}`
 * * `{@link Operation.manageSellOffer}`
 * * `{@link Operation.manageBuyOffer}`
 * * `{@link Operation.createPassiveSellOffer}`
 * * `{@link Operation.setOptions}`
 * * `{@link Operation.changeTrust}`
 * * `{@link Operation.allowTrust}`
 * * `{@link Operation.accountMerge}`
 * * `{@link Operation.inflation}`
 * * `{@link Operation.manageData}`
 * * `{@link Operation.bumpSequence}`
 *
 * These operations are deprecated and will be removed in a later version:
 * * `{@link Operation.manageOffer}`
 * * `{@link Operation.createPassiveOffer}`
 * * `{@link Operation.pathPayment}`
 *
 *
 * @class Operation
 */
export class Operation {
  static setSourceAccount(opAttributes, opts) {
    if (opts.source) {
      if (!StrKey.isValidEd25519PublicKey(opts.source)) {
        throw new Error('Source address is invalid');
      }
      opAttributes.sourceAccount = Keypair.fromPublicKey(
        opts.source
      ).xdrAccountId();
    }
  }

  /**
   * Converts the XDR Operation object to the opts object used to create the XDR
   * operation.
   * @param {xdr.Operation} operation - An XDR Operation.
   * @return {Operation}
   */
  static fromXDRObject(operation) {
    function accountIdtoAddress(accountId) {
      return StrKey.encodeEd25519PublicKey(accountId.ed25519());
    }

    const result = {};
    if (operation.sourceAccount()) {
      result.source = accountIdtoAddress(operation.sourceAccount());
    }

    const attrs = operation.body().value();
    const operationName = operation.body().switch().name;

    switch (operationName) {
      case 'createAccount': {
        result.type = 'createAccount';
        result.destination = accountIdtoAddress(attrs.destination());
        result.startingBalance = this._fromXDRAmount(attrs.startingBalance());
        break;
      }
      case 'payment': {
        result.type = 'payment';
        result.destination = accountIdtoAddress(attrs.destination());
        result.asset = Asset.fromOperation(attrs.asset());
        result.amount = this._fromXDRAmount(attrs.amount());
        break;
      }
      case 'pathPaymentStrictReceive': {
        result.type = 'pathPaymentStrictReceive';
        result.sendAsset = Asset.fromOperation(attrs.sendAsset());
        result.sendMax = this._fromXDRAmount(attrs.sendMax());
        result.destination = accountIdtoAddress(attrs.destination());
        result.destAsset = Asset.fromOperation(attrs.destAsset());
        result.destAmount = this._fromXDRAmount(attrs.destAmount());
        result.path = [];

        const path = attrs.path();

        // note that Object.values isn't supported by node 6!
        Object.keys(path).forEach((pathKey) => {
          result.path.push(Asset.fromOperation(path[pathKey]));
        });
        break;
      }
      case 'pathPaymentStrictSend': {
        result.type = 'pathPaymentStrictSend';
        result.sendAsset = Asset.fromOperation(attrs.sendAsset());
        result.sendAmount = this._fromXDRAmount(attrs.sendAmount());
        result.destination = accountIdtoAddress(attrs.destination());
        result.destAsset = Asset.fromOperation(attrs.destAsset());
        result.destMin = this._fromXDRAmount(attrs.destMin());
        result.path = [];

        const path = attrs.path();

        // note that Object.values isn't supported by node 6!
        Object.keys(path).forEach((pathKey) => {
          result.path.push(Asset.fromOperation(path[pathKey]));
        });
        break;
      }
      case 'changeTrust': {
        result.type = 'changeTrust';
        result.line = Asset.fromOperation(attrs.line());
        result.limit = this._fromXDRAmount(attrs.limit());
        break;
      }
      case 'allowTrust': {
        result.type = 'allowTrust';
        result.trustor = accountIdtoAddress(attrs.trustor());
        result.assetCode = attrs
          .asset()
          .value()
          .toString();
        result.assetCode = trimEnd(result.assetCode, '\0');
        result.authorize = attrs.authorize();
        break;
      }
      case 'setOption': {
        result.type = 'setOptions';
        if (attrs.inflationDest()) {
          result.inflationDest = accountIdtoAddress(attrs.inflationDest());
        }

        result.clearFlags = attrs.clearFlags();
        result.setFlags = attrs.setFlags();
        result.masterWeight = attrs.masterWeight();
        result.lowThreshold = attrs.lowThreshold();
        result.medThreshold = attrs.medThreshold();
        result.highThreshold = attrs.highThreshold();
        // home_domain is checked by iscntrl in stellar-core
        result.homeDomain =
          attrs.homeDomain() !== undefined
            ? attrs.homeDomain().toString('ascii')
            : undefined;

        if (attrs.signer()) {
          const signer = {};
          const arm = attrs
            .signer()
            .key()
            .arm();
          if (arm === 'ed25519') {
            signer.ed25519PublicKey = accountIdtoAddress(attrs.signer().key());
          } else if (arm === 'preAuthTx') {
            signer.preAuthTx = attrs
              .signer()
              .key()
              .preAuthTx();
          } else if (arm === 'hashX') {
            signer.sha256Hash = attrs
              .signer()
              .key()
              .hashX();
          }

          signer.weight = attrs.signer().weight();
          result.signer = signer;
        }
        break;
      }
      // the next case intentionally falls through!
      case 'manageOffer':
      case 'manageSellOffer': {
        result.type = 'manageSellOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.amount = this._fromXDRAmount(attrs.amount());
        result.price = this._fromXDRPrice(attrs.price());
        result.offerId = attrs.offerId().toString();
        break;
      }
      case 'manageBuyOffer': {
        result.type = 'manageBuyOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.buyAmount = this._fromXDRAmount(attrs.buyAmount());
        result.price = this._fromXDRPrice(attrs.price());
        result.offerId = attrs.offerId().toString();
        break;
      }
      // the next case intentionally falls through!
      case 'createPassiveOffer':
      case 'createPassiveSellOffer': {
        result.type = 'createPassiveSellOffer';
        result.selling = Asset.fromOperation(attrs.selling());
        result.buying = Asset.fromOperation(attrs.buying());
        result.amount = this._fromXDRAmount(attrs.amount());
        result.price = this._fromXDRPrice(attrs.price());
        break;
      }
      case 'accountMerge': {
        result.type = 'accountMerge';
        result.destination = accountIdtoAddress(attrs);
        break;
      }
      case 'manageDatum': {
        result.type = 'manageData';
        // manage_data.name is checked by iscntrl in stellar-core
        result.name = attrs.dataName().toString('ascii');
        result.value = attrs.dataValue();
        break;
      }
      case 'inflation': {
        result.type = 'inflation';
        break;
      }
      case 'bumpSequence': {
        result.type = 'bumpSequence';
        result.bumpTo = attrs.bumpTo().toString();
        break;
      }
      default: {
        throw new Error(`Unknown operation: ${operationName}`);
      }
    }
    return result;
  }

  static isValidAmount(value, allowZero = false) {
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

  static constructAmountRequirementsError(arg) {
    return `${arg} argument must be of type String, represent a positive number and have at most 7 digits after the decimal`;
  }

  /**
   * Returns value converted to uint32 value or undefined.
   * If `value` is not `Number`, `String` or `Undefined` then throws an error.
   * Used in {@link Operation.setOptions}.
   * @private
   * @param {string} name Name of the property (used in error message only)
   * @param {*} value Value to check
   * @param {function(value, name)} isValidFunction Function to check other constraints (the argument will be a `Number`)
   * @returns {undefined|Number}
   */
  static _checkUnsignedIntValue(name, value, isValidFunction = null) {
    if (isUndefined(value)) {
      return undefined;
    }

    if (isString(value)) {
      value = parseFloat(value);
    }

    switch (true) {
      case !isNumber(value) || !isFinite(value) || value % 1 !== 0:
        throw new Error(`${name} value is invalid`);
      case value < 0:
        throw new Error(`${name} value must be unsigned`);
      case !isValidFunction ||
        (isValidFunction && isValidFunction(value, name)):
        return value;
      default:
        throw new Error(`${name} value is invalid`);
    }
  }
  /**
   * @private
   * @param {string|BigNumber} value Value
   * @returns {Hyper} XDR amount
   */
  static _toXDRAmount(value) {
    const amount = new BigNumber(value).mul(ONE);
    return Hyper.fromString(amount.toString());
  }

  /**
   * @private
   * @param {string|BigNumber} value XDR amount
   * @returns {BigNumber} Number
   */
  static _fromXDRAmount(value) {
    return new BigNumber(value).div(ONE).toFixed(7);
  }

  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {BigNumber} Big string
   */
  static _fromXDRPrice(price) {
    const n = new BigNumber(price.n());
    return n.div(new BigNumber(price.d())).toString();
  }

  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {object} XDR price object
   */
  static _toXDRPrice(price) {
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
}

// Attach all imported operations as static methods on the Operation class
Operation.accountMerge = ops.accountMerge;
Operation.allowTrust = ops.allowTrust;
Operation.bumpSequence = ops.bumpSequence;
Operation.changeTrust = ops.changeTrust;
Operation.createAccount = ops.createAccount;
Operation.createPassiveSellOffer = ops.createPassiveSellOffer;
Operation.inflation = ops.inflation;
Operation.manageData = ops.manageData;
Operation.manageSellOffer = ops.manageSellOffer;
Operation.manageBuyOffer = ops.manageBuyOffer;
Operation.pathPayment = ops.pathPayment;
Operation.pathPaymentStrictReceive = ops.pathPaymentStrictReceive;
Operation.pathPaymentStrictSend = ops.pathPaymentStrictSend;
Operation.payment = ops.payment;
Operation.setOptions = ops.setOptions;

// deprecated, to be removed after 1.0.1
Operation.manageOffer = ops.manageOffer;
Operation.createPassiveOffer = ops.createPassiveOffer;
