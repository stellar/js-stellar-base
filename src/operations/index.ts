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

import { manageSellOffer } from './manage_sell_offer';
import { createPassiveSellOffer } from './create_passive_sell_offer';

export { createAccount } from './create_account';
export { inflation } from './inflation';
export { manageData } from './manage_data';
export { manageBuyOffer } from './manage_buy_offer';
export { pathPayment } from './path_payment';
export { payment } from './payment';
export { setOptions } from './set_options';

export { manageSellOffer };
export { createPassiveSellOffer };

export function manageOffer(opts) {
  // eslint-disable-next-line no-console
  console.log(
    '[Operation] Operation.manageOffer has been renamed to Operation.manageSellOffer! The old name is deprecated and will be removed in a later version!'
  );

  return manageSellOffer.call(this, opts);
}

export function createPassiveOffer(opts) {
  // eslint-disable-next-line no-console
  console.log(
    '[Operation] Operation.createPassiveOffer has been renamed to Operation.createPassiveSellOffer! The old name is deprecated and will be removed in a later version!'
  );

  return createPassiveSellOffer.call(this, opts);
}

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

}
