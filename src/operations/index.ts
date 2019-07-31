import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';
import { StrKey } from '../strkey';
import { Operation, OperationOptions } from '../@types/operation';
import { xdr as xdrDef } from '../@types/xdr';

import { manageSellOffer } from './manage_sell_offer';
import { createPassiveSellOffer } from './create_passive_sell_offer';

export { accountMerge } from './account_merge';
export { allowTrust } from './allow_trust';
export { bumpSequence } from './bump_sequence';
export { changeTrust } from './change_trust';
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
}
