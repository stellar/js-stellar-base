import { LargeInt } from "@stellar/js-xdr";
export declare class Int256 extends LargeInt {
    /**
     * Construct a signed 256-bit integer that can be XDR-encoded.
     *
     * @param args - one or more slices to encode
     *     in big-endian format (i.e. earlier elements are higher bits)
     */
    constructor(...args: Array<number | bigint | string>);
    get unsigned(): boolean;
    get size(): number;
}
