import { pathPaymentStrictReceive } from './path_payment_strict_receive';

/**
 * Returns a XDR PathPaymentOp. A "payment" operation send the specified amount to the
 * destination account, optionally through a path. XLM payments create the destination
 * account if it does not exist.
 * @function
 * @deprecated Use {@link Operation.pathPaymentStrictReceive}
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
export function pathPayment(opts) {
  // eslint-disable-next-line no-console
  console.log(
    '[Operation] Operation.pathPayment has been renamed to Operation.pathPaymentStrictReceive - The old name is deprecated and will be removed in a later version!'
  );

  return pathPaymentStrictReceive.call(this, opts);
}
