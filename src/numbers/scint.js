/* eslint no-bitwise: 0 */
import { Hyper, UnsignedHyper } from 'js-xdr';

import { U128 } from './u128';
import { I128 } from './i128';
import { I256 } from './i256';
import { U256 } from './u256';

import xdr from '../xdr';

export class XdrInt {
  int; // child class of a jsXdr.LargeInt
  type; // string, one of i64, u64, i128, u128, i256, or u256

  /**
   * Transforms an opaque {@link xdr.ScVal} into a native BigInt, if possible.
   *
   * You can then give this back to create an {@link ScInt} instance, but the
   * rationale here is that the native type is more likely to be immediately
   * useful.
   *
   * @param {xdr.ScVal} scv - the raw XDR value to parse into an integer
   * @returns {bigint} the integer value, regardless of size (even 32-bit)
   * @throws {TypeError} if the input value doesn't represent an integer
   */
  static fromScVal(scv) {
    switch (scv.switch().name) {
      case 'scvU32':
      case 'scvI32':
        return BigInt(scv.value());

      case 'scvU64':
      case 'scvI64':
        return scv.value().toBigInt();

      case 'scvU128':
        return new U128(scv.value().lo(), scv.value().hi()).toBigInt();

      case 'scvI128':
        return new I128(scv.value().lo(), scv.value().hi()).toBigInt();

      case 'scvU256':
        return new U256(
          scv.value().loLo(),
          scv.value().loHi(),
          scv.value().hiLo(),
          scv.value().hiHi()
        ).toBigInt();

      case 'scvI256':
        return new I256(
          scv.value().loLo(),
          scv.value().loHi(),
          scv.value().hiLo(),
          scv.value().hiHi()
        ).toBigInt();

      default:
        throw TypeError(`expected integer type, got ${scv.switch()}`);
    }
  }

  /**
   * Constructs an instance from a "large integer"-like XDR type.
   *
   * @param {xdr.LargeInt} i - the XDR instance
   * @returns {ScInt} the parsed value set up with the specified type
   *
   * @see {@link I128} {@link U128} {@link I256} {@link U256}
   */
  static fromXdrInt(i) {
    return new ScInt(i.toBigInt(), {
      type: `${i.unsigned ? 'u' : 'i'}${i.size}`
    });
  }

  constructor(type, values) {
    if (!(values instanceof Array)) {
      values = [values];
    }

    // normalize values to one type
    values = values.map((i) => {
      // micro-optimization to no-op the likeliest input value:
      if (typeof i === 'bigint') {
        return i;
      } else if (i instanceof XdrInt) {
        return i.toBigInt();
      }
      return BigInt(i);
    });

    switch (type) {
      case 'i64':
        this.int = new Hyper(values);
        break;
      case 'i128':
        this.int = new I128(values);
        break;
      case 'i256':
        this.int = new I256(values);
        break;
      case 'u64':
        this.int = new UnsignedHyper(values);
        break;
      case 'u128':
        this.int = new U128(values);
        break;
      case 'u256':
        this.int = new U256(values);
        break;
      default:
        throw TypeError(`invalid type: ${type}`);
    }

    this.type = type;
  }

  /**
   * @returns {number}
   * @throws {RangeError} if the value can't fit into a Number
   */
  toNumber() {
    const bi = this.int.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi < Number.MIN_SAFE_INTEGER) {
      throw RangeError(`value ${bi} too large for Number`);
    }

    return Number(bi);
  }

  /**
   * @returns {bigint}
   */
  toBigInt() {
    return this.int.toBigInt();
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I64`
   */
  toI64() {
    this._sizeCheck(64);
    const v = this.toBigInt();
    if (BigInt.asIntN(64, v) !== v) {
      throw RangeError(`value too large for i64: ${v}`);
    }

    return xdr.ScVal.scvI64(new xdr.Int64(v));
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = U64`
   */
  toU64() {
    this._sizeCheck(64);
    return xdr.ScVal.scvU64(
      new xdr.Uint64(BigInt.asUintN(64, this.toBigInt())) // reiterpret as unsigned
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toI128() {
    this._sizeCheck(128);

    const v = this.int.toBigInt();
    const hi64 = BigInt.asIntN(64, v >> 64n); // encode top 64 w/ sign bit
    const lo64 = BigInt.asUintN(64, v); // grab btm 64, encode sign

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
    const v = this.int.toBigInt();

    return xdr.ScVal.scvU128(
      new xdr.UInt128Parts({
        hi: new xdr.Uint64(BigInt.asUintN(64, v >> 64n)),
        lo: new xdr.Uint64(BigInt.asUintN(64, v))
      })
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = I256`
   */
  toI256() {
    const v = this.int.toBigInt();
    const hiHi64 = BigInt.asIntN(64, v >> 192n); // keep sign bit
    const hiLo64 = BigInt.asUintN(64, v >> 128n);
    const loHi64 = BigInt.asUintN(64, v >> 64n);
    const loLo64 = BigInt.asUintN(64, v);

    return xdr.ScVal.scvI256(
      new xdr.Int256Parts({
        hiHi: new xdr.Int64(hiHi64),
        hiLo: new xdr.Uint64(hiLo64),
        loHi: new xdr.Uint64(loHi64),
        loLo: new xdr.Uint64(loLo64)
      })
    );
  }

  /**
   * @returns {xdr.ScVal} the integer encoded with `ScValType = U256`
   */
  toU256() {
    const v = this.int.toBigInt();
    const hiHi64 = BigInt.asUintN(64, v >> 192n); // encode sign bit
    const hiLo64 = BigInt.asUintN(64, v >> 128n);
    const loHi64 = BigInt.asUintN(64, v >> 64n);
    const loLo64 = BigInt.asUintN(64, v);

    return xdr.ScVal.scvU256(
      new xdr.UInt256Parts({
        hiHi: new xdr.Uint64(hiHi64),
        hiLo: new xdr.Uint64(hiLo64),
        loHi: new xdr.Uint64(loHi64),
        loLo: new xdr.Uint64(loLo64)
      })
    );
  }

  valueOf() {
    return this.int.valueOf();
  }

  toString() {
    return this.int.toString();
  }

  toJSON() {
    return {
      value: this.toBigInt().toString(),
      type: this.type
    };
  }

  _sizeCheck(bits) {
    if (this.int.size > bits) {
      throw RangeError(`value too large for ${bits} bits (${this.type})`);
    }
  }
}

/**
 * Provides an easier way to manipulate large numbers for Stellar operations.
 *
 * You can instantiate this value either from bigints, strings, or numbers
 * (whole numbers, or this will throw).
 *
 * If you need to create a native BigInt from a list of integer "parts" (for
 * example, you have a series of encoded 32-bit integers that represent a larger
 * value), you should use the specific XDR type, like {@link U128}. For example,
 * you could do `new U128(values...).toBigInt()`.
 *
 * @example
 * ```js
 * import sdk from "stellar-base";
 *
 * // You have an ScVal from a contract and want to parse it into JS native.
 * const value = sdk.xdr.ScVal.fromXDR(someXdr, "base64");
 * const bigi = sdk.ScInt.fromScVal(value); // grab it as a BigInt
 * let sci = new ScInt(bigi);
 *
 * sci.toNumber(); // gives native JS type (w/ size check)
 * sci.toBigInt(); // gives the native BigInt value
 * sci.toU64();    // gives ScValType-specific XDR constructs (with size checks)
 *
 * // You have a number and want to shove it into a contract.
 * sci = sdk.ScInt(0xdeadcafebabe);
 * sci.toBigInt() // returns 244838016400062n
 * sci.toNumber() // throws: too large
 *
 * // Pass any to e.g. a Contract.call(), conversion happens automatically
 * // regardless of the initial type.
 * const scValU128 = sci.toU128();
 * const scValI256 = sci.toI256();
 * const scValU64  = sci.toU64();
 *
 * // Lots of ways to initialize:
 * sdk.ScInt("123456789123456789")
 * sdk.ScInt(123456789123456789n);
 * sdk.ScInt(1n << 140n);
 * sdk.ScInt(-42);
 * sdk.ScInt.fromScVal(scValU128); // from above
 *
 * // If you know the type ahead of time (accessing `.raw` is faster than
 * // conversions), you can specify the type directly (otherwise, it's
 * // interpreted from the numbers you pass in):
 * const i = sdk.ScInt(123456789n, { type: "u256" });
 *
 * // For example, you can use the underlying `sdk.U256` and convert it to an
 * // `xdr.ScVal` directly like so:
 * const scv = new xdr.ScVal.scvU256(i.raw);
 *
 * // Or reinterpret it as a different type (size permitting):
 * const scv = i.toI64();
 * ```
 *
 * @param {number|bigint|string|ScInt} value - a single, integer-like value
 *    which will be interpreted in the smallest appropriate XDR type supported
 *    by Stellar (64, 128, or 256 bit integer values). signed values are
 *    supported, though they are sanity-checked against `opts.type`. if you need
 *    32-bit values, you can construct them directly without needing this
 *    wrapper, e.g. `xdr.ScVal.scvU32(1234)`.
 *
 * @param {object}  [opts] - an optional object controlling optional parameters
 * @param {string}  [opts.type] - force a specific data type. the type choices
 *    are: 'i64', 'u64', 'i128', 'u128', 'i256', and 'u256' (default: the
 *    smallest one that fits the `value`)
 *
 * @throws {RangeError} if the `value` is invalid (e.g. floating point), too
 *    large (i.e. exceeds a 256-bit value), or doesn't fit in the `opts.type`
 *
 * @throws {TypeError} on missing parameters, or if the "signedness" of `opts`
 *    doesn't match input `value`, e.g. passing `{type: 'u64'}` yet passing -1n
 *
 * @throws {SyntaxError} if a string `value` can't be parsed as a big integer
 */
export class ScInt extends XdrInt {
  constructor(value, opts) {
    const signed = value < 0;
    let type = opts?.type ?? '';
    if (type.startsWith('u') && signed) {
      throw TypeError(`specified type ${opts.type} yet negative (${value})`);
    }

    // If unspecified, we make a best guess at the type based on the bit length
    // of the value, treating 64 as a minimum and 256 as a maximum.
    if (type === '') {
      type = signed ? 'i' : 'u';
      const bitlen = nearestBigIntSize(value);

      switch (bitlen) {
        case 64:
        case 128:
        case 256:
          type += bitlen.toString();
          break;

        default:
          throw RangeError(
            `expected 64/128/256 bits for parts (${value}), got ${bitlen}`
          );
      }
    }

    super(type, value);
  }
}

function nearestBigIntSize(bigI) {
  // Note: Even though BigInt.toString(2) includes the negative sign for
  // negative values (???), the following is still accurate, because the
  // negative sign would be represented by a sign bit.
  const bitlen = bigI.toString(2).length;
  return [64, 128, 256].find((len) => bitlen <= len) ?? bitlen;
}

export { U128, I128, U256, I256 };
