/* eslint no-bitwise: ["error", {"allow": [">>"]}] */
import { Hyper, UnsignedHyper } from "@stellar/js-xdr";

import { Uint128 } from "./uint128";
import { Uint256 } from "./uint256";
import { Int128 } from "./int128";
import { Int256 } from "./int256";

// TODO: remove this after pulling the latest update
// @ts-ignore
import xdr from "../xdr.js";

type XdrLargeIntValues =
  | Array<bigint | number | string>
  | bigint
  | number
  | string;
type BigIntLike = { toBigInt(): bigint };
type XdrLargeIntType =
  | "i64"
  | "i128"
  | "i256"
  | "u64"
  | "u128"
  | "u256"
  | "timepoint"
  | "duration";

/**
 * A wrapper class to represent large XDR-encodable integers.
 *
 * This operates at a lower level than {@link ScInt} by forcing you to specify
 * the type / width / size in bits of the integer you're targeting, regardless
 * of the input value(s) you provide.
 */
export class XdrLargeInt {
  // child class of a jsXdr.LargeInt
  int: xdr.LargeInt;
  type: XdrLargeIntType;

  /**
   * @param type - specifies a data type to use to represent the integer, one
   *    of: 'i64', 'u64', 'i128', 'u128', 'i256', and 'u256' (see
   *    {@link XdrLargeInt.isType})
   * @param values - a list of integer-like values interpreted in big-endian order
   */
  constructor(type: XdrLargeIntType, values: XdrLargeIntValues) {
    if (!(values instanceof Array)) {
      values = [values];
    }

    // normalize values to one type
    values = values.map((i) => {
      // micro-optimization to no-op on the likeliest input value:
      if (typeof i === "bigint") {
        return i;
      }
      if (
        typeof i === "object" &&
        i !== null &&
        "toBigInt" in i &&
        typeof (i as BigIntLike).toBigInt === "function"
      ) {
        return (i as BigIntLike).toBigInt();
      }
      return BigInt(i);
    });

    // Note: API difference in XDR constructors:
    // - Hyper/UnsignedHyper accept an array parameter
    // - Int128/Uint128/Int256/Uint256 accept rest parameters (require spread operator)
    switch (type) {
      case "i64":
        this.int = new Hyper(values);
        break;
      case "i128":
        this.int = new Int128(...values);
        break;
      case "i256":
        this.int = new Int256(...values);
        break;
      case "u64":
      case "timepoint":
      case "duration":
        this.int = new UnsignedHyper(values);
        break;
      case "u128":
        this.int = new Uint128(...values);
        break;
      case "u256":
        this.int = new Uint256(...values);
        break;
      default:
        throw TypeError(`invalid type: ${type}`);
    }

    this.type = type;
  }

  /**
   * @throws {RangeError} if the value can't fit into a Number
   */
  toNumber(): number {
    const bi = this.int.toBigInt();
    if (bi > Number.MAX_SAFE_INTEGER || bi < Number.MIN_SAFE_INTEGER) {
      throw RangeError(
        `value ${bi} not in range for Number ` +
          `[${Number.MAX_SAFE_INTEGER}, ${Number.MIN_SAFE_INTEGER}]`,
      );
    }

    return Number(bi);
  }

  toBigInt(): bigint {
    return this.int.toBigInt();
  }

  /**
   * The integer encoded with `ScValType = I64`
   * @throws {RangeError} if the value cannot fit in 64 bits
   */
  toI64(): xdr.ScVal {
    this._sizeCheck(64);
    const v = this.toBigInt();
    if (BigInt.asIntN(64, v) !== v) {
      throw RangeError(`value too large for i64: ${v}`);
    }

    return xdr.ScVal.scvI64(new xdr.Int64(v));
  }

  /** The integer encoded with `ScValType = U64` */
  toU64(): xdr.ScVal {
    this._sizeCheck(64);
    return xdr.ScVal.scvU64(
      new xdr.Uint64(BigInt.asUintN(64, this.toBigInt())), // reiterpret as unsigned
    );
  }

  /** The integer encoded with `ScValType = Timepoint` */
  toTimepoint(): xdr.ScVal {
    this._sizeCheck(64);
    return xdr.ScVal.scvTimepoint(
      new xdr.Uint64(BigInt.asUintN(64, this.toBigInt())), // reiterpret as unsigned
    );
  }

  /** The integer encoded with `ScValType = Duration` */
  toDuration(): xdr.ScVal {
    this._sizeCheck(64);
    return xdr.ScVal.scvDuration(
      new xdr.Uint64(BigInt.asUintN(64, this.toBigInt())), // reiterpret as unsigned
    );
  }

  /**
   * The integer encoded with `ScValType = I128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toI128(): xdr.ScVal {
    this._sizeCheck(128);

    const v = this.int.toBigInt();
    const hi64 = BigInt.asIntN(64, v >> 64n); // encode top 64 w/ sign bit
    const lo64 = BigInt.asUintN(64, v); // grab btm 64, encode sign

    return xdr.ScVal.scvI128(
      new xdr.Int128Parts({
        hi: new xdr.Int64(hi64),
        lo: new xdr.Uint64(lo64),
      }),
    );
  }

  /**
   * The integer encoded with `ScValType = U128`
   * @throws {RangeError} if the value cannot fit in 128 bits
   */
  toU128(): xdr.ScVal {
    this._sizeCheck(128);
    const v = this.int.toBigInt();

    return xdr.ScVal.scvU128(
      new xdr.UInt128Parts({
        hi: new xdr.Uint64(BigInt.asUintN(64, v >> 64n)),
        lo: new xdr.Uint64(BigInt.asUintN(64, v)),
      }),
    );
  }

  /**
   * The integer encoded with `ScValType = I256`
   *
   * Note: No size check needed - I256 is the largest signed type.
   */
  toI256(): xdr.ScVal {
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
        loLo: new xdr.Uint64(loLo64),
      }),
    );
  }

  /**
   * The integer encoded with `ScValType = U256`
   *
   * Note: No size check needed - U256 is the largest unsigned type.
   */
  toU256(): xdr.ScVal {
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
        loLo: new xdr.Uint64(loLo64),
      }),
    );
  }

  /** The smallest interpretation of the stored value */
  toScVal(): xdr.ScVal {
    switch (this.type) {
      case "i64":
        return this.toI64();
      case "i128":
        return this.toI128();
      case "i256":
        return this.toI256();
      case "u64":
        return this.toU64();
      case "u128":
        return this.toU128();
      case "u256":
        return this.toU256();
      case "timepoint":
        return this.toTimepoint();
      case "duration":
        return this.toDuration();
      default:
        throw TypeError(`invalid type: ${this.type}`);
    }
  }

  valueOf(): any {
    return this.int.valueOf();
  }

  toString(): string {
    return this.int.toString();
  }

  toJSON(): { value: string; type: string } {
    return {
      value: this.toBigInt().toString(),
      type: this.type,
    };
  }

  _sizeCheck(bits: number): void {
    if (this.int.size > bits) {
      throw RangeError(`value too large for ${bits} bits (${this.type})`);
    }
  }

  static isType(type: string): type is XdrLargeIntType {
    switch (type) {
      case "i64":
      case "i128":
      case "i256":
      case "u64":
      case "u128":
      case "u256":
      case "timepoint":
      case "duration":
        return true;
      default:
        return false;
    }
  }

  /**
   * Convert the raw `ScValType` string (e.g. 'scvI128', generated by the XDR)
   * to a type description for {@link XdrLargeInt} construction (e.g. 'i128')
   *
   * @param scvType the `xdr.ScValType` as a string
   * @returns a suitable equivalent type to construct this object
   */
  static getType(scvType: string): string {
    return scvType.slice(3).toLowerCase();
  }
}
