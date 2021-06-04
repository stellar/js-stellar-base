import { UnsignedHyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import clone from 'lodash/clone';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';

import xdr from './generated/stellar-xdr_generated';
import { Transaction } from './transaction';
import { FeeBumpTransaction } from './fee_bump_transaction';
import { Memo } from './memo';
import { decodeAddressToMuxedAccount } from './util/decode_encode_muxed_account';

/**
 * Minimum base fee for transactions. If this fee is below the network
 * minimum, the transaction will fail. The more operations in the
 * transaction, the greater the required fee. Use {@link
 * Server#fetchBaseFee} to get an accurate value of minimum transaction
 * fee on the network.
 *
 * @constant
 * @see [Fees](https://www.stellar.org/developers/guides/concepts/fees.html)
 */
export const BASE_FEE = '100'; // Stroops

/**
 * @constant
 * @see {@link TransactionBuilder#setTimeout}
 * @see [Timeout](https://www.stellar.org/developers/horizon/reference/endpoints/transactions-create.html#timeout)
 */
export const TimeoutInfinite = 0;

/**
 * <p>Transaction builder helps constructs a new `{@link Transaction}` using the
 * given {@link Account} as the transaction's "source account". The transaction
 * will use the current sequence number of the given account as its sequence
 * number and increment the given account's sequence number by one. The given
 * source account must include a private key for signing the transaction or an
 * error will be thrown.</p>
 *
 * <p>Operations can be added to the transaction via their corresponding builder
 * methods, and each returns the TransactionBuilder object so they can be
 * chained together. After adding the desired operations, call the `build()`
 * method on the `TransactionBuilder` to return a fully constructed `{@link
 * Transaction}` that can be signed. The returned transaction will contain the
 * sequence number of the source account and include the signature from the
 * source account.</p>
 *
 * <p><strong>Be careful about unsubmitted transactions!</strong> When you build
 * a transaction, stellar-sdk automatically increments the source account's
 * sequence number. If you end up not submitting this transaction and submitting
 * another one instead, it'll fail due to the sequence number being wrong. So if
 * you decide not to use a built transaction, make sure to update the source
 * account's sequence number with
 * [Server.loadAccount](https://stellar.github.io/js-stellar-sdk/Server.html#loadAccount)
 * before creating another transaction.</p>
 *
 * <p>The following code example creates a new transaction with {@link
 * Operation.createAccount} and {@link Operation.payment} operations. The
 * Transaction's source account first funds `destinationA`, then sends a payment
 * to `destinationB`. The built transaction is then signed by
 * `sourceKeypair`.</p>
 *
 * ```
 * var transaction = new TransactionBuilder(source, { fee, networkPassphrase: Networks.TESTNET })
 * .addOperation(Operation.createAccount({
 *     destination: destinationA,
 *     startingBalance: "20"
 * })) // <- funds and creates destinationA
 * .addOperation(Operation.payment({
 *     destination: destinationB,
 *     amount: "100",
 *     asset: Asset.native()
 * })) // <- sends 100 XLM to destinationB
 * .setTimeout(30)
 * .build();
 *
 * transaction.sign(sourceKeypair);
 * ```
 *
 * @constructor
 *
 * @param {Account} sourceAccount - source account for this transaction
 * @param {object}  opts          - Options object
 * @param {string}  opts.fee      - max fee you're willing to pay per
 *     operation in this transaction (**in stroops**)
 *
 * @param {object}              [opts.timebounds] - timebounds for the
 *     validity of this transaction
 * @param {number|string|Date}  [opts.timebounds.minTime] - 64-bit UNIX
 *     timestamp or Date object
 * @param {number|string|Date}  [opts.timebounds.maxTime] - 64-bit UNIX
 *     timestamp or Date object
 * @param {Memo}                [opts.memo] - memo for the transaction
 * @param {string}              [opts.networkPassphrase] passphrase of the
 *     target Stellar network (e.g. "Public Global Stellar Network ; September
 *     2015" for the pubnet)
 * @param {bool}    [opts.withMuxing] - Indicates that the source account of
 *     every transaction created by this Builder can be interpreted as a proper
 *     muxed account (i.e. coming from an M... address). By default, this option
 *     is disabled until muxed accounts are mature.
 */
export class TransactionBuilder {
  constructor(sourceAccount, opts = {}) {
    if (!sourceAccount) {
      throw new Error('must specify source account for the transaction');
    }

    if (isUndefined(opts.fee)) {
      throw new Error('must specify fee for the transaction (in stroops)');
    }

    this.source = sourceAccount;
    this.operations = [];

    this.baseFee = isUndefined(opts.fee) ? BASE_FEE : opts.fee;
    this.timebounds = clone(opts.timebounds) || null;
    this.memo = opts.memo || Memo.none();
    this.networkPassphrase = opts.networkPassphrase || null;
    this.supportMuxedAccounts = opts.withMuxing || false;
  }

  /**
   * Adds an operation to the transaction.
   * @param {xdr.Operation} operation The xdr operation object, use {@link Operation} static methods.
   * @returns {TransactionBuilder}
   */
  addOperation(operation) {
    this.operations.push(operation);
    return this;
  }

  /**
   * Adds a memo to the transaction.
   * @param {Memo} memo {@link Memo} object
   * @returns {TransactionBuilder}
   */
  addMemo(memo) {
    this.memo = memo;
    return this;
  }

  /**
   * Because of the distributed nature of the Stellar network it is possible that the status of your transaction
   * will be determined after a long time if the network is highly congested.
   * If you want to be sure to receive the status of the transaction within a given period you should set the
   * {@link TimeBounds} with <code>maxTime</code> on the transaction (this is what <code>setTimeout</code> does
   * internally; if there's <code>minTime</code> set but no <code>maxTime</code> it will be added).
   * Call to <code>TransactionBuilder.setTimeout</code> is required if Transaction does not have <code>max_time</code> set.
   * If you don't want to set timeout, use <code>{@link TimeoutInfinite}</code>. In general you should set
   * <code>{@link TimeoutInfinite}</code> only in smart contracts.
   *
   * Please note that Horizon may still return <code>504 Gateway Timeout</code> error, even for short timeouts.
   * In such case you need to resubmit the same transaction again without making any changes to receive a status.
   * This method is using the machine system time (UTC), make sure it is set correctly.
   * @param {number} timeout Number of seconds the transaction is good. Can't be negative.
   * If the value is `0`, the transaction is good indefinitely.
   * @return {TransactionBuilder}
   * @see TimeoutInfinite
   */
  setTimeout(timeout) {
    if (this.timebounds !== null && this.timebounds.maxTime > 0) {
      throw new Error(
        'TimeBounds.max_time has been already set - setting timeout would overwrite it.'
      );
    }

    if (timeout < 0) {
      throw new Error('timeout cannot be negative');
    }

    if (timeout > 0) {
      const timeoutTimestamp = Math.floor(Date.now() / 1000) + timeout;
      if (this.timebounds === null) {
        this.timebounds = { minTime: 0, maxTime: timeoutTimestamp };
      } else {
        this.timebounds = {
          minTime: this.timebounds.minTime,
          maxTime: timeoutTimestamp
        };
      }
    } else {
      this.timebounds = {
        minTime: 0,
        maxTime: 0
      };
    }

    return this;
  }

  /**
   * Set network nassphrase for the Transaction that will be built.
   *
   * @param {string} [networkPassphrase] passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
   * @returns {TransactionBuilder}
   */
  setNetworkPassphrase(networkPassphrase) {
    this.networkPassphrase = networkPassphrase;
    return this;
  }

  /**
   * Enable support for muxed accounts for the Transaction that will be built.
   * @returns {TransactionBuilder}
   */
  enableMuxedAccounts() {
    this.supportMuxedAccounts = true;
    return this;
  }

  /**
   * This will build the transaction.
   * It will also increment the source account's sequence number by 1.
   * @returns {Transaction} This method will return the built {@link Transaction}.
   */
  build() {
    const sequenceNumber = new BigNumber(this.source.sequenceNumber()).add(1);
    const fee = new BigNumber(this.baseFee)
      .mul(this.operations.length)
      .toNumber();
    const attrs = {
      fee,
      seqNum: xdr.SequenceNumber.fromString(sequenceNumber.toString()),
      memo: this.memo ? this.memo.toXDRObject() : null
    };

    if (
      this.timebounds === null ||
      typeof this.timebounds.minTime === 'undefined' ||
      typeof this.timebounds.maxTime === 'undefined'
    ) {
      throw new Error(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    }

    if (isValidDate(this.timebounds.minTime)) {
      this.timebounds.minTime = this.timebounds.minTime.getTime() / 1000;
    }
    if (isValidDate(this.timebounds.maxTime)) {
      this.timebounds.maxTime = this.timebounds.maxTime.getTime() / 1000;
    }

    this.timebounds.minTime = UnsignedHyper.fromString(
      this.timebounds.minTime.toString()
    );
    this.timebounds.maxTime = UnsignedHyper.fromString(
      this.timebounds.maxTime.toString()
    );

    attrs.timeBounds = new xdr.TimeBounds(this.timebounds);
    attrs.sourceAccount = decodeAddressToMuxedAccount(
      this.source.accountId(),
      this.supportMuxedAccounts
    );
    attrs.ext = new xdr.TransactionExt(0);

    const xtx = new xdr.Transaction(attrs);
    xtx.operations(this.operations);
    const txEnvelope = new xdr.TransactionEnvelope.envelopeTypeTx(
      new xdr.TransactionV1Envelope({ tx: xtx })
    );

    const tx = new Transaction(
      txEnvelope,
      this.networkPassphrase,
      this.supportMuxedAccounts
    );

    this.source.incrementSequenceNumber();

    return tx;
  }

  /**
   * Builds a {@link FeeBumpTransaction}, enabling you to resubmit an existing
   * transaction with a higher fee.
   *
   * @param {Keypair|string}  feeSource - account paying for the transaction,
   *     in the form of either a Keypair (only the public key is used) or
   *     an account ID (in G... or M... form, but refer to `withMuxing`)
   * @param {string}          baseFee   - max fee willing to pay per operation
   *     in inner transaction (**in stroops**)
   * @param {Transaction}     innerTx   - {@link Transaction} to be bumped by
   *     the fee bump transaction
   * @param {string}          networkPassphrase - passphrase of the target Stellar
   *     network (e.g. "Public Global Stellar Network ; September 2015")
   * @param {bool}            [withMuxing]      - allows fee sources to be proper
   *     muxed accounts (i.e. coming from an M... address). By default, this
   *     option is disabled until muxed accounts are mature.
   *
   * @todo Alongside the next major version bump, this type signature can be
   *       changed to be less awkward: accept a MuxedAccount as the `feeSource`
   *       rather than a keypair or string.
   *
   * @note Your fee-bump amount should be 10x the original fee.
   * @see  https://developers.stellar.org/docs/glossary/fee-bumps/#replace-by-fee
   *
   * @returns {FeeBumpTransaction}
   */
  static buildFeeBumpTransaction(
    feeSource,
    baseFee,
    innerTx,
    networkPassphrase,
    withMuxing
  ) {
    const innerOps = innerTx.operations.length;
    const innerBaseFeeRate = new BigNumber(innerTx.fee).div(innerOps);
    const base = new BigNumber(baseFee);

    // The fee rate for fee bump is at least the fee rate of the inner transaction
    if (base.lessThan(innerBaseFeeRate)) {
      throw new Error(
        `Invalid baseFee, it should be at least ${innerBaseFeeRate} stroops.`
      );
    }

    const minBaseFee = new BigNumber(BASE_FEE);

    // The fee rate is at least the minimum fee
    if (base.lessThan(minBaseFee)) {
      throw new Error(
        `Invalid baseFee, it should be at least ${minBaseFee} stroops.`
      );
    }

    let innerTxEnvelope = innerTx.toEnvelope();
    if (innerTxEnvelope.switch() === xdr.EnvelopeType.envelopeTypeTxV0()) {
      const v0Tx = innerTxEnvelope.v0().tx();
      const v1Tx = new xdr.Transaction({
        sourceAccount: new xdr.MuxedAccount.keyTypeEd25519(
          v0Tx.sourceAccountEd25519()
        ),
        fee: v0Tx.fee(),
        seqNum: v0Tx.seqNum(),
        timeBounds: v0Tx.timeBounds(),
        memo: v0Tx.memo(),
        operations: v0Tx.operations(),
        ext: new xdr.TransactionExt(0)
      });
      innerTxEnvelope = new xdr.TransactionEnvelope.envelopeTypeTx(
        new xdr.TransactionV1Envelope({
          tx: v1Tx,
          signatures: innerTxEnvelope.v0().signatures()
        })
      );
    }

    let feeSourceAccount;
    if (isString(feeSource)) {
      feeSourceAccount = decodeAddressToMuxedAccount(feeSource, withMuxing);
    } else {
      feeSourceAccount = feeSource.xdrMuxedAccount();
    }

    const tx = new xdr.FeeBumpTransaction({
      feeSource: feeSourceAccount,
      fee: xdr.Int64.fromString(base.mul(innerOps + 1).toString()),
      innerTx: xdr.FeeBumpTransactionInnerTx.envelopeTypeTx(
        innerTxEnvelope.v1()
      ),
      ext: new xdr.FeeBumpTransactionExt(0)
    });
    const feeBumpTxEnvelope = new xdr.FeeBumpTransactionEnvelope({
      tx,
      signatures: []
    });
    const envelope = new xdr.TransactionEnvelope.envelopeTypeTxFeeBump(
      feeBumpTxEnvelope
    );

    return new FeeBumpTransaction(envelope, networkPassphrase, withMuxing);
  }

  /**
   * Build a {@link Transaction} or {@link FeeBumpTransaction} from an xdr.TransactionEnvelope.
   * @param {string|xdr.TransactionEnvelope} envelope - The transaction envelope object or base64 encoded string.
   * @param {string} networkPassphrase - networkPassphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
   * @returns {Transaction|FeeBumpTransaction}
   */
  static fromXDR(envelope, networkPassphrase) {
    if (typeof envelope === 'string') {
      envelope = xdr.TransactionEnvelope.fromXDR(envelope, 'base64');
    }

    if (envelope.switch() === xdr.EnvelopeType.envelopeTypeTxFeeBump()) {
      return new FeeBumpTransaction(envelope, networkPassphrase);
    }

    return new Transaction(envelope, networkPassphrase);
  }
}

/**
 * Checks whether a provided object is a valid Date.
 * @argument {Date} d date object
 * @returns {boolean}
 */
export function isValidDate(d) {
  // isnan is okay here because it correctly checks for invalid date objects
  // eslint-disable-next-line no-restricted-globals
  return d instanceof Date && !isNaN(d);
}
