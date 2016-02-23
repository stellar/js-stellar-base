import {xdr, hash} from "./index";

import {encodeCheck} from "./strkey";
import {Operation} from "./operation";
import {Network} from "./network";
import map from "lodash/map";
import each from "lodash/each";

let MIN_LEDGER   = 0;
let MAX_LEDGER   = 0xFFFFFFFF; // max uint32

export class Transaction {
    /**
    * A new Transaction object is created from a transaction envelope or via {@link TransactionBuilder}.
    * Once a Transaction has been created from an envelope, its attributes and operations
    * should not be changed. You should only add signers (using {@link Transaction#sign}) to a Transaction object before
    * submitting to the network or forwarding on to additional signers.
    * @constructor
    * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
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
        this.memo     = this.tx.memo();
        this.sequence = this.tx.seqNum().toString();

        let timeBounds = this.tx.timeBounds();
        if (timeBounds) {
            this.timeBounds = {
                minTime: timeBounds.minTime().toString(),
                maxTime: timeBounds.maxTime().toString()
            };
        }

        let operations  = this.tx.operations() || [];
        this.operations = map(operations, op => {
          return Operation.operationToObject(op);
        });

        let signatures = envelope.signatures() || [];
        this.signatures = map(signatures, s => s);
    }

    /**
     * Signs the transaction with the given {@link Keypair}.
     * @param {...Keypair} keypairs Keypairs of signers
     * @returns {void}
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
            Network.current().networkId(),
            xdr.EnvelopeType.envelopeTypeTx().toXDR(),
            this.tx.toXDR()
        ]);
    }

    /**
     * To envelope returns a xdr.TransactionEnvelope which can be submitted to the network.
     * @returns {xdr.TransactionEnvelope}
     */
    toEnvelope() {
        let tx = this.tx;
        let signatures = this.signatures;
        let envelope = new xdr.TransactionEnvelope({tx, signatures});

        return envelope;
    }
}
