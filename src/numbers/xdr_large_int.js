/* eslint no-bitwise: ["error", {"allow": [">>"]}] */
import { Hyper, UnsignedHyper } from '@stellar/js-xdr';

import { Uint128 } from './uint128';
import { Uint256 } from './uint256';
import { Int128 } from './int128';
import { Int256 } from './int256';

import xdr from '../xdr';

/**
 * Provides a way to manipulate large numbers for Stellar operations.
 *
 * You must first specify the type / width / size in bits of the integer you're
 * targeting, regardless of the input value(s) you provide. Then, you pass one,
 * or a list of bigints, strings, or numbers (*whole* numbers, or this will
 * throw).
 *
 * For example, if you have a series of encoded 32-bit integers that represent a
 * larger value, you `new XdrLargeInt('u128', bytes...).toBigInt()`.
 *
 * @example
 * import { xdr, Int } from "@stellar/stellar-base";
 *
 * // You have an ScVal from a contract and want to parse it into JS native.
 * const value = xdr.ScVal.fromXDR(someXdr, "base64");
 * const i = Int.fromScVal(value);
 *
 * i.toNumber(); // gives native JS type (w/ size check)
 * i.toBigInt(); // gives the native BigInt value
 * i.toU64();    // gives ScValType-specific XDR constructs (w/ size checks)
 *
 * // You have a number and want to shove it into a contract.
 * i = new Int('i128', 0xdeadcafebabe);
 * i.toBigInt() // returns 244838016400062n
 * i.toNumber() // throws: too large
 *
 * // Pass any to e.g. a `Contract.call(...)`, conversion happens automatically
 * // regardless of the initially-specified type.
 * const scValU128 = i.toU128();
 * const scValI256 = i.toI256();
 * const scValU64  = i.toU64();
 * const scValU32  = i.toU32(); // throws: too large
 *
 * // Lots of ways to initialize:
 * Int("i256", "123456789123456789")
 * Int("u256", 123456789123456789n);
 * Int("i256", 1n << 140n);
 * Int("i32", -42);
 * Int("i256", [1, "2", 3n]);
 *
 * @param {string}  type - specifies a data type to use to represent the, one
 *    of: 'i32', 'u32', i64', 'u64', 'i128', 'u128', 'i256', and 'u256' (see
 *    {@link XdrLargeInt.isType})
 * @param {number|bigint|string|Array<number|bigint|string>} values   a list of
 *    integer-like values interpreted in big-endian order
 */
export class XdrLargeInt {
  /** @type {xdr.LargeInt|BigInt} */
  int; // child class of a jsXdr.LargeInt or a native BigInt in the case of <= 32 bits

  /** @type {string} */
  type;

  constructor(type, values) {
    if (!(values instanceof Array)) {
      values = [values];
    }

    // normalize values to one type
    values = values.map((i) => {
      // micro-optimization to no-op on the likeliest input value:
      if (typeof i === 'bigint') {
        return i;
      }
      if (typeof i.toBigInt === 'function') {
        return i.toBigInt();
      }
      return BigInt(i);
    });

    switch (type) {
      // 32 bits is a special case because there's no jsXdr.LargeInt equivalent
      // to rely on: use a BigInt and size-check it immediately.
      case 'i32':
      case 'u32':
        if (values.length > 1 || !Number.isInteger(Number(values[0]))) {
          throw new TypeError(`only 1 int is allowed for ${type}: ${values}`);
        }
        this.int = values[0];
        if (
          (type === 'i32' ? BigInt.asIntN : BigInt.asUintN)(32, this.int) !==
          this.int
        ) {
          throw new RangeError(`${this.int} is more than 32 bits`);
        }
        break;

      case 'i64':
        this.int = new Hyper(values);
        break;
      case 'i128':
        this.int = new Int128(values);
        break;
      case 'i256':
        this.int = new Int256(values);
        break;
      case 'u64':
        this.int = new UnsignedHyper(values);
        break;
      case 'u128':
        this.int = new Uint128(values);
        break;
      case 'u256':
        this.int = new Uint256(values);
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
    const bi = this.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi < Number.MIN_SAFE_INTEGER) {
      throw RangeError(
        `value ${bi} not in range for Number ` +
          `[${Number.MAX_SAFE_INTEGER}, ${Number.MIN_SAFE_INTEGER}]`
      );
    }

    return Number(bi);
  }

  /** @returns {bigint} */
  toBigInt() {
    switch (this.type) {
      case 'u32':
      case 'i32':
        return this.int;
      default:
        return this.int.toBigInt();
    }
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = U32` */
  toU32() {
    return xdr.ScVal.scvU32(this.toNumber());
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = I32` */
  toI32() {
    return xdr.ScVal.scvU32(this.toNumber());
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = I64` */
  toI64() {
    this._sizeCheck(64);
    const v = this.toBigInt();
    if (BigInt.asIntN(64, v) !== v) {
      throw RangeError(`value too large for i64: ${v}`);
    }

    return xdr.ScVal.scvI64(new xdr.Int64(v));
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = U64` */
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

    const v = this.toBigInt();
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
    const v = this.toBigInt();

    return xdr.ScVal.scvU128(
      new xdr.UInt128Parts({
        hi: new xdr.Uint64(BigInt.asUintN(64, v >> 64n)),
        lo: new xdr.Uint64(BigInt.asUintN(64, v))
      })
    );
  }

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = I256` */
  toI256() {
    const v = this.toBigInt();
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

  /** @returns {xdr.ScVal} the integer encoded with `ScValType = U256` */
  toU256() {
    const v = this.toBigInt();
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

  /** @returns {xdr.ScVal} the specified interpretation of the stored value */
  toScVal() {
    switch (this.type) {
      case 'i32':
        return this.toI32();
      case 'u32':
        return this.toU32();
      case 'i64':
        return this.toI64();
      case 'i128':
        return this.toI128();
      case 'i256':
        return this.toI256();
      case 'u64':
        return this.toU64();
      case 'u128':
        return this.toU128();
      case 'u256':
        return this.toU256();
      default:
        throw TypeError(`invalid type: ${this.type}`);
    }
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
    let tooBig = false;

    // Special case for (i|u)32: no .size to rely on, so try casting to 32 bits
    // and comparing to ensure no bits are lost.
    if (typeof this.int === 'bigint') {
      if (this.type === 'u32') {
        tooBig = BigInt.asUintN(32, this.int) !== this.int;
      } else {
        tooBig = BigInt.asIntN(32, this.int) !== this.int;
      }
    } else {
      tooBig = this.int.size > bits;
    }

    if (tooBig) {
      throw RangeError(`value too large for ${bits} bits (${this.type})`);
    }
  }

  static isType(type) {
    switch (type) {
      case 'i32':
      case 'i64':
      case 'i128':
      case 'i256':
      case 'u32':
      case 'u64':
      case 'u128':
      case 'u256':
        return true;
      default:
        return false;
    }
  }

  /**
   * Convert the raw `ScValType` string (e.g. 'scvI128', generated by the XDR)
   * to a type description for {@link XdrLargeInt} construction (e.g. 'i128')
   *
   * @param {string} scvType  the `xdr.ScValType` as a string
   * @returns {string} a suitable equivalent type to construct this object
   */
  static getType(scvType) {
    return scvType.slice(3).toLowerCase();
  }

  static fromScVal(scv) {
    const scIntType = XdrLargeInt.getType(scv.switch().name);

    switch (scv.switch().name) {
      case 'scvU32':
      case 'scvI32':
      case 'scvU64':
      case 'scvI64':
        return new XdrLargeInt(scIntType, scv.value());

      case 'scvU128':
      case 'scvI128':
        return new XdrLargeInt(scIntType, [scv.value().lo(), scv.value().hi()]);

      case 'scvU256':
      case 'scvI256':
        return new XdrLargeInt(scIntType, [
          scv.value().loLo(),
          scv.value().loHi(),
          scv.value().hiLo(),
          scv.value().hiHi()
        ]);

      default:
        throw TypeError(`expected integer type, got ${scv.switch()}`);
    }
  }

  static fromValue(value) {
    value = BigInt(value);

    // If unspecified, we make a best guess at the type based on the bit length
    // of the value, treating 32 as a minimum and 256 as a maximum.
    let type = value < 0 ? 'i' : 'u';
    const bitlen = nearestBigIntSize(value);

    switch (bitlen) {
      case 32:
      case 64:
      case 128:
      case 256:
        type += bitlen.toString();
        break;

      default:
        throw RangeError(
          `expected 32/64/128/256 bits for input (${value}), got ${bitlen}`
        );
    }

    return new XdrLargeInt(type, value);
  }
}

function nearestBigIntSize(bigI) {
  const bitlen = bigI.toString(2).length;

  // Note: Even though BigInt.toString(2) includes the negative sign for
  // negative values (???), the following is still accurate, because the
  // negative sign would be represented by a sign bit.
  return [32, 64, 128, 256].find((len) => bitlen <= len) ?? bitlen;
}
