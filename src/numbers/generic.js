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
 * @example
 * ```js
 * import * as sdk from "stellar-base";
 *
 * // You have an ScVal from a contract and want to parse it into JS native.
 * const value = sdk.xdr.ScVal.fromXDR(someXdr, "base64");
 * let bigi = sdk.BigInteger.fromScVal(value);
 *
 * // You have a number and want to shove it into a contract.
 * bigi = sdk.BigInteger([1234, 5678, 9012, 3456]);
 * bigi.toBigInt() // returns (3456 << 96) | (9012 << 64) |
 * bigi.toNumber() // will throw: too large
 *
 * // Pass any to e.g. a Contract.call(), conversion happens automatically.
 * const scValU128 = bigi.toU128();
 * const scValI256 = bigi.toI256();
 * const scValU64  = bigi.toU64();
 *
 * // Lots of ways to initialize:
 * sdk.BigInteger("123456789123456789")
 * sdk.BigInteger(123456789123456789n)
 * sdk.BigInteger(["1234", "5678"])
 * sdk.BigInteger([1234, "5678", 9012n, -1])
 *
 * // If you are confident in what you're doing and want to access `.raw`
 * // directly (which is faster than conversions), you can specify the type
 * // (otherwise, it's interpreted from the numbers you pass in):
 * const i = sdk.BigInteger([1234, 5678, 9012, 3456], {type: "u256"})
 *
 * i.raw            // an sdk.U256, which can be converted to an ScVal directly
 * i.raw.toScVal()  // an xdr.ScVal with ScValType = "scvU256"
 * ```
 *
 * @param {Number|BigInt|String|Array<Number|BigInt|String>} parts - either a
 *    single integer-like value, or an arbitrary set of "pieces" of an integer
 *    to assemble into a single "big integer" value supported by Stellar (64,
 *    128, or 256 bit values), where the later values represent higher bits of
 *    the final integer. to use signed values, either pass a signed type to
 *    `opts.type`, or pass a negative value in ONLY as the last "piece" (to
 *    represent the top bits)
 *
 * @param {object}    [opts] - an object holding optional options for parsing
 * @param {string}    [opts.type] - force a specific data type, rather than
 *    relying on the input length to determine bit width. options are: i64, u64,
 *    i128, u128, i256, and u256 (default: determined by the largest element of
 *    `parts` and the slice's length)
 *
 * @throws {RangeError} if the number of parts is too large (i.e. exceeds a
 *    256-bit value), too small (i.e. a basic integer that doesn't need to be
 *    "large"), doesn't fit in the `opts.type`, or doesn't have an appropriate
 *    XDR type (e.g. 48 bits)
 *
 * @throws {TypeError} if the "signedness" of `opts` doesn't match the input
 *    value, e.g. passing `{type: 'u64'}` yet including negative parts in the
 *    input
 */
export class BigInteger {
  raw; // child class of a jsXdr.LargeInt
  type; // string, one of i64, u64, i128, u128, i256, or u256

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
        throw TypeError('FIXME');

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
  }

  constructor(parts, opts = {}) {
    // allow a single, non-array input parameter
    if (!(parts instanceof Array)) {
      parts = [parts];
    }

    parts = parts.map((i) => BigInt(i)); // normalize
    const hasSignedParts = parts.some((i) => i < 0n);
    let iType = opts.type ?? '';

    if (hasSignedParts && parts[parts.length - 1] > 0) {
      throw TypeError(`only last chunk must be negative, got ${parts}`);
    }

    if (iType.startsWith('u') && hasSignedParts) {
      throw TypeError(
        `specified type ${opts.type} yet provided negative values: ${parts}`
      );
    }

    // If unspecified, we make a best guess at the type based on:
    //
    //  - the bit length of each element in the slice
    //  - the number of elements in the slice
    //
    // the equation is:
    //
    //    len(slice) * max(dwordSize(elem) for elem in slice)
    //
    // and this must be one of 64, 128, or 256 bits.
    if (iType === '') {
      iType = !hasSignedParts ? 'u' : 'i';
      const bitlen = parts.length * Math.max(...parts.map(nearestInt));

      switch (bitlen) {
        case 64:
        case 128:
        case 256:
          iType += bitlen.toString();
          break;

        default:
          throw RangeError(
            `expected 64/128/256 bits for parts (${parts}), got ${bitlen}`
          );
      }
    }

    switch (iType) {
      case 'i64':
        this.raw = new Hyper(parts);
        break;
      case 'i128':
        this.raw = new I128(parts);
        break;
      case 'i256':
        this.raw = new I256(parts);
        break;
      case 'u64':
        this.raw = new UnsignedHyper(parts);
        break;
      case 'u128':
        this.raw = new U128(parts);
        break;
      case 'u256':
        this.raw = new U256(parts);
        break;
      default:
        throw TypeError(`invalid type: ${parts.type}`);
    }

    this.type = iType;
  }

  /**
   * @returns {Number}
   * @throws {RangeError} if the value can't fit into a Number
   */
  toNumber() {
    const bi = this.raw.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi > Number.MIN_SAFE_INTEGER) {
      throw RangeError(`value ${bi} too large for Number`);
    }

    return Number(bi);
  }

  /**
   * @returns {BigInt}
   */
  toBigInt() {
    return this.raw.toBigInt();
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

    const v = this.raw.toBigInt();
    const neg = v < 0n;
    let hi64 = 0n, lo64 = 0n;

    if (this.raw.size < 128 && neg) {
      hi64 |= (1n << 63n);  // set top (sign) bit
      lo64 = v ^ hi64;      // keep all but unset sign
      console.log(hi64, v, lo64)
    } else {
      hi64 = v >> 64n;    // grab only top 64
      lo64 = v & MAX_64;  // grab btm 64
    }

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

    const v = this.raw.toBigInt();
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

    const v = this.raw.toBigInt();
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

    const v = this.raw.toBigInt();
    const hi128 = v >>> 128n;
    const lo128 = v & MAX_128;

    // TODO
    return;
  }

  _sizeCheck(bits) {
    if (this.raw.size > bits) {
      throw RangeError(`value too large for ${bits} bits (${this.type})`);
    }
  }
}

function nearestInt(bigI) {
  const bitlen = bigI.toString(2).length - 1;
  return [32, 64, 128, 256].find((len) => bitlen <= len) ?? bitlen;
}
