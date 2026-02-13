import xdr from "../xdr.js";
import { XdrLargeInt } from "./xdr_large_int.js";
export { Uint128 } from "./uint128.js";
export { Uint256 } from "./uint256.js";
export { Int128 } from "./int128.js";
export { Int256 } from "./int256.js";
export { ScInt } from "./sc_int.js";
export { XdrLargeInt };
/**
 * Transforms an opaque {@link xdr.ScVal} into a native bigint, if possible.
 *
 * If you then want to use this in the abstractions provided by this module,
 * you can pass it to the constructor of {@link XdrLargeInt}.
 *
 * @example
 * let scv = contract.call("add", x, y); // assume it returns an xdr.ScVal
 * let bigi = scValToBigInt(scv);
 *
 * new ScInt(bigi);               // if you don't care about types, and
 * new XdrLargeInt('i128', bigi); // if you do
 *
 * @throws {TypeError} if the `scv` input value doesn't represent an integer
 */
export declare function scValToBigInt(scv: xdr.ScVal): bigint;
