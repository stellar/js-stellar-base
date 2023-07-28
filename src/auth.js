import { Address } from './address';
import { Keypair } from './keypair';
import { hash } from './signing';

import { nativeToScVal } from './scval';
import xdr from './xdr';

/**
 * Builds an {@link xdr.SorobanAuthorizationEntry} that indicates to
 * {@link Operation.invokeHostFunction} that a particular identity (i.e. signing
 * {@link Keypair}) approves the execution of an invocation tree (i.e. a
 * simulation-acquired {@link xdr.SorobanAuthorizedInvocation}) on a particular
 * network (uniquely identified by its passphrase, see {@link Networks}) until a
 * particular ledger sequence is reached.
 *
 * @param {Keypair} signer  the identity authorizing this invocation tree
 * @param {string}  networkPassphrase   the network passphrase is incorprated
 *    into the signature (see {@link Networks} for options)
 * @param {number}  validUntil the (exclusive) future ledger sequence number
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
  const preimage = hash(
    xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(envelope).toXDR()
  );

  return new xdr.SorobanAuthorizationEntry({
    credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
      new xdr.SorobanAddressCredentials({
        address: new Address(signer.publicKey()).toScAddress(),
        nonce: envelope.nonce(),
        signatureExpirationLedger: envelope.signatureExpirationLedger(),
        signatureArgs: [
          nativeToScVal(
            {
              public_key: signer.rawPublicKey(),
              signature: signer.sign(preimage)
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
    ),
    rootInvocation: invocation
  });
}
