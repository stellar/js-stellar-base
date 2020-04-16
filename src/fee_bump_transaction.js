import xdr from './generated/stellar-xdr_generated';
import { hash } from './hashing';

import { StrKey } from './strkey';
import { Transaction } from './transaction';
import { TransactionBase } from './transaction_base';

/**
 * Use {@link TransactionBuilder.buildFeeBumpTransaction} to build a FeeBumpTransaction object, unless you have
 * an object or base64-encoded string of the transaction envelope XDR.
 * Once a {@link FeeBumpTransaction} has been created, its attributes and operations
 * should not be changed. You should only add signatures (using {@link FeeBumpTransaction#sign}) before
 * submitting to the network or forwarding on to additional signers.
 * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
 * @param {string} networkPassphrase passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
 * @extends TransactionBase
 */
export class FeeBumpTransaction extends TransactionBase {
  constructor(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      const buffer = Buffer.from(envelope, 'base64');
      envelope = xdr.TransactionEnvelope.fromXDR(buffer);
    }

    const envelopeType = envelope.switch();
    if (envelopeType !== xdr.EnvelopeType.envelopeTypeTxFeeBump()) {
      throw new Error(
        `Invalid TransactionEnvelope: expected an envelopeTypeTxFeeBump but received an ${envelopeType.name}.`
      );
    }

    const txEnvelope = envelope.value();
    const tx = txEnvelope.tx();
    const fee = tx.fee().toString();
    // clone signatures
    const signatures = (txEnvelope.signatures() || []).slice();

    super(tx, signatures, fee, networkPassphrase);

    const innerTxEnvelope = xdr.TransactionEnvelope.envelopeTypeTx(
      tx.innerTx().v1()
    );

    this._innerTransaction = new Transaction(
      innerTxEnvelope,
      networkPassphrase
    );
  }

  /**
   * @type {Transaction}
   * @readonly
   */
  get innerTransaction() {
    return this._innerTransaction;
  }

  /**
   * @type {string}
   * @readonly
   */
  get feeSource() {
    return this._muxedToString(this.tx.feeSource());
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
      tx: xdr.FeeBumpTransaction.fromXDR(this.tx.toXDR()), // make a copy of the tx
      signatures: this.signatures.slice() // make a copy of the signatures
    });

    return new xdr.TransactionEnvelope.envelopeTypeTxFeeBump(envelope);
  }
}
