import xdr from '../generated/stellar-xdr_generated';
import { Keypair } from '../keypair';

/**
 * Creates a trustline flag configuring operation.
 *
 * For the flags, set them to true to enable them and false to disable them. Any
 * unmodified operations will be marked `undefined` in the result.
 *
 * Note that you can only **clear** the clawbackEnabled flag set; it must be set
 * account-wide via operations.SetOptions (setting
 * xdr.AccountFlags.clawbackEnabled).
 *
 * @function
 * @alias Operation.setTrustLineFlags
 *
 * @param {object} opts - Options object
 * @param {string} opts.trustor     - the account whose trustline this is
 * @param {Asset}  opts.asset       - the asset on the trustline
 * @param {object} opts.flags       - the set of flags to modify
 *
 * @param {bool}   [opts.flags.authorized]  - authorize account to perform
 *     transactions with its credit
 * @param {bool}   [opts.flags.authorizedToMaintainLiabilities] - authorize
 *     account to maintain and reduce liabilities for its credit
 * @param {bool}   [opts.flags.clawbackEnabled] - stop claimable balances on
 *     this trustlines from having clawbacks enabled (this flag can only be set
 *     to false!)
 * @param {string} [opts.source] - The source account for the operation.
 *                                 Defaults to the transaction's source account.
 *
 * @note You must include at least one flag.
 *
 * @return {xdr.SetTrustLineFlagsOp}
 *
 * @link xdr.AccountFlags
 * @link xdr.TrustLineFlags
 * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md#set-trustline-flags-operation
 * @see https://developers.stellar.org/docs/start/list-of-operations/#set-options
 */
export function setTrustLineFlags(opts = {}) {
  const attributes = {};

  if (typeof opts.flags !== 'object' || Object.keys(opts.flags).length === 0) {
    throw new Error('opts.flags must be an map of boolean flags to modify');
  }

  const mapping = {
    authorized: xdr.TrustLineFlags.authorizedFlag(),
    authorizedToMaintainLiabilities: xdr.TrustLineFlags.authorizedToMaintainLiabilitiesFlag(),
    clawbackEnabled: xdr.TrustLineFlags.trustlineClawbackEnabledFlag()
  };

  /* eslint no-bitwise: "off" */
  let clearFlag = 0;
  let setFlag = 0;

  Object.keys(opts.flags).forEach((flagName) => {
    if (!Object.prototype.hasOwnProperty.call(mapping, flagName)) {
      throw new Error(`unsupported flag name specified: ${flagName}`);
    }

    const flagValue = opts.flags[flagName];
    const bit = mapping[flagName].value;
    if (flagValue === true) {
      setFlag |= bit;
    } else if (flagValue === false) {
      clearFlag |= bit;
    }
  });

  attributes.trustor = Keypair.fromPublicKey(opts.trustor).xdrAccountId();
  attributes.asset = opts.asset.toXDRObject();
  attributes.clearFlags = clearFlag;
  attributes.setFlags = setFlag;

  const opAttributes = {
    body: xdr.OperationBody.setTrustLineFlags(
      new xdr.SetTrustLineFlagsOp(attributes)
    )
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
