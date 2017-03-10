import {default as xdr} from "./generated/stellar-xdr_generated";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isString from "lodash/isString";
import clone from "lodash/clone";
import {UnsignedHyper} from "js-xdr";
import BigNumber from 'bignumber.js';

/**
 * Type of {@link Memo}.
 */
export const MemoNone = "none";
/**
 * Type of {@link Memo}.
 */
export const MemoID = "id";
/**
 * Type of {@link Memo}.
 */
export const MemoText = "text";
/**
 * Type of {@link Memo}.
 */
export const MemoHash = "hash";
/**
 * Type of {@link Memo}.
 */
export const MemoReturn = "return";

/**
 * `Memo` represents memos attached to transactions.
 *
 * @param {string} type - `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
 * @param {*} value - `string` for `MemoID`, `MemoText`, buffer of hex string for `MemoHash` or `MemoReturn`
 * @see [Transactions concept](https://www.stellar.org/developers/learn/concepts/transactions.html)
 * @class Memo
 */
export class Memo {
  constructor(type, value = null) {
    this._type = type;
    this._value = value;

    switch (this._type) {
      case MemoNone:
        break;
      case MemoID:
        Memo._validateIdValue(value);
        break;
      case MemoText:
        Memo._validateTextValue(value);
        break;
      case MemoHash:
      case MemoReturn:
        Memo._validateHashValue(value);
        // We want MemoHash and MemoReturn to have Buffer as a value
        if (isString(value)) {
          this._value = new Buffer(value, 'hex');
        }
        break;
      default:
        throw new Error("Invalid memo type");
    }
  }

  /**
   * Contains memo type: `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
   */
  get type() {
    return clone(this._type);
  }

  set type(type) {
    throw new Error("Memo is immutable");
  }

  /**
   * Contains memo value:
   * * `null` for `MemoNone`,
   * * `string` for `MemoID`, `MemoText`,
   * * `Buffer` for `MemoHash`, `MemoReturn`
   */
  get value() {
    switch (this._type) {
      case MemoNone:
        return null;
      case MemoID:
      case MemoText:
        return clone(this._value);
      case MemoHash:
      case MemoReturn:
        return new Buffer(this._value);
      default:
        throw new Error("Invalid memo type");
    }
  }

  set value(value) {
    throw new Error("Memo is immutable");
  }

  static _validateIdValue(value) {
    let error = new Error("Expects a int64 as a string. Got " + value);

    if (!isString(value)) {
      throw error;
    }

    let number;
    try {
      number = new BigNumber(value);
    } catch (e) {
      throw error;
    }

    // Infinity
    if (!number.isFinite()) {
      throw error;
    }

    // NaN
    if (number.isNaN()) {
      throw error;
    }
  }

  static _validateTextValue(value) {
    if (!isString(value)) {
      throw new Error("Expects string type got " + typeof(value));
    }
    if (Buffer.byteLength(value, "utf8") > 28) {
      throw new Error("Text should be <= 28 bytes. Got " + Buffer.byteLength(value, "utf8"));
    }
  }

  static _validateHashValue(value) {
    let error = new Error("Expects a 32 byte hash value or hex encoded string. Got " + value);

    if (value === null || isUndefined(value)) {
      throw error;
    }

    let valueBuffer;
    if (isString(value)) {
      if (!/^[0-9A-Fa-f]{64}$/g.test(value)) {
        throw error;
      }
      valueBuffer = new Buffer(value, 'hex');
    } else if (Buffer.isBuffer(value)) {
      valueBuffer = new Buffer(value);
    } else {
      throw error;
    }

    if (!valueBuffer.length || valueBuffer.length != 32) {
      throw error;
    }
  }

  /**
   * Returns an empty memo (`MemoNone`).
   * @returns {Memo}
   */
  static none() {
    return new Memo(MemoNone);
  }

  /**
   * Creates and returns a `MemoText` memo.
   * @param {string} text - memo text
   * @returns {Memo}
   */
  static text(text) {
    return new Memo(MemoText, text);
  }

  /**
   * Creates and returns a `MemoID` memo.
   * @param {string} id - 64-bit number represented as a string
   * @returns {Memo}
   */
  static id(id) {
    return new Memo(MemoID, id);
  }

  /**
   * Creates and returns a `MemoHash` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static hash(hash) {
    return new Memo(MemoHash, hash);
  }

  /**
   * Creates and returns a `MemoReturn` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static return(hash) {
    return new Memo(MemoReturn, hash);
  }

  /**
   * Returns XDR memo object.
   * @returns {xdr.Memo}
   */
  toXDRObject() {
    switch (this._type) {
      case MemoNone:
        return xdr.Memo.memoNone();
      case MemoID:
        return xdr.Memo.memoId(UnsignedHyper.fromString(this._value));
      case MemoText:
        return xdr.Memo.memoText(this._value);
      case MemoHash:
        return xdr.Memo.memoHash(this._value);
      case MemoReturn:
        return xdr.Memo.memoReturn(this._value);
    }
  }

  /**
   * Returns {@link Memo} from XDR memo object.
   * @param {xdr.Memo}
   * @returns {Memo}
   */
  static fromXDRObject(object) {
    switch (object.arm()) {
      case "id":
        return Memo.id(object.value().toString());
      case "text":
        return Memo.text(object.value());
      case "hash":
        return Memo.hash(object.value());
      case "retHash":
        return Memo.return(object.value());
    }

    if (typeof object.value() === "undefined") {
      return Memo.none();
    }

    throw new Error("Unknown type");
  }
}
