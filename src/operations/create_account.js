import {default as xdr} from "../generated/stellar-xdr_generated";
import {Keypair} from "../keypair";
import {StrKey} from "../strkey";

/**
 * Create and fund a non existent account.
 * @function
 * @alias Operation.createAccount
 * @param {object} opts
 * @param {string} opts.destination - Destination account ID to create an account for.
 * @param {string} opts.startingBalance - Amount in XLM the account should be funded for. Must be greater
 *                                   than the [reserve balance amount](https://www.stellar.org/developers/learn/concepts/fees.html).
 * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
 * @returns {xdr.CreateAccountOp}
 */
export const createAccount = function(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.destination)) {
    throw new Error("destination is invalid");
  }
  if (!this.isValidAmount(opts.startingBalance)) {
    throw new TypeError(this.constructAmountRequirementsError('startingBalance'));
  }
  let attributes = {};
  attributes.destination     = Keypair.fromPublicKey(opts.destination).xdrAccountId();
  attributes.startingBalance = this._toXDRAmount(opts.startingBalance);
  let createAccount          = new xdr.CreateAccountOp(attributes);

  let opAttributes = {};
  opAttributes.body = xdr.OperationBody.createAccount(createAccount);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
};