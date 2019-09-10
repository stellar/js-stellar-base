/* eslint-disable no-bitwise */

import BigNumber from 'bignumber.js';
import trimEnd from 'lodash/trimEnd';
import { Asset } from './asset';
import { StrKey } from './strkey';
import { BaseOperation } from './operations';
import { Operation as OperationNS } from './@types/operation';
import xdr from './generated/stellar-xdr_generated';

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
  static fromXDRObject(operation: xdr.Operation): OperationNS {
    function accountIdtoAddress(accountId: xdr.AccountId) {
      return StrKey.encodeEd25519PublicKey(accountId.ed25519());
    }

    const sourceAccount = operation.sourceAccount()
    const withSource: {source?: string} = sourceAccount
      ? {source: accountIdtoAddress(sourceAccount)}
      : {}

    switch (operation.body().switch().name) {
      case 'createAccount': {
        const attrs = operation.body().value() as xdr.CreateAccountOp;
        return {
          ...withSource,
          type: 'createAccount',
          destination: accountIdtoAddress(attrs.destination()),
          startingBalance: this._fromXDRAmount(attrs.startingBalance()),
        }
      }
      case 'payment': {
        const attrs = operation.body().value() as xdr.PaymentOp;
        return {
          ...withSource,
          type: 'payment',
          destination: accountIdtoAddress(attrs.destination()),
          asset: Asset.fromOperation(attrs.asset()),
          amount: this._fromXDRAmount(attrs.amount()),
        }
      }
      case 'pathPayment': {
        const attrs = operation.body().value() as xdr.PathPaymentOp;
        const result = {
          ...withSource,
          type: 'pathPayment',
          sendAsset: Asset.fromOperation(attrs.sendAsset()),
          sendMax: this._fromXDRAmount(attrs.sendMax()),
          destination: accountIdtoAddress(attrs.destination()),
          destAsset: Asset.fromOperation(attrs.destAsset()),
          destAmount: this._fromXDRAmount(attrs.destAmount()),
          path: [],
        }

        const path = attrs.path();

        // note that Object.values isn't supported by node 6!
        Object.keys(path).forEach((pathKey) => {
          result.path.push(Asset.fromOperation(path[pathKey]));
        });
        break;
      }
      case 'changeTrust': {
        const attrs = operation.body().value() as xdr.ChangeTrustOp;
        return {
          ...withSource,
          type: 'changeTrust',
          line: Asset.fromOperation(attrs.line()),
          limit: this._fromXDRAmount(attrs.limit()),
        }
      }
      case 'allowTrust': {
        const attrs = operation.body().value() as xdr.AllowTrustOp;
        const assetCode = attrs
            .asset()
            .value()
            .toString()
        return {
          ...withSource,
          type: 'allowTrust',
          trustor: accountIdtoAddress(attrs.trustor()),
          assetCode: trimEnd(assetCode, '\0'),
          authorize: attrs.authorize(),
        }
      }
      case 'setOption': {
        const attrs = operation.body().value() as xdr.SetOptionsOp;
        const result = {
          ...withSource,
          type: 'setOptions',
        }
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
        const attrs = operation.body().value() as xdr.ManageSellOfferOp;
        return {
          ...withSource,
          type: 'manageSellOffer',
          selling: Asset.fromOperation(attrs.selling()),
          buying: Asset.fromOperation(attrs.buying()),
          amount: this._fromXDRAmount(attrs.amount()),
          price: this._fromXDRPrice(attrs.price()),
          offerId: attrs.offerId().toString(),
        }
      }
      case 'manageBuyOffer': {
        const attrs = operation.body().value() as xdr.ManageBuyOfferOp;
        return {
          ...withSource,
          type: 'manageBuyOffer',
          selling: Asset.fromOperation(attrs.selling()),
          buying: Asset.fromOperation(attrs.buying()),
          buyAmount: this._fromXDRAmount(attrs.buyAmount()),
          price: this._fromXDRPrice(attrs.price()),
          offerId: attrs.offerId().toString(),
        }
      }
      // the next case intentionally falls through!
      case 'createPassiveOffer':
      case 'createPassiveSellOffer': {
        const attrs = operation.body().value() as xdr.CreatePassiveSellOfferOp;
        return {
          ...withSource,
          type: 'createPassiveSellOffer',
          selling: Asset.fromOperation(attrs.selling()),
          buying: Asset.fromOperation(attrs.buying()),
          amount: this._fromXDRAmount(attrs.amount()),
          price: this._fromXDRPrice(attrs.price()),
        }
      }
      case 'accountMerge': {
        const attrs = operation.body().value() as xdr.AccountId;
        return {
          ...withSource,
          type: 'accountMerge',
          destination: accountIdtoAddress(attrs),
        }
      }
      case 'manageDatum': {
        const attrs = operation.body().value() as xdr.ManageDataOp;
        return {
          ...withSource,
          type: 'manageData',
          // manage_data.name is checked by iscntrl in stellar-core
          name: attrs.dataName().toString('ascii'),
          value: attrs.dataValue(),
        }
      }
      case 'inflation': {
        return {
          ...withSource,
          type: 'inflation',
        }
      }
      case 'bumpSequence': {
        const attrs = operation.body().value() as xdr.BumpSequenceOp;
        return {
          ...withSource,
          type: 'bumpSequence',
          bumpTo: attrs.bumpTo().toString(),
        }
      }
    }
    throw new Error('Unknown operation');
  }

  /**
   * @private
   * @param {string|BigNumber} value XDR amount
   * @returns {BigNumber} Number
   */
  static _fromXDRAmount(value: xdr.Int64): BigNumber {
    return new BigNumber(value).div(ONE).toFixed(7);
  }

  /**
   * @private
   * @param {object} price Price object
   * @param {function} price.n numerator function that returns a value
   * @param {function} price.d denominator function that returns a value
   * @returns {BigNumber} Big string
   */
  static _fromXDRPrice(price: xdr.Price): BigNumber {
    const n = new BigNumber(price.n());
    return n.div(new BigNumber(price.d())).toString();
  }
}
