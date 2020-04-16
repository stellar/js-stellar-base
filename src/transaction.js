import map from 'lodash/map';
import xdr from './generated/stellar-xdr_generated';
import { hash } from './hashing';

import { StrKey } from './strkey';
import { Operation } from './operation';
import { Memo } from './memo';
import { TransactionBase } from './transaction_base';

/**
 * Use {@link TransactionBuilder} to build a transaction object, unless you have
 * an object or base64-encoded string of the transaction envelope XDR.
 * Once a Transaction has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link Transaction#sign}) to a Transaction object before
 * submitting to the network or forwarding on to additional signers.
 * @constructor
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 * @param {string} [networkPassphrase] passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
 * @extends TransactionBase
 */
export class Transaction extends TransactionBase {
  constructor(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      const buffer = Buffer.from(envelope, 'base64');
      envelope = xdr.TransactionEnvelope.fromXDR(buffer);
    }

    const envelopeType = envelope.switch();
    if (
      !(
        envelopeType === xdr.EnvelopeType.envelopeTypeTxV0() ||
        envelopeType === xdr.EnvelopeType.envelopeTypeTx()
      )
    ) {
      throw new Error(
        `Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ${envelopeType.name}.`
      );
    }

    const txEnvelope = envelope.value();
    const tx = txEnvelope.tx();
    const fee = tx.fee().toString();
    const signatures = (txEnvelope.signatures() || []).slice();

    super(tx, signatures, fee, networkPassphrase);

    this._envelopeType = envelopeType;
    this._memo = tx.memo();
    this._sequence = tx.seqNum().toString();

    const timeBounds = tx.timeBounds();
    if (timeBounds) {
      this._timeBounds = {
        minTime: timeBounds.minTime().toString(),
        maxTime: timeBounds.maxTime().toString()
      };
    }
    const operations = tx.operations() || [];
    this._operations = map(operations, (op) => Operation.fromXDRObject(op));
  }

  /**
   * @type {object}
   * @property {string} 64 bit unix timestamp
   * @property {string} 64 bit unix timestamp
   * @readonly
   */
  get timeBounds() {
    return this._timeBounds;
  }

  set timeBounds(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get sequence() {
    return this._sequence;
  }

  set sequence(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get source() {
    const envelopeType = this._envelopeType;
    let source;

    switch (envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        source = StrKey.encodeEd25519PublicKey(this.tx.sourceAccountEd25519());
        break;
      default:
        if (
          this.tx.sourceAccount().switch() ===
          xdr.CryptoKeyType.keyTypeEd25519()
        ) {
          source = StrKey.encodeEd25519PublicKey(
            this.tx.sourceAccount().ed25519()
          );
        } else {
          source = StrKey.encodeMuxedAccount(
            this.tx
              .sourceAccount()
              .med25519()
              .toXDR()
          );
        }
        break;
    }

    return source;
  }

  set source(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {Array.<xdr.Operation>}
   * @readonly
   */
  get operations() {
    return this._operations;
  }

  set operations(value) {
    throw new Error('Transaction is immutable');
  }

  /**
   * @type {string}
   * @readonly
   */
  get memo() {
    return Memo.fromXDRObject(this._memo);
  }

  set memo(value) {
    throw new Error('Transaction is immutable');
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

    const taggedTransaction = new xdr.TransactionSignaturePayloadTaggedTransaction.envelopeTypeTx(
      tx
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
    const rawTx = Buffer.concat([this.tx.toXDR()]);
    const signatures = this.signatures.slice(); // make a copy of signatures

    let envelope;
    switch (this._envelopeType) {
      case xdr.EnvelopeType.envelopeTypeTxV0():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTxV0(
          new xdr.TransactionV0Envelope({
            tx: xdr.TransactionV0.fromXDR(rawTx), // make a copy of tx
            signatures
          })
        );
        break;
      case xdr.EnvelopeType.envelopeTypeTx():
        envelope = new xdr.TransactionEnvelope.envelopeTypeTx(
          new xdr.TransactionV1Envelope({
            tx: xdr.Transaction.fromXDR(rawTx), // make a copy of tx
            signatures
          })
        );
        break;
      default:
        throw new Error(
          `Invalid TransactionEnvelope: expected an envelopeTypeTxV0 or envelopeTypeTx but received an ${this._envelopeType.name}.`
        );
    }

    return envelope;
  }
}
