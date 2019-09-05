import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import clone from 'lodash/clone';
import { UnsignedHyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import xdr from './generated/stellar-xdr_generated';

export enum MemoType {
  None = 'none',
  Text = 'text',
  Id = 'id',
  Hash = 'hash',
  Return = 'return',
}

/**
 * Type of {@link Memo}.
 * @deprecated use `(MemoType.None)` instead.
 */
export const MemoNone = (MemoType.None);
/**
 * Type of {@link Memo}.
 * @deprecated use `MemoType.Id` instead.
 */
export const MemoID = MemoType.Id;
/**
 * Type of {@link Memo}.
 * @deprecated use `MemoType.Text` instead.
 */
export const MemoText = MemoType.Text;
/**
 * Type of {@link Memo}.
 * @deprecated use `MemoType.Hash` instead.
 */
export const MemoHash = MemoType.Hash;
/**
 * Type of {@link Memo}.
 * @deprecated use `MemoType.Return` instead.
 */
export const MemoReturn = MemoType.Return;


export type MemoValue<T> =
  T extends MemoType.None ? null :
  T extends MemoType.Id ? string :
  T extends MemoType.Text ? string | Buffer : // github.com/stellar/js-stellar-base/issues/152
  T extends MemoType.Hash ? string | Buffer :
  T extends MemoType.Return ? string | Buffer
  : never;

/**
 * `Memo` represents memos attached to transactions.
 *
 * @param {string} memoType - `(MemoType.None)`, `MemoType.Id`, `MemoType.Text`, `MemoType.Hash` or `MemoType.Return`
 * @param {*} value - `string` for `MemoType.Id`, `MemoType.Text`, buffer of hex string for `MemoType.Hash` or `MemoType.Return`
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
      case (MemoType.None):
        break;
      case MemoType.Id:
        Memo._validateIdValue(value as MemoValue<MemoType.Id>);
        break;
      case MemoType.Text:
        Memo._validateTextValue(value as MemoValue<MemoType.Text>);
        break;
      case MemoType.Hash:
      case MemoType.Return:
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
   * Contains memo type: `(MemoType.None)`, `MemoType.Id`, `MemoType.Text`, `MemoType.Hash` or `MemoType.Return`.
   */
  get type(): T {
    return clone(this._type);
  }

  set type(_type: T) {
    throw new Error('Memo is immutable');
  }

  /**
   * Contains memo value:
   * * `null` for `(MemoType.None)`,
   * * `string` for `MemoType.Id`,
   * * `Buffer` for `MemoType.Text` after decoding using `fromXDRObject`, original value otherwise,
   * * `Buffer` for `MemoType.Hash`, `MemoType.Return`.
   */
  get value(): MemoValue<T> {
    switch (this._type) {
      case (MemoType.None):
        return null as MemoValue<T>;
      case MemoType.Id:
      case MemoText:
        return clone(this._value);
      case MemoType.Hash:
      case MemoType.Return:
        return Buffer.from(this._value as string) as MemoValue<T>;
      default:
        throw new Error('Invalid memo type');
    }
  }

  set value(_value: MemoValue<T>) {
    throw new Error('Memo is immutable');
  }

  static _validateIdValue(value: MemoValue<MemoType.Id>) {
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
   * Returns an empty memo (`(MemoType.None)`).
   * @returns {Memo}
   */
  static none(): Memo {
    return new Memo((MemoType.None));
  }

  /**
   * Creates and returns a `MemoType.Text` memo.
   * @param {string} text - memo text
   * @returns {Memo}
   */
  static text(text: MemoValue<MemoType.Text>): Memo {
    return new Memo(MemoType.Text, text);
  }

  /**
   * Creates and returns a `MemoType.Id` memo.
   * @param {string} id - 64-bit number represented as a string
   * @returns {Memo}
   */
  static id(id: MemoValue<MemoType.Id>): Memo {
    return new Memo(MemoType.Id, id);
  }

  /**
   * Creates and returns a `MemoType.Hash` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static hash(hash: MemoValue<MemoType.Hash>): Memo {
    return new Memo(MemoType.Hash, hash);
  }

  /**
   * Creates and returns a `MemoType.Return` memo.
   * @param {array|string} hash - 32 byte hash or hex encoded string
   * @returns {Memo}
   */
  static return(hash: MemoValue<MemoType.Return>): Memo {
    return new Memo(MemoType.Return, hash);
  }

  /**
   * Returns XDR memo object.
   * @returns {xdr.Memo}
   */
  toXDRObject(): xdr.Memo | null {
    const type: MemoType = this._type
    switch (type) {
      case (MemoType.None):
        return xdr.Memo.memoNone();
      case MemoType.Id:
        return xdr.Memo.memoId(UnsignedHyper.fromString(this._value as MemoValue<typeof type>));
      case MemoType.Text:
        return xdr.Memo.memoText(this._value as MemoValue<typeof type>);
      case MemoType.Hash:
        return xdr.Memo.memoHash(this._value as MemoValue<typeof type>);
      case MemoType.Return:
        return xdr.Memo.memoReturn(this._value as MemoValue<typeof type>);
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
