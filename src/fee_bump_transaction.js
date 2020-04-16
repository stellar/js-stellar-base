import map from 'lodash/map';
import each from 'lodash/each';
import isString from 'lodash/isString';
import xdr from './generated/stellar-xdr_generated';
import { hash } from './hashing';

import { StrKey } from './strkey';
import { Keypair } from './keypair';
import { Transaction } from './transaction';

/**
 * Use {@link TransactionBuilder.buildFeeBumpTransaction} to build a FeeBumpTransaction object, unless you have
 * an object or base64-encoded string of the transaction envelope XDR.
 * Once a {@link FeeBumpTransaction} has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link FeeBumpTransaction#sign}) before
 * submitting to the network or forwarding on to additional signers.
 * @constructor
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 * @param {string} networkPassphrase passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
 * @ignore tell jsdoc to now show this class
 */
export class FeeBumpTransaction {
  constructor(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      const buffer = Buffer.from(envelope, 'base64');
      envelope = xdr.TransactionEnvelope.fromXDR(buffer);
    }

    if (typeof networkPassphrase !== 'string') {
      throw new Error(
        `Invalid passphrase provided to Transaction: expected a string but got a ${typeof networkPassphrase}`
      );
    }
    this._networkPassphrase = networkPassphrase;

    const envelopeType = envelope.switch();
    if (envelopeType !== xdr.EnvelopeType.envelopeTypeTxFeeBump()) {
      throw new Error(
        `Invalid TransactionEnvelope: expected an envelopeTypeTxFeeBump but received an ${envelopeType.name}.`
      );
    }

    const txEnvelope = envelope.value();
    const sourceAccount = txEnvelope
      .tx()
      .feeSource()
      .ed25519();

    // since this transaction is immutable, save the tx
    this._tx = txEnvelope.tx();
    this._feeSource = StrKey.encodeEd25519PublicKey(sourceAccount);
    this._fee = this._tx.fee().toString();

    const innerTxEnvelope = xdr.TransactionEnvelope.envelopeTypeTx(
      this.tx.innerTx().v1()
    );
    this._innerTransaction = new Transaction(
      innerTxEnvelope,
      networkPassphrase
    );
    this.signatures = map(txEnvelope.signatures() || [], (s) => s);
  }

  get tx() {
    return this._tx;
  }

  get innerTransaction() {
    return this._innerTransaction;
  }

  get feeSource() {
    return this._feeSource;
  }

  get fee() {
    return this._fee;
  }

  get networkPassphrase() {
    return this._networkPassphrase;
  }

  set networkPassphrase(networkPassphrase) {
    this.innerTransaction.networkPassphrase = networkPassphrase;
    this._networkPassphrase = networkPassphrase;
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
   * {@link FeeBumpTransaction#addSignature} for how that works).
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
   * const transaction = new FeeBumpTransaction(transactionXDR, networkPassphrase);
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
   * for {@link FeeBumpTransaction#getKeypairSignature} to sign the transaction.
   * - They should send you back their `publicKey` and the `signature` string
   * from {@link FeeBumpTransaction#getKeypairSignature}, both of which you pass to
   * this function.
   *
   * @param {string} publicKey The public key of the signer
   * @param {string} signature The base64 value of the signature XDR
   * @returns {void}
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
    const taggedTransaction = new xdr.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTxFeeBump(
      this.tx
    );

    const txSignature = new xdr.TransactionSignaturePayload({
      networkId: xdr.Hash.fromXDR(hash(this.networkPassphrase)),
      taggedTransaction
    });

    return txSignature.toXDR();
  }

  /**
   * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
   * @returns {xdr.TransactionEnvelope}
   */
  toEnvelope() {
    const envelope = new xdr.FeeBumpTransactionEnvelope({
      tx: this.tx,
      signatures: this.signatures
    });

    return new xdr.TransactionEnvelope.envelopeTypeTxFeeBump(envelope);
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
