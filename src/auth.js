import xdr from './xdr';

import { Keypair } from './keypair';
import { StrKey } from './strkey';
import { Networks } from './network';
import { hash } from './hashing';

import { Address } from './address';
import { nativeToScVal } from './scval';

/**
 * @async
 * @callback SigningCallback
 * A callback for signing an XDR structure representing all of the details
 * necessary to authorize an invocation tree.
 *
 * @param {xdr.HashIdPreimageSorobanAuthorization} preimage   the entire
 *    authorization envelope whose hash you should sign, so that you can inspect
 *    the entire structure if necessary (rather than blindly signing a hash)
 *
 * @returns {Promise<[Uint8Array, string]>}   a two-element array where the
 *    first element is the signature of the raw payload (which is the sha256
 *    hash of the preimage bytes, so `hash(preimage.toXDR())`) and the second
 *    element is the strkey-encoded public key (G...) that signed the payload
 */

/**
 * Actually authorizes an existing authorization entry (in place!) using the
 * given the credentials and expiration details.
 *
 * This "fills out" the authorization entry, indicating to that the
 * {@link Operation.invokeHostFunction} its attached to that a particular
 * identity (i.e. signing {@link Keypair} or other signing method) approves the
 * execution of an particular invocation tree (i.e. a simulation-acquired
 * {@link xdr.SorobanAuthorizedInvocation}) on a particular network (uniquely
 * identified by its passphrase, see {@link Networks}) until a particular ledger
 * sequence (i.e. `validUntil`) is reached.
 *
 * This one lets you pass a either a {@link Keypair} or a callback function (see
 * {@link SigningCallback}) to handle signing the envelope hash.
 *
 * @param {xdr.SorobanAuthorizationEntry} entry  an unsigned authorization entr
 * @param {Keypair | SigningCallback} signingMethod  either a keypair instance
 *    or a function which takes an input bytearray and returns its signature as
 *    signed by the private key corresponding to the `publicKey` parameter
 * @param {number} validUntil   the (exclusive) future ledger sequence number
 *    until which this authorization entry should be valid (if
 *    `currentLedgerSeq==validUntil`, this is expired))
 * @param {string} [networkPassphrase]  the network passphrase is incorprated
 *    into the signature (see {@link Networks} for options)
 *
 * @returns {Promise<xdr.SorobanAuthorizationEntry>} a promise for an
 *    authorization entry that you can pass along to
 *    {@link Operation.invokeHostFunction}
 *
 * @example
 * import { Server, Transaction, Networks, authorizeEntry } from 'soroban-client';
 *
 * // Assume signPayloadCallback is a well-formed signing callback.
 * //
 * // It might, for example, pop up a modal from a browser extension, send the
 * // transaction to a third-party service for signing, or just do simple
 * // signing via Keypair like it does here:
 * function signPayloadCallback(payload) {
 *    const signature = signer.sign(hash(payload.toXDR());
 *    return [ signature, signer.publicKey() ];
 * }
 *
 * function multiPartyAuth(
 *    server: Server,
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
 *              Networks.FUTURENET);
 *          ));
 *
 *          return server.prepareTransaction(tx, Networks.FUTURENET, simResult);
 *      })
 *      .then((preppedTx) => {
 *        preppedTx.sign(source);
 *        return server.sendTransaction(preppedTx);
 *      });
 * }
 */
export async function authorizeEntry(
  entry,
  signingMethod,
  validUntil,
  networkPassphrase = Networks.FUTURENET
) {
  // no-op
  if (
    entry.credentials().switch() !==
    xdr.SorobanCredentialsType.sorobanCredentialsAddress()
  ) {
    return entry;
  }

  /** @type {xdr.SorobanAddressCredentials} */
  const addrAuth = entry.credentials().address();
  addrAuth.signatureExpirationLedger(validUntil);

  const networkId = hash(Buffer.from(networkPassphrase));
  const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
    new xdr.HashIdPreimageSorobanAuthorization({
      networkId,
      nonce: addrAuth.nonce(),
      invocation: entry.rootInvocation(),
      signatureExpirationLedger: addrAuth.signatureExpirationLedger()
    })
  );
  const payload = hash(preimage.toXDR());

  let signature;
  let publicKey;
  if (signingMethod instanceof Keypair) {
    signature = signingMethod.sign(payload);
    publicKey = signingMethod.publicKey();
  } else {
    const [sig, pk] = await signingMethod(preimage);
    signature = Buffer.from(sig);
    publicKey = pk;
  }

  const expectedPubkey = Address.fromScAddress(addrAuth.address()).toString();
  if (expectedPubkey !== publicKey) {
    throw new Error(
      `signing identity doesn't match entry: expected ${expectedPubkey}, got ${publicKey}`
    );
  }

  if (!Keypair.fromPublicKey(publicKey).verify(payload, signature)) {
    throw new Error(`signature doesn't match payload`);
  }

  const sigScVal = nativeToScVal(
    {
      public_key: StrKey.decodeEd25519PublicKey(publicKey),
      signature
    },
    {
      // force the keys to be interpreted as symbols (expected for
      // Soroban [contracttype]s)
      type: {
        public_key: ['symbol', null],
        signature: ['symbol', null]
      }
    }
  );

  addrAuth.signatureArgs([sigScVal]);
  return entry;
}
