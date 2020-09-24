import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';
import { Keypair } from '../keypair';

/**
 * Create a revoke sponsorship operation for an account.
 * 
  * @function
 
 * @param {object} opts Options object
 * @param {string} opts.account - The sponsored account ID.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.revokeAccountSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7
 * });
 *
 */
export function revokeAccountSponsorship(opts = {}) {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error('account is invalid');
  }

  const ledgerKey = xdr.LedgerKey.account(
    new xdr.LedgerKeyAccount({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId()
    })
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.revokeSponsorship(op);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
