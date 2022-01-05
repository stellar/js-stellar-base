import xdr from '../generated/stellar-xdr_generated';
import { decodeAddressToMuxedAccount } from '../util/decode_encode_muxed_account';

/**
 * Transfers native balance to destination account.
 *
 * @function
 * @alias Operation.accountMerge
 *
 * @param {object} opts - options object
 * @param {string} opts.destination - destination to merge the source account into
 *
 * @param {bool}   [opts.withMuxing=true] - indicates that any addresses that
 *     can be muxed accounts (M... addresses) should be fully interpreted as a
 *     muxed account. Disabling this will throw if M-addresses are used.
 * @param {string} [opts.source]    - operation source account (defaults to
 *     transaction source)
 *
 * @returns {xdr.Operation} an Account Merge operation (xdr.AccountMergeOp)
 */
export function accountMerge(opts) {
  opts.withMuxing = opts.withMuxing === undefined ? true : opts.withMuxing;

  const opAttributes = {};
  try {
    opAttributes.body = xdr.OperationBody.accountMerge(
      decodeAddressToMuxedAccount(opts.destination, opts.withMuxing)
    );
  } catch (e) {
    throw new Error('destination is invalid');
  }
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
