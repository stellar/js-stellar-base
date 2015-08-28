import {xdr, hash} from "./index";

import {encodeCheck} from "./strkey";
import {Operation} from "./operation";
import {map, each} from "lodash";

let MAX_FEE      = 1000;
let MIN_LEDGER   = 0;
let MAX_LEDGER   = 0xFFFFFFFF; // max uint32

export class Transaction {

    /**
    * A new Transaction object is created from a transaction envelope (or via TransactionBuilder).
    * One a Transaction has been created from an envelope, its attributes and operations
    * should not be changed. You should only add signers to a Transaction object before
    * submitting to the network or forwarding on to additional signers.
    * @constructor
    * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or
    *                                                    base64 encoded string.
    */
    constructor(envelope) {
        if (typeof envelope === "string") {
            let buffer = new Buffer(envelope, "base64");
            envelope = xdr.TransactionEnvelope.fromXDR(buffer);
        }
        // since this transaction is immutable, save the tx
        this.tx       = envelope.tx();
        this.source   = encodeCheck("accountId", envelope.tx().sourceAccount().ed25519());
        this.fee      = this.tx.fee();
        this.sequence = this.tx.seqNum().toString();

        let operations  = this.tx.operations() || [];
        this.operations = map(operations, op => {
          return Operation.operationToObject(op);
        });

        let signatures = envelope.signatures() || [];
        this.signatures = map(signatures, s => s);
    }

    /**
    * Signs the transaction with the given Keypair.
    * @param {...Keypair} keypairs
    */
    sign(...keypairs) {
        let txHash = this.hash();
        let newSigs = each(keypairs, kp => {
          let sig = kp.signDecorated(txHash);
          this.signatures.push(sig);
        });
    }

    /**
    * Returns a hash for this transaction, suitable for signing.
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
    */
    signatureBase() {
        return Buffer.concat([
            this.signatureBasePrefix(),
            this.tx.toXDR(),
        ]);
    }

    signatureBasePrefix() {
        return xdr.EnvelopeType.envelopeTypeTx().toXDR();
    }

    /**
    * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
    */
    toEnvelope() {
        let tx = this.tx;
        let signatures = this.signatures;
        let envelope = new xdr.TransactionEnvelope({tx, signatures});

        return envelope;
    }
}
