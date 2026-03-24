import xdr from "../xdr.js";
import {
  OperationClass,
  ManageDataOpts,
  OperationAttributes,
} from "./types.js";

/**
 * This operation adds data entry to the ledger.
 * @alias Operation.manageData
 * @param opts - Options object
 * @param opts.name - The name of the data entry.
 * @param opts.value - The value of the data entry.
 * @param opts.source - The optional source account.
 */
export function manageData(
  this: OperationClass,
  opts: ManageDataOpts,
): xdr.Operation {
  if (!(typeof opts.name === "string" && opts.name.length <= 64)) {
    throw new Error("name must be a string, up to 64 characters");
  }

  if (
    typeof opts.value !== "string" &&
    !Buffer.isBuffer(opts.value) &&
    opts.value !== null
  ) {
    throw new Error("value must be a string, Buffer or null");
  }

  let dataValue: Buffer | null;
  if (typeof opts.value === "string") {
    dataValue = Buffer.from(opts.value);
  } else {
    dataValue = opts.value;
  }

  if (dataValue !== null && dataValue.length > 64) {
    throw new Error("value cannot be longer that 64 bytes");
  }

  const manageDataOp = new xdr.ManageDataOp({
    dataName: opts.name,
    dataValue,
  });

  const opAttributes: OperationAttributes = {
    sourceAccount: null,
    body: xdr.OperationBody.manageData(manageDataOp),
  };
  this.setSourceAccount(opAttributes, opts);

  return new xdr.Operation(
    opAttributes as {
      sourceAccount: xdr.MuxedAccount | null;
      body: xdr.OperationBody;
    },
  );
}
