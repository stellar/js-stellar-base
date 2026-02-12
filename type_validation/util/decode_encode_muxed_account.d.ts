import xdr from "../xdr.js";
/**
 * Converts a Stellar address (in G... or M... form) to an `xdr.MuxedAccount`
 * structure, using the ed25519 representation when possible.
 *
 * This supports full muxed accounts, where an `M...` address will resolve to
 * both its underlying `G...` address and an integer ID.
 *
 * @param   address   G... or M... address to encode into XDR
 * @returns a muxed account object for this address string
 */
export declare function decodeAddressToMuxedAccount(address: string): xdr.MuxedAccount;
/**
 * Converts an xdr.MuxedAccount to its StrKey representation.
 *
 * This returns its "M..." string representation if there is a muxing ID within
 * the object and returns the "G..." representation otherwise.
 *
 * @param   muxedAccount   Raw account to stringify
 * @returns Stringified G... (corresponding to the underlying pubkey)
 *     or M... address (corresponding to both the key and the muxed ID)
 *
 * @see https://stellar.org/protocol/sep-23
 */
export declare function encodeMuxedAccountToAddress(muxedAccount: xdr.MuxedAccount): string;
/**
 * Transform a Stellar address (G...) and an ID into its XDR representation.
 *
 * @param  address   - a Stellar G... address
 * @param  id        - a Uint64 ID represented as a string
 *
 * @return XDR representation of the above muxed account
 */
export declare function encodeMuxedAccount(address: string, id: string): xdr.MuxedAccount;
/**
 * Extracts the underlying base (G...) address from an M-address.
 * @param  address   an account address (either M... or G...)
 * @return a Stellar public key address (G...)
 */
export declare function extractBaseAddress(address: string): string;
