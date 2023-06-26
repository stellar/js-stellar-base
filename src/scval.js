/**
 * Provides conversions from smart contract XDR values ({@link xdr.ScVal}) to
 * native JavaScript types.
 *
 * @example
 * import { nativeToScVal, scValToNative, ScInt, xdr } from 'stellar-base';
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
 * // then, simply:
 * let scv = nativeToScVal(gigaMap);    // scv.switch() == xdr.ScValType.scvMap()
 *
 * // then...
 * someContract.call("method", scv);
 *
 * // Similarly, the inverse should work:
 * scValToNative(scv) == gigaMap;       // true
 */

import xdr from './xdr';

import { Address } from './address';
import { ScInt, scValToBigInt } from './numbers/index';

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
 *  - number/bigint -> the smallest possible XDR integer type that will fit the
 *    input value (if you want a specific type, use {@link ScInt})
 *
 *  - {@link Address} -> scvAddress (for contracts and public keys)
 *
 *  - Array<T> -> scvVec after attempting to convert each item of type `T` to an
 *    xdr.ScVal (recursively). note that all values must be the same type!
 *
 *  - object -> scvMap after attempting to convert each key and value to an
 *    xdr.ScVal (recursively). note that there is no restriction on types
 *    matching anywhere (unlike arrays)
 *
 * When passing an integer-like native value, you can also optionally specify a
 * type which will force a particular interpretation of that value.
 *
 * Note that not all type specifications are compatible with all `ScVal`s, e.g.
 * `toScVal("string", {type: i256})` will throw.
 *
 * @param {any} val         a native (or convertible) input value to wrap
 * @param {object} [opts]   an optional set of options to pass which allows you
 *      to specify a type when the native `val` is an integer-like (i.e.
 *      number|bigint) type
 *
 * @returns {xdr.ScVal} a wrapped, smart, XDR version of the input value
 *
 * @throws {TypeError} if...
 *  - there are arrays with more than one type in them
 *  - there are values that do not have a sensible conversion (e.g. random XDR
 *    types, custom classes)
 *  - the type of the input object (or some inner value of said object) cannot
 *    be determined (via `typeof`)
 *
 * TODO: Allow users to force types that are not direct but can be translated,
 *       i.e. forcing a `Buffer` to be encoded as an ScSymbol or ScString.
 */
export function nativeToScVal(val, opts = {}) {
  switch (typeof val) {
    case 'object':
      if (val === null) {
        return xdr.ScVal.scvVoid();
      }

      if (val instanceof xdr.ScVal) {
        return val;
      }

      if (val instanceof Address) {
        return val.toScVal();
      }

      if (Buffer.isBuffer(val) || val instanceof Uint8Array) {
        return xdr.ScVal.scvBytes(Buffer.from(val));
      }

      if (Array.isArray(val)) {
        if (val.length > 0 && val.some((v) => typeof v !== typeof v[0])) {
          throw new TypeError(`array value (${val}) must have a single type`);
        }
        return xdr.ScVal.scvVec(val.map(nativeToScVal));
      }

      if ((val.constructor?.name ?? '') !== 'Object') {
        throw new TypeError(
          `cannot interpret ${
            val.constructor?.name
          } value as ScVal (${JSON.stringify(val)})`
        );
      }

      return xdr.ScVal.scvMap(
        Object.entries(val).map(
          ([k, v]) =>
            new xdr.ScMapEntry({ key: nativeToScVal(k), val: nativeToScVal(v) })
        )
      );

    case 'number':
    case 'bigint':
      return new ScInt(val, opts).toScVal();

    case 'string':
      return xdr.ScVal.scvString(val.toString());

    case 'boolean':
      return xdr.ScVal.scvBool(val);

    case 'undefined':
      return xdr.ScVal.scvVoid();

    case 'function': // FIXME: Is this too helpful?
      return nativeToScVal(val());

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
export function scValToNative(scv) {
  // we use the verbose xdr.ScValType.<type>.value form here because it's faster
  // than string comparisons and the underlying constants never need to be
  // updated
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
      return (scv.vec() ?? []).map(scValToNative);

    case xdr.ScValType.scvAddress().value:
      return Address.fromScVal(scv);

    case xdr.ScValType.scvMap().value:
      return Object.fromEntries(
        (scv.map() ?? []).map((entry) => [
          scValToNative(entry.key()),
          scValToNative(entry.val())
        ])
      );

    // these return the primitive type directly
    case xdr.ScValType.scvBool().value:
    case xdr.ScValType.scvU32().value:
    case xdr.ScValType.scvI32().value:
    case xdr.ScValType.scvBytes().value:
      return scv.value();

    case xdr.ScValType.scvString().value:
    case xdr.ScValType.scvSymbol().value:
      // FIXME: Is this the right way to handle it being string|Buffer?
      return String(scv.value());

    // these can be converted to bigint
    case xdr.ScValType.scvTimepoint().value:
    case xdr.ScValType.scvDuration().value:
      return new xdr.Uint64(scv.value()).toBigInt();

    case xdr.ScValType.scvStatus().value:
      // TODO: Convert each status type into a human-readable error string?
      switch (scv.value().switch()) {
        case xdr.ScStatusType.sstOk().value:
        case xdr.ScStatusType.sstUnknownError().value:
        case xdr.ScStatusType.sstHostValueError().value:
        case xdr.ScStatusType.sstHostObjectError().value:
        case xdr.ScStatusType.sstHostFunctionError().value:
        case xdr.ScStatusType.sstHostStorageError().value:
        case xdr.ScStatusType.sstHostContextError().value:
        case xdr.ScStatusType.sstVmError().value:
        case xdr.ScStatusType.sstContractError().value:
        case xdr.ScStatusType.sstHostAuthError().value:
        default:
          break;
      }

    // in the fallthrough case, just return the underlying value directly
    default:
      return scv.value();
  }
}
