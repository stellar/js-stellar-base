import {default as xdr} from "../generated/stellar-xdr_generated";
import {Keypair} from "../keypair";
import {StrKey} from "../strkey";

/**
 * Transfers native balance to destination account.
 * @function
 * @alias Operation.accountMerge
 * @param {object} opts
 * @param {string} opts.destination - Destination to merge the source account into.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.AccountMergeOp}
 */
export const accountMerge = function(opts) {
  let opAttributes = {};
  if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error("destination is invalid");
  }
  opAttributes.body = xdr.OperationBody.accountMerge(
    Keypair.fromPublicKey(opts.destination).xdrAccountId()
    );
    this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
};
  