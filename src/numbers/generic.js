/* eslint no-bitwise: 0 */
import { Hyper, UnsignedHyper } from 'js-xdr';

import { U128 } from './u128';
import { I128 } from './i128';
import { I256 } from './i256';
import { U256 } from './u256';

import xdr from '../xdr';

// const MAX_32  = (1n << 32) - 1;
const MAX_64 = (1n << 64n) - 1n;
const MAX_128 = (1n << 28n) - 1n;
// const MAX_256 = (1n << 56) - 1;

/**
 * Provides an easier way to manipulate large numbers for Stellar operations.
 *
 * @param {Array<Number|BigInt|String>} parts - an arbitrary set of pieces of an
 *    integer to assemble into a single "big integer" value supported by Stellar
 *    (64, 128, or 256 bit values), where the later values represent higher bits
 *    of the final integer
 *
 * @param {object}    [opts] - an object holding optional options for parsing
 * @param {Boolean}   [opts.unsigned] - whether or not the input should be
 *    treated as unsigned (default: false)
 * @param {string}    [opts.type] - force a specific data type, rather than
 *    relying on the input length to determine bit width. options are: i64, u64,
 *    i128, u128, i256, and u256 (default: determined by `parts.length`)
 *
 * @throws {RangeError} if the number of parts is too large (i.e. exceeds a
 *    256-bit value), too small (i.e. a basic integer that doesn't need to be
 *    "large"), doesn't fit in the `opts.type`, or doesn't have an appropriate
 *    XDR type (e.g. 48 bits)
 *
 * @throws {TypeError} if the "signedness" of `opts` doesn't match the input
 *    value, e.g. passing `{unsigned: true}` yet including negative parts in the
 *    input
 */
export class BigInteger {
  _value; // child class of a jsXdr.LargeInt

  /**
   * Transforms an opaque {@link xdr.ScVal} into a {@link BigInteger}, if
   * possible. To get the underlying native BigInt value, call {@link
   * BigInteger.toBigInt} on the return value.
   *
   * @throws {TypeError} if the input value doesn't represent an integer.
   */
  static fromScVal(scv) {
    switch (scv.switch()) {
      case 'scvU32':
      case 'scvI32':
        // FIXME: Should we handle 32-bit values, or is that not our job?
        throw TypeError("FIXME");

      case 'scvU64':
      case 'scvI64':
      case 'scvU128':
      case 'scvI128':
      case 'scvU256':
      case 'scvI256':
        return new BigInteger(scv.value().slice());

      default:
        throw TypeError(`expected integer type, got ${scv.switch()}`);
    }

    return 0n;
  }

  constructor(parts, opts = {}) {
    parts = parts.map((i) => BigInt(i)); // normalize
    const hasSignedParts = parts.some((i) => i < 0n);
    const unsigned = opts.unsigned ?? !hasSignedParts;
    const iType = opts.type ?? '';

    if (unsigned && hasSignedParts) {
      throw TypeError(`specified 'unsigned' yet has negative values: ${parts}`);
    }

    if (iType.startsWith('u') && hasSignedParts) {
      throw TypeError(
        `specified unsigned type ${opts.type} yet has negative values: ${parts}`
      );
    }

    switch (iType) {
      case '':
        break;
      case 'i64':
        this._value = new Hyper(parts);
        break;
      case 'i128':
        this._value = new I128(parts);
        break;
      case 'i256':
        this._value = new I256(parts);
        break;
      case 'u64':
        this._value = new UnsignedHyper(parts);
        break;
      case 'u128':
        this._value = new U128(parts);
        break;
      case 'u256':
        this._value = new U256(parts);
        break;
      default:
        throw TypeError(`invalid type: ${parts.type}`);
    }

    switch (parts.length) {
      case 2: // 64 bits
        this._value = unsigned ? new UnsignedHyper(parts) : new Hyper(parts);
        break;

      case 4: // 128 bits
        this._value = unsigned ? new U128(parts) : new I128(parts);
        break;

      case 8: // 256 bits
        this._value = unsigned ? new U256(parts) : new I256(parts);
        break;

      default:
        throw RangeError(`${parts}`);
    }
  }

  /**
   * @returns {Number}
   * @throws {RangeError} if the value can't fit into a Number
   */
  toNumber() {
    const bi = this._value.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi > Number.MIN_SAFE_INTEGER) {
      throw RangeError(`value ${bi} is not in Number range`);
    }

    return Number(bi);
  }

  /**
   * @returns {BigInt}
   */
  toBigInt() {
    return this._value.toBigInt();
  }

  toI64() {
    this._sizeCheck(64);
  }

  toU64() {
    this._sizeCheck(64);
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toI128() {
    this._sizeCheck(128);

    const v = this._value.toBigInt();
    const hi64 = v >> 64n;
    const lo64 = v & MAX_64;

    return xdr.ScVal.scvI128(
      new xdr.Int128Parts({
        hi: new xdr.Int64(hi64),
        lo: new xdr.Uint64(lo64)
      })
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = U128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toU128() {
    this._sizeCheck(128);

    const v = this._value.toBigInt();
    const hi64 = v >> 64n;
    const lo64 = v & MAX_64;

    return xdr.ScVal.scvU128(
      new xdr.UInt128Parts({
        hi: xdr.UInt64(hi64),
        lo: xdr.Uint64(lo64)
      })
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I256`
   * @throws {RangeError} if the value cannot fit in 256 bits
   */
  toI256() {
    this._sizeCheck(256);

    const v = this._value.toBigInt();
    const hi128 = v >> 128n;
    const lo128 = v & MAX_128;

    // TODO
    return;
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = U256`
   * @throws {RangeError} if the value cannot fit in 256 bits
   */
  toU256() {
    this._sizeCheck(256);

    const v = this._value.toBigInt();
    const hi128 = v >>> 128n;
    const lo128 = v & MAX_128;

    // TODO
    return;
  }

  _sizeCheck(bits) {
    if (this._value.size > bits) {
      throw RangeError(`value too large for ${bits} bits (${this._value})`);
    }
  }
}
