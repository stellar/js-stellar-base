import xdr from "./xdr.js";
import type { ScIntType } from "./numbers/index.js";
type ScValIntType = ScIntType | "i32" | "u32";
type ScValStringType = ScValIntType | "address" | "string" | "symbol";
type ScValBytesType = "bytes" | "string" | "symbol";
type ScValType = ScValBytesType | ScValIntType | ScValStringType;
type ScValMapTypeSpec = Record<string, [
    (ScValType | null)?,
    (ScValType | null)?
]>;
export interface NativeToScValOpts {
    type?: (ScValType | null)[] | ScValMapTypeSpec | ScValType | undefined;
}
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
 * @param val -       a native (or convertible) input value to wrap
 * @param opts - an optional set of hints around the type of
 *    conversion you'd like to see
 * @param opts.type - there is different behavior for different input
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
 * @throws if...
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
 * nativeToScVal([1, '2'], { type: ['i128', 'symbol'] });  // scvVec with diff types
 * nativeToScVal([1, '2', 3], { type: ['i128', 'symbol'] });
 *    // scvVec with diff types, using the default when omitted
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
 * import {
 *   nativeToScVal,
 *   scValToNative,
 *   ScInt,
 *   xdr
 * } from '@stellar/stellar-base';
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
 *   vec: ['diff', 1, 'type', 2, 'list'],
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
export declare function nativeToScVal(val: unknown, opts?: NativeToScValOpts): xdr.ScVal;
/**
 * Given a smart contract value, attempt to convert it to a native type.
 * Possible conversions include:
 *
 *  - void -> `null`
 *  - u32, i32 -> `number`
 *  - u64, i64, u128, i128, u256, i256, timepoint, duration -> `bigint`
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
 * @param scv - the input smart contract value
 *
 * @see nativeToScVal
 */
export declare function scValToNative(scv: xdr.ScVal): unknown;
/**
 * Build a sorted ScVal map from unsorted entries, sorted by key.
 *
 * @param items - the unsorted map entries
 */
export declare function scvSortedMap(items: xdr.ScMapEntry[]): xdr.ScVal;
export {};
