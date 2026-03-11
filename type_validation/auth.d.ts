import xdr from "./xdr.js";
import { Keypair } from "./keypair.js";
/**
 * A callback for signing an XDR structure representing all of the details
 * necessary to authorize an invocation tree.
 *
 * @param preimage - the entire authorization envelope whose hash you should
 *    sign, so that you can inspect the entire structure if necessary (rather
 *    than blindly signing a hash)
 *
 * @returns the signature of the raw payload (which is the sha256 hash of the
 *    preimage bytes, so `hash(preimage.toXDR())`) either naked, implying it is
 *    signed by the key corresponding to the public key in the entry you pass to
 *    {@link authorizeEntry} (decipherable from its
 *    `credentials().address().address()`), or alongside an explicit `publicKey`.
 */
type BufferLike = ArrayBuffer | Buffer | Uint8Array;
export type SigningCallback = (preimage: xdr.HashIdPreimage) => Promise<BufferLike | {
    signature: BufferLike;
    publicKey: string;
}>;
/**
 * Actually authorizes an existing authorization entry using the given the
 * credentials and expiration details, returning a signed copy.
 *
 * This "fills out" the authorization entry with a signature, indicating to the
 * {@link Operation.invokeHostFunction} its attached to that:
 *   - a particular identity (i.e. signing {@link Keypair} or other signer)
 *   - approving the execution of an invocation tree (i.e. a simulation-acquired
 *     {@link xdr.SorobanAuthorizedInvocation} or otherwise built)
 *   - on a particular network (uniquely identified by its passphrase, see
 *     {@link Networks})
 *   - until a particular ledger sequence is reached.
 *
 * This one lets you pass a either a {@link Keypair} (or, more accurately,
 * anything with a `sign(Buffer): Buffer` method) or a callback function (see
 * {@link SigningCallback}) to handle signing the envelope hash.
 *
 * @param entry - an unsigned authorization entry
 * @param signer - either a {@link Keypair} instance or a function which takes a
 *    {@link xdr.HashIdPreimageSorobanAuthorization} input payload and returns
 *    EITHER
 *
 *      (a) an object containing a `signature` of the hash of the raw payload
 *          bytes as a Buffer-like and a `publicKey` string representing who just
 *          created this signature, or
 *      (b) just the naked signature of the hash of the raw payload bytes (where
 *          the signing key is implied to be the address in the `entry`).
 *
 *    The latter option (b) is JUST for backwards compatibility and will be
 *    removed in the future.
 * @param validUntilLedgerSeq - the (exclusive) future ledger sequence number
 *    until which this authorization entry should be valid (if
 *    `currentLedgerSeq==validUntil`, this is expired)
 * @param networkPassphrase - the network passphrase is incorporated into the
 *    signature (see {@link Networks} for options)
 *
 * @returns a promise for an authorization entry that you can pass along to
 *    {@link Operation.invokeHostFunction}
 *
 * @note If using the `SigningCallback` variation, the signer is assumed to be
 *    the entry's credential address unless you use the variant that returns
 *    the object.
 *
 * @see authorizeInvocation
 * @example
 * ```ts
 * import {
 *   SorobanRpc,
 *   Transaction,
 *   Networks,
 *   authorizeEntry
 * } from '@stellar/stellar-sdk';
 *
 * // Assume signPayloadCallback is a well-formed signing callback.
 * //
 * // It might, for example, pop up a modal from a browser extension, send the
 * // transaction to a third-party service for signing, or just do simple
 * // signing via Keypair like it does here:
 * function signPayloadCallback(payload) {
 *    return signer.sign(hash(payload.toXDR()));
 * }
 *
 * function multiPartyAuth(
 *    server: SorobanRpc.Server,
 *    // assume this involves multi-party auth
 *    tx: Transaction,
 * ) {
 *    return server
 *      .simulateTransaction(tx)
 *      .then((simResult) => {
 *          tx.operations[0].auth.map(entry =>
 *            authorizeEntry(
 *              entry,
 *              signPayloadCallback,
 *              currentLedger + 1000,
 *              Networks.TESTNET)
 *          );
 *
 *          return server.prepareTransaction(tx, simResult);
 *      })
 *      .then((preppedTx) => {
 *        preppedTx.sign(source);
 *        return server.sendTransaction(preppedTx);
 *      });
 * }
 * ```
 */
export declare function authorizeEntry(entry: xdr.SorobanAuthorizationEntry, signer: Keypair | SigningCallback, validUntilLedgerSeq: number, networkPassphrase?: string): Promise<xdr.SorobanAuthorizationEntry>;
/**
 * This builds an entry from scratch, allowing you to express authorization as a
 * function of:
 *   - a particular identity (i.e. signing {@link Keypair} or other signer)
 *   - approving the execution of an invocation tree (i.e. a simulation-acquired
 *     {@link xdr.SorobanAuthorizedInvocation} or otherwise built)
 *   - on a particular network (uniquely identified by its passphrase, see
 *     {@link Networks})
 *   - until a particular ledger sequence is reached.
 *
 * This is in contrast to {@link authorizeEntry}, which signs an existing entry.
 *
 * @param signer - either a {@link Keypair} instance (or anything with a
 *    `.sign(buf): Buffer-like` method) or a function which takes a payload (a
 *    {@link xdr.HashIdPreimageSorobanAuthorization} instance) input and returns
 *    the signature of the hash of the raw payload bytes (where the signing key
 *    should correspond to the address in the `entry`)
 * @param validUntilLedgerSeq - the (exclusive) future ledger sequence number
 *    until which this authorization entry should be valid (if
 *    `currentLedgerSeq==validUntilLedgerSeq`, this is expired)
 * @param invocation - the invocation tree that we're authorizing (likely, this
 *    comes from transaction simulation)
 * @param publicKey - the public identity of the signer (when providing a
 *    {@link Keypair} to `signer`, this can be omitted, as it just uses
 *    {@link Keypair.publicKey})
 * @param networkPassphrase - the network passphrase is incorporated into the
 *    signature (see {@link Networks} for options, default:
 *    {@link Networks.FUTURENET})
 *
 * @returns a promise for an authorization entry that you can pass along to
 *    {@link Operation.invokeHostFunction}
 *
 * @see authorizeEntry
 */
export declare function authorizeInvocation(signer: Keypair | SigningCallback, validUntilLedgerSeq: number, invocation: xdr.SorobanAuthorizedInvocation, publicKey?: string, networkPassphrase?: string): Promise<xdr.SorobanAuthorizationEntry>;
export {};
