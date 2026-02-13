import { LargeInt } from "@stellar/js-xdr";
export declare class Int128 extends LargeInt {
    /**
     * Construct a signed 128-bit integer that can be XDR-encoded.
     *
     * @param  args - one or more slices to encode
     *     in big-endian format (i.e. earlier elements are higher bits)
     */
    constructor(...args: Array<bigint | number | string>);
    get unsigned(): boolean;
    get size(): number;
}
