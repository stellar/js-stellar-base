import isString from 'lodash/isString';
import xdr from '../generated/stellar-xdr_generated';

/**
 * This operation adds data entry to the ledger.
 * @function
 * @alias Operation.manageData
 * @param {object} opts Options object
 * @param {string} opts.name - The name of the data entry.
 * @param {string|Buffer} opts.value - The value of the data entry.
 * @param {string} [opts.source] - The optional source account.
 * @returns {xdr.ManageDataOp} Manage Data operation
 */
export function manageData(opts) {
  const attributes = {};

  if (!(isString(opts.name) && opts.name.length <= 64)) {
    throw new Error('name must be a string, up to 64 characters');
  }
  attributes.dataName = opts.name;

  if (
    !isString(opts.value) &&
    !Buffer.isBuffer(opts.value) &&
    opts.value !== null
  ) {
    throw new Error('value must be a string, Buffer or null');
  }

  if (isString(opts.value)) {
    attributes.dataValue = Buffer.from(opts.value);
  } else {
    attributes.dataValue = opts.value;
  }

  if (attributes.dataValue !== null && attributes.dataValue.length > 64) {
    throw new Error('value cannot be longer that 64 bytes');
  }

  const manageDataOp = new xdr.ManageDataOp(attributes);

  const opAttributes = {};
  opAttributes.body = xdr.OperationBody.manageDatum(manageDataOp);
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(opAttributes);
}
