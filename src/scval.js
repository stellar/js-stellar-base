import xdr from './xdr';

import { Address } from './address';
import { Contract } from './contract';
import { ScInt, XdrLargeInt, scValToBigInt } from './numbers/index';

/**
 * Attempts to convert native types into smart contract values
 * ({@link xdr.ScVal}).
 *
 * Provides conversions from smart contract XDR values ({@link xdr.ScVal}) to
 * native JavaScript types.
 *
 * The conversions are as follows:
 *
 *  - xdr.ScVal -> passthrough
 *  - null/undefined -> scvVoid
 *  - string -> scvString (a copy is made)
 *  - UintArray8 -> scvBytes (a copy is made)
 *  - boolean -> scvBool
 *
 *  - number/bigint -> the smallest possible XDR integer type that will fit the
 *    input value (if you want a specific type, use {@link ScInt})
 *
 *  - {@link Address} or {@link Contract} -> scvAddress (for contracts and
 *    public keys)
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
 * `toScVal("a string", {type: "i256"})` will throw.
 *
 * @param {any} val -       a native (or convertible) input value to wrap
 * @param {object} [opts] - an optional set of hints around the type of
 *    conversion you'd like to see
 * @param {string} [opts.type] - there is different behavior for different input
 *    types for `val`:
 *
 *     - when `val` is an integer-like type (i.e. number|bigint), this will be
 *       forwarded to {@link ScInt} or forced to be u32/i32.
 *
 *     - when `val` is an array type, this is forwarded to the recursion
 *
 *     - when `val` is an object type (key-value entries), this should be an
 *       object in which each key has a pair of types (to represent forced types
 *       for the key and the value), where `null` (or a missing entry) indicates
 *       the default interpretation(s) (refer to the examples, below)
 *
 *     - when `val` is a string type, this can be 'string' or 'symbol' to force
 *       a particular interpretation of `val`.
 *
 *     - when `val` is a bytes-like type, this can be 'string', 'symbol', or
 *       'bytes' to force a particular interpretation
 *
 *    As a simple example, `nativeToScVal("hello", {type: 'symbol'})` will
 *    return an `scvSymbol`, whereas without the type it would have been an
 *    `scvString`.
 *
 * @returns {xdr.ScVal} a wrapped, smart, XDR version of the input value
 * @throws {TypeError} if...
 *  - there are arrays with more than one type in them
 *  - there are values that do not have a sensible conversion (e.g. random XDR
 *    types, custom classes)
 *  - the type of the input object (or some inner value of said object) cannot
 *    be determined (via `typeof`)
 *  - the type you specified (via `opts.type`) is incompatible with the value
 *    you passed in (`val`), e.g. `nativeToScVal("a string", { type: 'i128' })`,
 *    though this does not apply for types that ignore `opts` (e.g. addresses).
 * @see scValToNative
 *
 * @example
 * nativeToScVal(1000);                   // gives ScValType === scvU64
 * nativeToScVal(1000n);                  // gives ScValType === scvU64
 * nativeToScVal(1n << 100n);             // gives ScValType === scvU128
 * nativeToScVal(1000, { type: 'u32' });  // gives ScValType === scvU32
 * nativeToScVal(1000, { type: 'i125' }); // gives ScValType === scvI256
 * nativeToScVal("a string");                     // gives ScValType === scvString
 * nativeToScVal("a string", { type: 'symbol' }); // gives scvSymbol
 * nativeToScVal(new Uint8Array(5));                      // scvBytes
 * nativeToScVal(new Uint8Array(5), { type: 'symbol' });  // scvSymbol
 * nativeToScVal(null); // scvVoid
 * nativeToScVal(true); // scvBool
 * nativeToScVal([1, 2, 3]);                    // gives scvVec with each element as scvU64
 * nativeToScVal([1, 2, 3], { type: 'i128' });  // scvVec<scvI128>
 * nativeToScVal({ 'hello': 1, 'world': [ true, false ] }, {
 *   type: {
 *     'hello': [ 'symbol', 'i128' ],
 *   }
 * })
 * // gives scvMap with entries: [
 * //     [ scvSymbol, scvI128 ],
 * //     [ scvString, scvArray<scvBool> ]
 * // ]
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
export function nativeToScVal(val, opts = {}) {
  switch (typeof val) {
    case 'object':
      if (val === null) {
        return xdr.ScVal.scvVoid();
      }

      if (val instanceof xdr.ScVal) {
        return val; // should we copy?
      }

      if (val instanceof Address) {
        return val.toScVal();
      }

      if (val instanceof Contract) {
        return val.address().toScVal();
      }

      if (val instanceof Uint8Array || Buffer.isBuffer(val)) {
        const copy = Uint8Array.from(val);
        switch (opts?.type ?? 'bytes') {
          case 'bytes':
            return xdr.ScVal.scvBytes(copy);
          case 'symbol':
            return xdr.ScVal.scvSymbol(copy);
          case 'string':
            return xdr.ScVal.scvString(copy);
          default:
            throw new TypeError(
              `invalid type (${opts.type}) specified for bytes-like value`
            );
        }
      }

      if (Array.isArray(val)) {
        if (val.length > 0 && val.some((v) => typeof v !== typeof val[0])) {
          throw new TypeError(
            `array values (${val}) must have the same type (types: ${val
              .map((v) => typeof v)
              .join(',')})`
          );
        }
        return xdr.ScVal.scvVec(val.map((v) => nativeToScVal(v, opts)));
      }

      if ((val.constructor?.name ?? '') !== 'Object') {
        throw new TypeError(
          `cannot interpret ${
            val.constructor?.name
          } value as ScVal (${JSON.stringify(val)})`
        );
      }

      return xdr.ScVal.scvMap(
        Object.entries(val).map(([k, v]) => {
          // the type can be specified with an entry for the key and the value,
          // e.g. val = { 'hello': 1 } and opts.type = { hello: [ 'symbol',
          // 'u128' ]} or you can use `null` for the default interpretation
          const [keyType, valType] = (opts?.type ?? {})[k] ?? [null, null];
          const keyOpts = keyType ? { type: keyType } : {};
          const valOpts = valType ? { type: valType } : {};

          return new xdr.ScMapEntry({
            key: nativeToScVal(k, keyOpts),
            val: nativeToScVal(v, valOpts)
          });
        })
      );

    case 'number':
    case 'bigint':
      switch (opts?.type) {
        case 'u32':
          return xdr.ScVal.scvU32(val);

        case 'i32':
          return xdr.ScVal.scvI32(val);

        default:
          break;
      }

      return new ScInt(val, { type: opts?.type }).toScVal();

    case 'string': {
      const optType = opts?.type ?? 'string';
      switch (optType) {
        case 'string':
          return xdr.ScVal.scvString(val);

        case 'symbol':
          return xdr.ScVal.scvSymbol(val);

        case 'address':
          return new Address(val).toScVal();

        default:
          if (XdrLargeInt.isType(optType)) {
            return new XdrLargeInt(optType, val).toScVal();
          }

          throw new TypeError(
            `invalid type (${opts.type}) specified for string value`
          );
      }
    }

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
 * Given a smart contract value, attempt to convert it to a native type.
 * Possible conversions include:
 *
 *  - void -> `null`
 *  - u32, i32 -> `number`
 *  - u64, i64, u128, i128, u256, i256 -> `bigint`
 *  - vec -> `Array` of any of the above (via recursion)
 *  - map -> key-value object of any of the above (via recursion)
 *  - bool -> `boolean`
 *  - bytes -> `Uint8Array`
 *  - symbol -> `string`
 *  - string -> `string` IF the underlying buffer can be decoded as ascii/utf8,
 *              `Uint8Array` of the raw contents in any error case
 *
 * If no viable conversion can be determined, this just "unwraps" the smart
 * value to return its underlying XDR value.
 *
 * @param {xdr.ScVal} scv - the input smart contract value
 *
 * @returns {any}
 * @see nativeToScVal
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
      return Address.fromScVal(scv).toString();

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

    // Symbols are limited to [a-zA-Z0-9_]+, so we can safely make ascii strings
    //
    // Strings, however, are "presented" as strings and we treat them as such
    // (in other words, string = bytes with a hint that it's text). If the user
    // encoded non-printable bytes in their string value, that's on them.
    //
    // Note that we assume a utf8 encoding (ascii-compatible). For other
    // encodings, you should probably use bytes anyway. If it cannot be decoded,
    // the raw bytes are returned.
    case xdr.ScValType.scvSymbol().value:
    case xdr.ScValType.scvString().value: {
      const v = scv.value(); // string|Buffer
      if (Buffer.isBuffer(v) || ArrayBuffer.isView(v)) {
        try {
          return new TextDecoder().decode(v);
        } catch (e) {
          return new Uint8Array(v.buffer); // copy of bytes
        }
      }
      return v; // string already
    }

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
