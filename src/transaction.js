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

    const txEnvelope = envelope.value();
    let sourceAccount;
    this._envelopeType = envelope.switch();
    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        sourceAccount = txEnvelope.tx().sourceAccountEd25519();
        break;
      case xdr.EnvelopeType.envelopeTypeTx():
        sourceAccount = txEnvelope
          .tx()
          .sourceAccount()
          .ed25519();
        break;
      case xdr.EnvelopeType.envelopeTypeTxFeeBump():
        sourceAccount = txEnvelope
          .tx()
          .feeSource()
          .ed25519();
        break;
      default:
        throw new Error(`Invalid EnvelopeType: ${this._envelopeType}.`);
    }

    // since this transaction is immutable, save the tx
    this.tx = txEnvelope.tx();
    let tx = this.tx;

    this.source = StrKey.encodeEd25519PublicKey(sourceAccount);
    this.fee = tx.fee().toString();

    // if tx is FeeBump, override tx with innerTx, which we use to expose data
    // about the innerTx like operations and memo.
    if (this.isFeeBump()) {
      const innerTxEnvelope = tx.innerTx().value();
      tx = innerTxEnvelope.tx();

      // make inner transaction the source account and add field feeSource
      this.feeSource = StrKey.encodeEd25519PublicKey(sourceAccount);

      this.source = StrKey.encodeEd25519PublicKey(tx.sourceAccount().ed25519());
      this.innerSignatures = map(innerTxEnvelope.signatures() || [], (s) => s);
      this.innerFee = tx.fee().toString();
    }

    this._memo = tx.memo();
    this.sequence = tx.seqNum().toString();

    const timeBounds = tx.timeBounds();
    if (timeBounds) {
      this.timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }
    const operations = tx.operations() || [];
    this.operations = map(operations, (op) => Operation.fromXDRObject(op));

    const signatures = txEnvelope.signatures() || [];
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
    let tx = this.tx;

    // Backwards Compatibility: Use ENVELOPE_TYPE_TX to sign ENVELOPE_TYPE_TX_V0
    // we need a Transaction to generate the signature base
    if (this._envelopeType === xdr.EnvelopeType.envelopeTypeTxV0()) {
      tx = xdr.Transaction.fromXDR(
        Buffer.concat([
          // TransactionV0 is a transaction with the AccountID discriminant
          // stripped off, we need to put it back to build a valid transaction
          // which we can use to build a TransactionSignaturePayloadTaggedTransaction
          xdr.PublicKeyType.publicKeyTypeEd25519().toXDR(),
          tx.toXDR()
        ])
      );
    }

    let taggedTransaction;

    if (this.isFeeBump()) {
      taggedTransaction = new xdr.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTxFeeBump(
        tx
      );
    } else {
      taggedTransaction = new xdr.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTx(
        tx
      );
    }

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
    const tx = this.tx;
    const signatures = this.signatures;

    let envelope;
    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTxV0(
          new xdr.TransactionV0Envelope({ tx, signatures })
        );
        break;
      case xdr.EnvelopeType.envelopeTypeTx():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTx(
          new xdr.TransactionV1Envelope({ tx, signatures })
        );
        break;
      case xdr.EnvelopeType.envelopeTypeTxFeeBump():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTxFeeBump(
          new xdr.FeeBumpTransactionEnvelope({ tx, signatures })
        );
        break;
      default:
        throw new Error(`Invalid EnvelopeType: ${this._envelopeType}.`);
    }

    return envelope;
  }

  /**
   * isFeeBump returns true if the transaction represents a FeeBumpTransaction
   * @returns {boolean}
   * @ignore tell jsdoc to not show this method for now
   */
  isFeeBump() {
    return this._envelopeType === xdr.EnvelopeType.envelopeTypeTxFeeBump();
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
