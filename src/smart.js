/**
 * Provides conversions from smart contract XDR values ({@link xdr.ScVal}) to
 * native JavaScript types.
 *
 * @example
 * import { ScValParser, ScInt } from 'stellar-base';
 *
 * let gigaMap = {
 *   bool: true,
 *   void: null,
 *   u32: xdr.ScVal.scvU32(1),
 *   i32: xdr.ScVal.scvI32(1),
 *   u64: 1n,
 *   i64: -1n,
 *   u128: new ScInt(1).toU128(),
 *   i128: new ScInt(1).toI128(),
 *   u256: new ScInt(1).toU256(),
 *   i256: new ScInt(1).toI256(),
 *   map: {
 *     arbitrary: 1n,
 *     nested: 'values',
 *     etc: false
 *   },
 *   vec: ['same', 'type', 'list'],
 * };
 *
 * // if you don't know the type (or don't care), then:
 * let scv = ScValParser.toScVal(gigaMap);
 * // or, if you don't want type detection:
 * scv = ScValParser.toScMap(gigaMap);
 * // where scv.switch() == xdr.ScValType.scvMap()
 *
 * // then...
 * someContract.call("method", scv);
 */
import xdr from './xdr';

import { Address } from './address';
import { ScInt, scValToBigInt } from './numbers/index';
import { isUint8Array } from 'util/types';

/**
 * A container class for methods that convert to<-->from raw {@link xdr.ScVal}s.
 */
export class SmartParser {
  /**
   * Attempts to convert native types into smart contract values
   * ({@link xdr.ScVal}).
   *
   * The conversions are as follows:
   *
   *  - xdr.ScVal -> passthrough
   *  - null/undefined -> scvVoid
   *  - string -> scvString (a copy is made)
   *  - UintArray8/Buffer -> scvBytes (a copy is made)
   *  - boolean -> scvBool
   *
   *  - number/bigint -> the smallest possible integer type that will fit the
   *    input value; if you want a specific type, you should use {@link ScInt}
   *    and either pass a `type` option or call the appropriate `.to<size>()`
   *    conversion helper.
   *
   *  - {@link Address} -> scvAddress (for contracts and public keys)
   *
   *  - Array<T> -> scvVec after attempting to convert each item of type `T` to
   *    an xdr.ScVal (recursively). note that all values must be the same type!
   *
   *  - object -> scvMap after attempting to convert each key and value to an
   *    xdr.ScVal (recursively). note that there is no restriction on types
   *    matching anywhere (unlike arrays)
   *
   *
   * @param {any} val a native input value to wrap
   *
   * @returns {xdr.ScVal} a "wrapped" version of the input value
   *
   * @throws {TypeError} if the type of the input object (or some inner value of
   *    said object) cannot be determined (via `typeof`).
   */
  static toScVal(val) {
    switch (typeof val) {
      case 'null': // if this ever becomes a thing lol
      case 'undefined':
        return xdr.ScVal.scvVoid();

      case 'function': // FIXME: Is this too helpful?
        return this.toScVal(val());

      case 'string':
        return xdr.ScVal.scvString(val.toString());

      case 'boolean':
        return xdr.ScVal.scvBool(val);

      // Users should just prefer `ScInt` with a type specification if they care
      // about the kind of number interpretation they get, right?
      case 'number':
      case 'bigint':
        return new ScInt(val).toScVal();

      case 'object':
        if (val instanceof xdr.ScVal) {
          return val;
        } else if (val === null) {
          return xdr.ScVal.scvVoid();
        } else if (Buffer.isBuffer(val) || isUint8Array(val)) {
          return xdr.ScVal.scvBytes(Buffer.from(val));
        } else if (val instanceof Address) {
          return val.toScVal();
        } else if (Array.isArray(val)) {
          if (val.length > 0 && val.some((v) => typeof v !== typeof v[0])) {
            throw new TypeError(`array value (${val}) must have a single type`);
          }
          return xdr.ScVal.scvVec(val.map(this.toScVal));
        } else if ((val.constructor?.name ?? '') !== 'Object') {
          throw new TypeError(`cannot interpret ${val.constructor?.name} value as ScVal (${val})`)
        } else {
          return xdr.ScVal.scvMap(
            Object.entries(val).map(([key, val], i) => {
              return new xdr.ScMapEntry({
                key: this.toScVal(key),
                val: this.toScVal(val)
              });
            })
          );
        }

      default:
        throw new TypeError(`failed to convert typeof ${typeof val} (${val})`);
    }
  }

  /**
   * Given a smart contract value, attempt to convert to a native type.
   *
   * Possible conversions include:
   *
   *  - void -> null
   *  - u32, i32 -> number
   *  - u64, i64, u128, i128, u256, i256 -> bigint
   *  - vec -> array of any of the above (via recursion)
   *  - map -> key-value object of any of the above (via recursion)
   *  - bool -> boolean
   *  - bytes -> Uint8Array
   *  - string, symbol -> string
   *
   * If no conversion can be made, this just "unwraps" the smart value to return
   * its underlying XDR value.
   *
   * @param {xdr.ScVal} scv - the input smart contract value
   *
   * @returns {any}
   */
  static fromScVal(scv) {
    // we use the verbose xdr.ScValType.<type>.value form here because it's
    // faster than string comparisons and the underlying constants never need to
    // be updated
    switch (scv.switch().value) {
      case xdr.ScValType.scvVoid().value:
        return null;

      // these can be converted to bigints directly
      case xdr.ScValType.scvU64().value:
      case xdr.ScValType.scvI64().value:
        return scv.value().toBigInt();

      // these can be parsed by internal abstractions note that this can also
      // handle the above two cases, but it's not as efficient (another
      // type-check, parsing, etc.)
      case xdr.ScValType.scvU128().value:
      case xdr.ScValType.scvI128().value:
      case xdr.ScValType.scvU256().value:
      case xdr.ScValType.scvI256().value:
        return scValToBigInt(scv);

      case xdr.ScValType.scvVec().value:
        return (scv.vec() ?? []).map((item) => this.fromScVal(item));

      case xdr.ScValType.scvAddress().value:
        return Address.fromScVal(scv);

      case xdr.ScValType.scvMap().value:
        let result = {};
        (scv.map() ?? []).forEach((entry) => {
          let key = entry.key(),
            val = entry.val();
          result[this.fromScVal(key)] = this.fromScVal(val);
        });
        return result;

      // these return the primitive type directly
      case xdr.ScValType.scvBool().value:
      case xdr.ScValType.scvU32().value:
      case xdr.ScValType.scvI32().value:
      case xdr.ScValType.scvBytes().value:
      case xdr.ScValType.scvString().value: // string OR Buffer
      case xdr.ScValType.scvSymbol().value: // string OR Buffer
        return scv.value();

      // in the fallthrough case, just return the underlying value directly
      default:
        return scv.value();
    }
  }
}
