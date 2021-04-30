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
 * @param {bool}  [opts.withMuxing] - indicates that opts.destination is an
 *     M... address and should be interpreted fully as a muxed account. By
 *     default, this option is disabled until muxed accounts are mature.*
 * @param {string} [opts.source]    - operation source account (defaults to
 *     transaction source)
 * @returns {xdr.Operation} an Account Merge operation (xdr.AccountMergeOp)
 */
export function accountMerge(opts) {
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
