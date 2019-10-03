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
export { pathPaymentStrictReceive } from './path_payment_strict_receive';
export { pathPaymentStrictSend } from './path_payment_strict_send';
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
