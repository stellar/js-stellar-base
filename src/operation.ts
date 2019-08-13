/* eslint-disable no-bitwise */

import BigNumber from 'bignumber.js';
import trimEnd from 'lodash/trimEnd';
import { Asset } from './asset';
import { StrKey } from './strkey';
import { BaseOperation } from './operations/index';

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
 * `Operation` class represents [operations](https://www.stellar.org/developers/learn/concepts/operations.html) in Stellar network.
 * Use one of static methods to create operations:
 * * `{@link Operation.createAccount}`
 * * `{@link Operation.payment}`
 * * `{@link Operation.pathPayment}`
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
 *
 *
 * @class Operation
 */
export class Operation extends BaseOperation {
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

    switch (operation.body().switch().name) {
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
      case 'pathPayment': {
        result.type = 'pathPayment';
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
        throw new Error('Unknown operation');
      }
    }
    return result;
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
}
