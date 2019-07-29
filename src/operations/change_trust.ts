import isUndefined from 'lodash/isUndefined';
import { Hyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import xdr from '../generated/stellar-xdr_generated';

const MAX_INT64 = '9223372036854775807';

/**
 * Returns an XDR ChangeTrustOp. A "change trust" operation adds, removes, or updates a
 * trust line for a given asset from the source account to another. The issuer being
 * trusted and the asset code are in the given Asset object.
 * @function
 * @alias Operation.changeTrust
 * @param {object} opts Options object
 * @param {Asset} opts.asset - The asset for the trust line.
 * @param {string} [opts.limit] - The limit for the asset, defaults to max int64.
 *                                If the limit is set to "0" it deletes the trustline.
 * @param {string} [opts.source] - The source account (defaults to transaction source).
 * @returns {xdr.ChangeTrustOp} Change Trust operation
 */
export function changeTrust(opts) {
  const attributes = {};
  attributes.line = opts.asset.toXDRObject();
  if (!isUndefined(opts.limit) && !this.isValidAmount(opts.limit, true)) {
    throw new TypeError(this.constructAmountRequirementsError('limit'));
  }

  if (opts.limit) {
    attributes.limit = this._toXDRAmount(opts.limit);
  } else {
    attributes.limit = Hyper.fromString(new BigNumber(MAX_INT64).toString());
  }

  if (opts.source) {
    attributes.source = opts.source.masterKeypair;
  }
  const changeTrustOP = new xdr.ChangeTrustOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.changeTrust(changeTrustOP);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
