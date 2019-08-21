import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import clone from 'lodash/clone';
import { UnsignedHyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import { xdr } from './xdr_definitions';

/**
 * Type of {@link Memo}.
 */
export const MemoNone = 'none';
/**
 * Type of {@link Memo}.
 */
export const MemoID = 'id';
/**
 * Type of {@link Memo}.
 */
export const MemoText = 'text';
/**
 * Type of {@link Memo}.
 */
export const MemoHash = 'hash';
/**
 * Type of {@link Memo}.
 */
export const MemoReturn = 'return';

export namespace MemoType {
  export type None = typeof MemoNone;
  export type ID = typeof MemoID;
  export type Text = typeof MemoText;
  export type Hash = typeof MemoHash;
  export type Return = typeof MemoReturn;
}

export type MemoType =
  | MemoType.None
  | MemoType.ID
  | MemoType.Text
  | MemoType.Hash
  | MemoType.Return;

export type MemoValue<T> =
  T extends MemoType.None ? null :
  T extends MemoType.ID ? string :
  T extends MemoType.Text ? string | Buffer : // github.com/stellar/js-stellar-base/issues/152
  T extends MemoType.Hash ? string | Buffer :
  T extends MemoType.Return ? string | Buffer
  : never;

/**
 * `Memo` represents memos attached to transactions.
 *
 * @param {string} memoType - `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
 * @param {*} value - `string` for `MemoID`, `MemoText`, buffer of hex string for `MemoHash` or `MemoReturn`
 * @see [Transactions concept](https://www.stellar.org/developers/learn/concepts/transactions.html)
 * @class Memo
 */
export class Memo<T extends MemoType = MemoType> {
  _type: T;
  _value: MemoValue<T>;

  constructor(memoType: T, value?: MemoValue<T>) {
    this._type = memoType;
    this._value = value as MemoValue<T>;

    switch (this._type) {
      case MemoNone:
        break;
      case MemoID:
        Memo._validateIdValue(value as MemoValue<MemoType.ID>);
        break;
      case MemoText:
        Memo._validateTextValue(value as MemoValue<MemoType.Text>);
        break;
      case MemoHash:
      case MemoReturn:
        Memo._validateHashValue(value as MemoValue<MemoType.Hash>);
        // We want MemoHash and MemoReturn to have Buffer as a value
        if (isString(value)) {
          this._value = Buffer.from(value, 'hex') as MemoValue<T>;
        }
        break;
      default:
        throw new Error('Invalid memo type');
    }
  }

  /**
   * Contains memo type: `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
   */
  get type(): T {
    return clone(this._type);
  }

  set type(_type: T) {
    throw new Error('Memo is immutable');
  }

  /**
   * Contains memo value:
   * * `null` for `MemoNone`,
   * * `string` for `MemoID`,
   * * `Buffer` for `MemoText` after decoding using `fromXDRObject`, original value otherwise,
   * * `Buffer` for `MemoHash`, `MemoReturn`.
   */
  get value(): MemoValue<T> {
    switch (this._type) {
      case MemoNone:
        return null as MemoValue<T>;
      case MemoID:
      case MemoText:
        return clone(this._value);
      case MemoHash:
      case MemoReturn:
        return Buffer.from(this._value as string) as MemoValue<T>;
      default:
        throw new Error('Invalid memo type');
    }
  }

  set value(_value: MemoValue<T>) {
    throw new Error('Memo is immutable');
  }

  static _validateIdValue(value: MemoValue<MemoType.ID>) {
    const error = new Error(`Expects a int64 as a string. Got ${value}`);

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

  static _validateTextValue(value: MemoValue<MemoType.Text>) {
    if (!xdr.Memo.armTypeForArm('text').isValid(value)) {
      throw new Error('Expects string, array or buffer, max 28 bytes');
    }
  }

  static _validateHashValue(value: MemoValue<MemoType.Hash>) {
    const error = new Error(
      `Expects a 32 byte hash value or hex encoded string. Got ${value}`
    );

    if (value === null || isUndefined(value)) {
      throw error;
    }

    let valueBuffer;
    if (isString(value)) {
      if (!/^[0-9A-Fa-f]{64}$/g.test(value)) {
        throw error;
      }
      valueBuffer = Buffer.from(value, 'hex');
    } else if (Buffer.isBuffer(value)) {
      valueBuffer = Buffer.from(value);
    } else {
      throw error;
    }

    if (!valueBuffer.length || valueBuffer.length !== 32) {
      throw error;
    }
  }

  /**
   * Returns an empty memo (`MemoNone`).
   * @returns {Memo}
   */
  static none(): Memo {
    return new Memo(MemoNone);
  }

  /**
   * Creates and returns a `MemoText` memo.
   * @param {string} text - memo text
   * @returns {Memo}
   */
  static text(text: MemoValue<MemoType.Text>): Memo {
    return new Memo(MemoText, text);
  }

  /**
   * Creates and returns a `MemoID` memo.
   * @param {string} id - 64-bit number represented as a string
   * @returns {Memo}
   */
  static id(id: MemoValue<MemoType.ID>): Memo {
    return new Memo(MemoID, id);
  }

  /**
   * Creates and returns a `MemoHash` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static hash(hash: MemoValue<MemoType.Hash>): Memo {
    return new Memo(MemoHash, hash);
  }

  /**
   * Creates and returns a `MemoReturn` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static return(hash: MemoValue<MemoType.Return>): Memo {
    return new Memo(MemoReturn, hash);
  }

  /**
   * Returns XDR memo object.
   * @returns {xdr.Memo}
   */
  toXDRObject(): xdr.Memo | null {
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
      default:
        return null;
    }
  }

  /**
   * Returns {@link Memo} from XDR memo object.
   * @param {xdr.Memo} xdrObject XDR memo object
   * @returns {Memo}
   */
  static fromXDRObject(xdrObject: xdr.Memo): Memo {
    switch (xdrObject.arm()) {
      case 'id':
        return Memo.id(xdrObject.value().toString());
      case 'text':
        return Memo.text(xdrObject.value());
      case 'hash':
        return Memo.hash(xdrObject.value());
      case 'retHash':
        return Memo.return(xdrObject.value());
      default:
        break;
    }

    if (typeof xdrObject.value() === 'undefined') {
      return Memo.none();
    }

    throw new Error('Unknown type');
  }
}
