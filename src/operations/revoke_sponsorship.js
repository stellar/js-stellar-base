import isString from 'lodash/isString';
import xdr from '../generated/stellar-xdr_generated';
import { StrKey } from '../strkey';
import { Keypair } from '../keypair';
import { Asset } from '../asset';

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

/**
 * Create a revoke sponsorship operation for a trustline.
 *
 * @function
 * @param {object} opts Options object
 * @param {string} opts.account - The account ID which owns the trustline.
 * @param {Asset} opts.asset - The asset in the trustline.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.revokeTrustlineSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7
 *   asset: new StellarBase.Asset(
 *     'USDUSD',
 *     'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
 *   )
 * });
 *
 */
export function revokeTrustlineSponsorship(opts = {}) {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error('account is invalid');
  }
  if (!(opts.asset instanceof Asset)) {
    throw new Error('asset is invalid');
  }

  const ledgerKey = xdr.LedgerKey.trustline(
    new xdr.LedgerKeyTrustLine({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
      asset: opts.asset.toXDRObject()
    })
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.revokeSponsorship(op);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a revoke sponsorship operation for an offer
 *
 * @function
 * @param {object} opts Options object
 * @param {string} opts.seller - The account ID which created the offer.
 * @param {string} opts.offerId - The offer ID.
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.revokeOfferSponsorship({
 *   seller: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7
 *   offerId: '1234'
 * });
 *
 */
export function revokeOfferSponsorship(opts = {}) {
  if (!StrKey.isValidEd25519PublicKey(opts.seller)) {
    throw new Error('seller is invalid');
  }
  if (!isString(opts.offerId)) {
    throw new Error('offerId is invalid');
  }

  const ledgerKey = xdr.LedgerKey.offer(
    new xdr.LedgerKeyOffer({
      sellerId: Keypair.fromPublicKey(opts.seller).xdrAccountId(),
      offerId: xdr.Int64.fromString(opts.offerId)
    })
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.revokeSponsorship(op);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}

/**
 * Create a revoke sponsorship operation for a data entry.
 *
 * @function
 * @param {object} opts Options object
 * @param {string} opts.account - The account ID which owns the data entry.
 * @param {string} opts.name - The name of the data entry
 * @param {string} [opts.source] - The source account for the operation. Defaults to the transaction's source account.
 * @returns {xdr.Operation} xdr operation
 *
 * @example
 * const op = Operation.revokeDataSponsorship({
 *   account: 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7
 *   name: 'foo'
 * });
 *
 */
export function revokeDataSponsorship(opts = {}) {
  if (!StrKey.isValidEd25519PublicKey(opts.account)) {
    throw new Error('account is invalid');
  }
  if (!isString(opts.name) || opts.name.length > 64) {
    throw new Error('name must be a string, up to 64 characters');
  }

  const ledgerKey = xdr.LedgerKey.data(
    new xdr.LedgerKeyData({
      accountId: Keypair.fromPublicKey(opts.account).xdrAccountId(),
      dataName: opts.name
    })
  );
  const op = xdr.RevokeSponsorshipOp.revokeSponsorshipLedgerEntry(ledgerKey);
  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.revokeSponsorship(op);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
