import map from 'lodash/map';
import each from 'lodash/each';
import isString from 'lodash/isString';
import xdr from './generated/stellar-xdr_generated';
import { hash } from './hashing';

import { StrKey } from './strkey';
import { Operation } from './operation';
import { Network } from './network';
import { Memo } from './memo';
import { Keypair } from './keypair';

/**
 * Use {@link TransactionBuilder} to build a transaction object, unless you have
 * an object or base64-encoded string of the transaction envelope XDR.
 * Once a Transaction has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link Transaction#sign}) to a Transaction object before
 * submitting to the network or forwarding on to additional signers.
 * @constructor
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 * @param {string} [networkPassphrase] passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
 */
export class Transaction {
  constructor(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      const buffer = Buffer.from(envelope, 'base64');
      envelope = xdr.TransactionEnvelope.fromXDR(buffer);
    }

    // Deprecation warning. TODO: remove optionality with next major release.
    if (networkPassphrase === null || networkPassphrase === undefined) {
      console.warn(
        'Global `Network.current()` is deprecated. Please pass explicit argument instead, e.g. `new Transaction(envelope, Networks.PUBLIC)` (see https://git.io/fj9fG for more info).'
      );
    } else if (typeof networkPassphrase !== 'string') {
      throw new Error(
        `Invalid passphrase provided to Transaction: expected a string but got a ${typeof networkPassphrase}`
      );
    }
    this._networkPassphrase = networkPassphrase;

    // since this transaction is immutable, save the tx
    this.tx = envelope.tx();
    this.source = StrKey.encodeEd25519PublicKey(
      envelope
        .tx()
        .sourceAccount()
        .ed25519()
    );
    this.fee = this.tx.fee();
    this._memo = this.tx.memo();
    this.sequence = this.tx.seqNum().toString();

    const timeBounds = this.tx.timeBounds();
    if (timeBounds) {
      this.timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }

    const operations = this.tx.operations() || [];
    this.operations = map(operations, (op) => Operation.fromXDRObject(op));

    const signatures = envelope.signatures() || [];
    this.signatures = map(signatures, (s) => s);
  }

  get networkPassphrase() {
    if (this._networkPassphrase) {
      return this._networkPassphrase;
    }

    console.warn(
      'Global `Network.current()` is deprecated. Please pass explicit argument instead, e.g. `new Transaction(envelope, Networks.PUBLIC)` (see https://git.io/fj9fG for more info).'
    );

    if (Network.current() === null) {
      throw new Error(
        'No network selected. Please pass a network argument, e.g. `new Transaction(envelope, Networks.PUBLIC)`.'
      );
    }

    return Network.current().networkPassphrase();
  }

  set networkPassphrase(networkPassphrase) {
    this._networkPassphrase = networkPassphrase;
  }

  get memo() {
    return Memo.fromXDRObject(this._memo);
  }

  set memo(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * Signs the transaction with the given {@link Keypair}.
   * @param {...Keypair} keypairs Keypairs of signers
   * @returns {void}
   */
  sign(...keypairs) {
    const txHash = this.hash();
    each(keypairs, (kp) => {
      const sig = kp.signDecorated(txHash);
      this.signatures.push(sig);
    });
  }

  /**
   * Signs a transaction with the given {@link Keypair}. Useful if someone sends
   * you a transaction XDR for you to sign and return (see
   * {@link Transaction#addSignature} for how that works).
   *
   * When you get a transaction XDR to sign....
   * - Instantiate a `Transaction` object with the XDR
   * - Use {@link Keypair} to generate a keypair object for your Stellar seed.
   * - Run `getKeypairSignature` with that keypair
   * - Send back the signature along with your publicKey (not your secret seed!)
   *
   * Example:
   * ```javascript
   * // `transactionXDR` is a string from the person generating the transaction
   * const transaction = new Transaction(transactionXDR, networkPassphrase);
   * const keypair = Keypair.fromSecret(myStellarSeed);
   * return transaction.getKeypairSignature(keypair);
   * ```
   *
   * @param {Keypair} keypair Keypair of signer
   * @returns {string} Signature string
   */
  getKeypairSignature(keypair) {
    return keypair.sign(this.hash()).toString('base64');
  }

  /**
   * Add a signature to the transaction. Useful when a party wants to pre-sign
   * a transaction but doesn't want to give access to their secret keys.
   * This will also verify whether the signature is valid.
   *
   * Here's how you would use this feature to solicit multiple signatures.
   * - Use `TransactionBuilder` to build a new transaction.
   * - Make sure to set a long enough timeout on that transaction to give your
   * signers enough time to sign!
   * - Once you build the transaction, use `transaction.toXDR()` to get the
   * base64-encoded XDR string.
   * - _Warning!_ Once you've built this transaction, don't submit any other
   * transactions onto your account! Doing so will invalidate this pre-compiled
   * transaction!
   * - Send this XDR string to your other parties. They can use the instructions
   * for {@link Transaction#getKeypairSignature} to sign the transaction.
   * - They should send you back their `publicKey` and the `signature` string
   * from {@link Transaction#getKeypairSignature}, both of which you pass to
   * this function.
   *
   * @param {string} publicKey The public key of the signer
   * @param {string} signature The base64 value of the signature XDR
   * @returns {TransactionBuilder}
   */
  addSignature(publicKey = '', signature = '') {
    if (!signature || typeof signature !== 'string') {
      throw new Error('Invalid signature');
    }

    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('Invalid publicKey');
    }

    let keypair;
    let hint;
    const signatureBuffer = Buffer.from(signature, 'base64');

    try {
      keypair = Keypair.fromPublicKey(publicKey);
      hint = keypair.signatureHint();
    } catch (e) {
      throw new Error('Invalid publicKey');
    }

    if (!keypair.verify(this.hash(), signatureBuffer)) {
      throw new Error('Invalid signature');
    }

    this.signatures.push(
      new xdr.DecoratedSignature({
        hint,
        signature: signatureBuffer
      })
    );
  }

  /**
   * Add `hashX` signer preimage as signature.
   * @param {Buffer|String} preimage Preimage of hash used as signer
   * @returns {void}
   */
  signHashX(preimage) {
    if (isString(preimage)) {
      preimage = Buffer.from(preimage, 'hex');
    }

    if (preimage.length > 64) {
      throw new Error('preimage cannnot be longer than 64 bytes');
    }

    const signature = preimage;
    const hashX = hash(preimage);
    const hint = hashX.slice(hashX.length - 4);
    this.signatures.push(new xdr.DecoratedSignature({ hint, signature }));
  }

  /**
   * Returns a hash for this transaction, suitable for signing.
   * @returns {Buffer}
   */
  hash() {
    return hash(this.signatureBase());
  }

  /**
   * Returns the "signature base" of this transaction, which is the value
   * that, when hashed, should be signed to create a signature that
   * validators on the Stellar Network will accept.
   *
   * It is composed of a 4 prefix bytes followed by the xdr-encoded form
   * of this transaction.
   * @returns {Buffer}
   */
  signatureBase() {
    return Buffer.concat([
      hash(this.networkPassphrase),
      xdr.EnvelopeType.envelopeTypeTx().toXDR(),
      this.tx.toXDR()
    ]);
  }

  /**
   * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
   * @returns {xdr.TransactionEnvelope}
   */
  toEnvelope() {
    const tx = this.tx;
    const signatures = this.signatures;
    const envelope = new xdr.TransactionEnvelope({ tx, signatures });

    return envelope;
  }

  /**
   * Get the transaction envelope as a base64-encoded string
   * @returns {string} XDR string
   */
  toXDR() {
    return this.toEnvelope()
      .toXDR()
      .toString('base64');
  }
}
