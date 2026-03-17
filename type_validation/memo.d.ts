import xdr from "./xdr.js";
/**
 * Type of {@link Memo}.
 */
export declare const MemoNone = "none";
/**
 * Type of {@link Memo}.
 */
export declare const MemoID = "id";
/**
 * Type of {@link Memo}.
 */
export declare const MemoText = "text";
/**
 * Type of {@link Memo}.
 */
export declare const MemoHash = "hash";
/**
 * Type of {@link Memo}.
 */
export declare const MemoReturn = "return";
export type MemoTypeNone = typeof MemoNone;
export type MemoTypeID = typeof MemoID;
export type MemoTypeText = typeof MemoText;
export type MemoTypeHash = typeof MemoHash;
export type MemoTypeReturn = typeof MemoReturn;
export type MemoType = MemoTypeHash | MemoTypeID | MemoTypeNone | MemoTypeReturn | MemoTypeText;
export type MemoValue = Buffer | string | null;
type MemoValueMap = {
    [MemoNone]: null;
    [MemoID]: string;
    [MemoText]: Buffer | string;
    [MemoHash]: Buffer;
    [MemoReturn]: Buffer;
};
type MemoTypeToValue<T extends MemoType> = MemoValueMap[T];
/**
 * `Memo` represents memos attached to transactions.
 *
 * @see [Transactions concept](https://developers.stellar.org/docs/glossary/transactions/)
 */
export declare class Memo<T extends MemoType = MemoType> {
    private _type;
    private _value;
    constructor(type: MemoTypeNone, value?: null);
    constructor(type: MemoTypeHash | MemoTypeReturn, value: Buffer);
    constructor(type: MemoTypeHash | MemoTypeID | MemoTypeReturn | MemoTypeText, value: string);
    constructor(type: T, value: MemoValue);
    /**
     * Contains memo type: `MemoNone`, `MemoID`, `MemoText`, `MemoHash` or `MemoReturn`
     */
    get type(): T;
    set type(_type: T);
    /**
     * Contains memo value:
     * * `null` for `MemoNone`,
     * * `string` for `MemoID`,
     * * `Buffer` for `MemoText` after decoding using `fromXDRObject`, original value otherwise,
     * * `Buffer` for `MemoHash`, `MemoReturn`.
     */
    get value(): MemoTypeToValue<T>;
    set value(_value: MemoTypeToValue<T>);
    private static _validateIdValue;
    private static _validateTextValue;
    private static _validateHashValue;
    /**
     * Returns an empty memo (`MemoNone`).
     */
    static none(): Memo<MemoTypeNone>;
    /**
     * Creates and returns a `MemoText` memo.
     *
     * @param text - memo text
     */
    static text(text: string): Memo<MemoTypeText>;
    /**
     * Creates and returns a `MemoID` memo.
     *
     * @param id - 64-bit number represented as a string
     */
    static id(id: string): Memo<MemoTypeID>;
    /**
     * Creates and returns a `MemoHash` memo.
     *
     * @param hash - 32 byte hash or hex encoded string
     */
    static hash(hash: Buffer | string): Memo<MemoTypeHash>;
    /**
     * Creates and returns a `MemoReturn` memo.
     *
     * @param hash - 32 byte hash or hex encoded string
     */
    static return(hash: Buffer | string): Memo<MemoTypeReturn>;
    /**
     * Returns XDR memo object.
     */
    toXDRObject(): xdr.Memo;
    /**
     * Returns {@link Memo} from XDR memo object.
     *
     * @param object - XDR memo object
     */
    static fromXDRObject(object: xdr.Memo): Memo;
}
export {};
