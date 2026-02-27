import xdr from "./xdr.js";
/**
 * Create a new Address object.
 *
 * `Address` represents a single address in the Stellar network that can be
 * inputted to or outputted by a smart contract. An address can represent an
 * account, muxed account, contract, claimable balance, or a liquidity pool
 * (the latter two can only be present as the *output* of Core in the form
 * of an event, never an input to a smart contract).
 *
 * @constructor
 *
 * @param address - a {@link StrKey} of the address value
 */
export declare class Address {
    private _type;
    private _key;
    constructor(address: string);
    /**
     * Parses a string and returns an Address object.
     *
     * @param address - The address to parse. ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`
     */
    static fromString(address: string): Address;
    /**
     * Creates a new account Address object from a buffer of raw bytes.
     *
     * @param buffer - The bytes of an address to parse.
     */
    static account(buffer: Buffer): Address;
    /**
     * Creates a new contract Address object from a buffer of raw bytes.
     *
     * @param buffer - The bytes of an address to parse.
     */
    static contract(buffer: Buffer): Address;
    /**
     * Creates a new claimable balance Address object from a buffer of raw bytes.
     *
     * @param buffer - The bytes of a claimable balance ID to parse.
     */
    static claimableBalance(buffer: Buffer): Address;
    /**
     * Creates a new liquidity pool Address object from a buffer of raw bytes.
     *
     * @param buffer - The bytes of an LP ID to parse.
     */
    static liquidityPool(buffer: Buffer): Address;
    /**
     * Creates a new muxed account Address object from a buffer of raw bytes.
     *
     * @param buffer - The bytes of an address to parse.
     */
    static muxedAccount(buffer: Buffer): Address;
    /**
     * Convert this from an xdr.ScVal type.
     *
     * @param scVal - The xdr.ScVal type to parse
     */
    static fromScVal(scVal: xdr.ScVal): Address;
    /**
     * Convert this from an xdr.ScAddress type
     *
     * @param scAddress - The xdr.ScAddress type to parse
     */
    static fromScAddress(scAddress: xdr.ScAddress): Address;
    /**
     * Serialize an address to string.
     */
    toString(): string;
    /**
     * Convert this Address to an xdr.ScVal type.
     */
    toScVal(): xdr.ScVal;
    /**
     * Convert this Address to an xdr.ScAddress type.
     */
    toScAddress(): xdr.ScAddress;
    /**
     * Return the raw public key bytes for this address.
     */
    toBuffer(): Buffer;
}
