import xdr from "../xdr.js";
import { OperationClass, SetOptionsOpts } from "./types.js";
/**
 * Returns an XDR SetOptionsOp. A "set options" operations set or clear account flags,
 * set the account's inflation destination, and/or add new signers to the account.
 * The flags used in `opts.clearFlags` and `opts.setFlags` can be the following:
 *   - `{@link AuthRequiredFlag}`
 *   - `{@link AuthRevocableFlag}`
 *   - `{@link AuthImmutableFlag}`
 *   - `{@link AuthClawbackEnabledFlag}`
 *
 * It's possible to set/clear multiple flags at once using logical or.
 *
 * @alias Operation.setOptions
 *
 * @param opts - Options object
 * @param opts.inflationDest - Set this account ID as the account's inflation destination.
 * @param opts.clearFlags - Bitmap integer for which account flags to clear.
 * @param opts.setFlags - Bitmap integer for which account flags to set.
 * @param opts.masterWeight - The master key weight.
 * @param opts.lowThreshold - The sum weight for the low threshold.
 * @param opts.medThreshold - The sum weight for the medium threshold.
 * @param opts.highThreshold - The sum weight for the high threshold.
 * @param opts.signer - Add or remove a signer from the account. The signer is
 *                                 deleted if the weight is 0. Only one of `ed25519PublicKey`, `sha256Hash`, `preAuthTx` should be defined.
 * @param opts.signer.ed25519PublicKey - The ed25519 public key of the signer.
 * @param opts.signer.sha256Hash - sha256 hash (Buffer or hex string) of preimage that will unlock funds. Preimage should be used as signature of future transaction.
 * @param opts.signer.preAuthTx - Hash (Buffer or hex string) of transaction that will unlock funds.
 * @param opts.signer.ed25519SignedPayload - Signed payload signer (ed25519 public key + raw payload) for atomic transaction signature disclosure.
 * @param opts.signer.weight - The weight of the new signer (0 to delete or 1-255)
 * @param opts.homeDomain - sets the home domain used for reverse federation lookup.
 * @param opts.source - The source account (defaults to transaction source).
 * @returns XDR operation
 * @see [Account flags](https://developers.stellar.org/docs/glossary/accounts/#flags)
 */
export declare function setOptions(this: OperationClass, opts: SetOptionsOpts): xdr.Operation;
