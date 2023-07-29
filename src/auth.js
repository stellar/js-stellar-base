import xdr from './xdr';

import { StrKey } from './strkey';
import { Keypair } from './keypair';
import { hash } from './hashing';

import { Address } from './address';
import { nativeToScVal } from './scval';

/**
 * This builds an authorization entry that indicates to
 * {@link Operation.invokeHostFunction} that a particular identity (i.e. signing
 * {@link Keypair}) approves the execution of an invocation tree (i.e. a
 * simulation-acquired {@link xdr.SorobanAuthorizedInvocation}) on a particular
 * network (uniquely identified by its passphrase, see {@link Networks}) until a
 * particular ledger sequence is reached.
 *
 * This enables building an {@link xdr.SorobanAuthorizationEntry} without
 * worrying about how to combine {@link buildAuthEnvelope} and
 * {@link buildAuthEntry}, while those allow advanced, asynchronous, two-step
 * building+signing of the authorization entries.
 *
 * This one lets you pass a either a {@link Keypair} or a callback function to
 * handle signing the envelope hash.
 *
 * @param {Keypair} signer   the identity keypair authorizing this invocation
 * @param {string}  networkPassphrase   the network passphrase is incorprated
 *    into the signature (see {@link Networks} for options)
 * @param {number}  validUntil  the (exclusive) future ledger sequence number
 *    until which this authorization entry should be valid (if
 *    `currentLedgerSeq==validUntil`, this is expired))
 * @param {xdr.SorobanAuthorizedInvocation} invocation the invocation tree that
 *    we're authorizing (likely, this comes from transaction simulation)
 *
 * @returns {xdr.SorobanAuthorizationEntry}  an authorization entry that you can
 *    pass along to {@link Operation.invokeHostFunction}
 */
export function authorizeInvocation(
  signer,
  networkPassphrase,
  validUntil,
  invocation
) {
  const preimage = buildAuthEnvelope(networkPassphrase, validUntil, invocation);
  const input = hash(preimage.toXDR());
  const signature = signer.sign(input);
  return buildAuthEntry(preimage, signature, signer.publicKey());
}

/**
 * Builds an {@link xdr.HashIdPreimage} that, when hashed and signed, can be
 * used to build an {@link xdr.SorobanAuthorizationEntry} via
 * {@link buildAuthEnvelope} to approve {@link Operation.invokeHostFunction}
 * invocations.
 *
 * The envelope built here will approve the execution of an invocation tree
 * (i.e. a simulation-acquired {@link xdr.SorobanAuthorizedInvocation}) on a
 * particular network (uniquely identified by its passphrase, see
 * {@link Networks}) until a particular ledger sequence is reached (exclusive).
 *
 * @param {string}  networkPassphrase   the network passphrase is incorprated
 *    into the signature (see {@link Networks} for options)
 * @param {number}  validUntil the (exclusive) future ledger sequence number
 *    until which this authorization entry should be valid
 * @param {xdr.SorobanAuthorizedInvocation} invocation the invocation tree that
 *    we're authorizing (likely, this comes from transaction simulation)
 *
 * @returns {xdr.HashIdPreimage}  a preimage envelope that, when hashed and
 *    signed, represents the signature necessary to build a proper
 *    {@link xdr.SorobanAuthorizationEntry} via {@link buildAuthEntry}.
 */
export function buildAuthEnvelope(networkPassphrase, validUntil, invocation) {
  // We use keypairs as a source of randomness for the nonce to avoid mucking
  // with any crypto dependencies. Note that this just has to be random and
  // unique, not cryptographically secure, so it's fine.
  const kp = Keypair.random().rawPublicKey();
  const nonce = new xdr.Int64(...kp.buffer().subarray(0, 8));

  const networkId = hash(Buffer.from(networkPassphrase));
  const envelope = new xdr.HashIdPreimageSorobanAuthorization({
    networkId,
    invocation,
    nonce,
    signatureExpirationLedger: validUntil
  });

  return xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(envelope);
}

/**
 * Builds an auth entry with a signed invocation tree.
 *
 * You should first build the envelope using {@link buildAuthEnvelope}. If you
 * have a signing {@link Keypair}, you can use the more convenient
 * {@link authorizeInvocation} to do signing for you.
 *
 * @param {xdr.HashIdPreimage} envelope   an envelope to represent the call tree
 *    being signed, probably built by {@link buildAuthEnvelope}
 * @param {Buffer|Uint8Array} signature   a signature of the hash of the
 *    envelope by the private key corresponding to `publicKey` (in other words,
 *    `signature = sign(hash(envelope))`)
 * @param {string} publicKey  the public identity that signed this envelope
 *
 * @returns {xdr.SorobanAuthorizationEntry}
 *
 * @throws {Error} if `verify(hash(envelope), signature, publicKey)` does not
 *    pass, meaning one of the arguments was not passed or built correctly
 * @throws {TypeError} if the envelope does not hold an
 *    {@link xdr.HashIdPreimageSorobanAuthorization} instance
 */
export function buildAuthEntry(envelope, signature, publicKey) {
  // ensure this identity signed this envelope correctly
  if (!Keypair.fromPublicKey(publicKey).verify(hash(envelope), signature)) {
    throw new Error(`signature does not match envelope or identity`);
  }

  if (
    envelope.switch() !== xdr.EnvelopeType.envelopeTypeSorobanAuthorization()
  ) {
    throw new TypeError(
      `expected sorobanAuthorization envelope, got ${envelope.switch().name}`
    );
  }

  return new xdr.SorobanAuthorizationEntry({
    rootInvocation: envelope.sorobanAuthorization().invocation(),
    credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
      new xdr.SorobanAddressCredentials({
        address: new Address(publicKey).toScAddress(),
        nonce: envelope.sorobanAuthorization().nonce(),
        signatureExpirationLedger: envelope.signatureExpirationLedger(),
        signatureArgs: [
          nativeToScVal(
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
          )
        ]
      })
    )
  });
}
