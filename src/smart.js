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

/**
 * A container class for methods that convert to<-->from raw {@link xdr.ScVal}s.
 */
export class SmartParser {
  /**
   *
   * @param {any} val
   * @returns {xdr.ScVal}
   */
  static toScVal(val) {
    switch (typeof val) {
      case 'null': // if this ever becomes a thing lol
      case 'undefined':
        return xdr.ScVal.scvVoid();

      case 'function': // FIXME: Is this too helpful?
        return this.toScVal(val());

      case 'string':
        return xdr.ScVal.scvString(val);

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
        } else if (Buffer.isBuffer(val)) {
          return xdr.ScVal.scvBytes(val);
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
   *
   * @param {xdr.ScVal} scv -
   *
   * @returns {any}
   */
  static parse(scv) {
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
        return (scv.vec() ?? []).map((item) => this.parse(item));

      case xdr.ScValType.scvAddress().value:
        return Address.fromScVal(scv);

      case xdr.ScValType.scvMap().value:
        let result = {};
        (scv.map() ?? []).forEach((entry) => {
          let key = entry.key(),
            val = entry.val();
          result[this.parse(key)] = this.parse(val);
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
