import {default as xdr} from "../generated/stellar-xdr_generated";
import {Keypair} from "../keypair";
import {StrKey} from "../strkey";
import padEnd from 'lodash/padEnd';

/**
 * Returns an XDR AllowTrustOp. An "allow trust" operation authorizes another
 * account to hold your account's credit for a given asset.
 * @function
 * @alias Operation.allowTrust
 * @param {object} opts
 * @param {string} opts.trustor - The trusting account (the one being authorized)
 * @param {string} opts.assetCode - The asset code being authorized.
 * @param {boolean} opts.authorize - True to authorize the line, false to deauthorize.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.AllowTrustOp}
 */
export const allowTrust = function(opts) {
  if (!StrKey.isValidEd25519PublicKey(opts.trustor)) {
    throw new Error("trustor is invalid");
  }
  let attributes = {};
  attributes.trustor = Keypair.fromPublicKey(opts.trustor).xdrAccountId();
  if (opts.assetCode.length <= 4) {
    let code = padEnd(opts.assetCode, 4, '\0');
    attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum4(code);
  } else if (opts.assetCode.length <= 12) {
    let code = padEnd(opts.assetCode, 12, '\0');
    attributes.asset = xdr.AllowTrustOpAsset.assetTypeCreditAlphanum12(code);
  } else {
    throw new Error("Asset code must be 12 characters at max.");
  }
  attributes.authorize = opts.authorize;
  let allowTrustOp = new xdr.AllowTrustOp(attributes);

  let opAttributes = {};
  opAttributes.body = xdr.OperationBody.allowTrust(allowTrustOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
};