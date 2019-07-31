import { UnsignedHyper } from 'js-xdr';
import BigNumber from 'bignumber.js';
import clone from 'lodash/clone';
import isUndefined from 'lodash/isUndefined';
import xdr from './generated/stellar-xdr_generated';
import { Keypair } from './keypair';
import { Transaction } from './transaction';
import { Memo } from './memo';
import { Network } from './network';

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
export const BASE_FEE = 100; // Stroops

/**
 * @constant
 * @see {@link TransactionBuilder#setTimeout}
 * @see [Timeout](https://www.stellar.org/developers/horizon/reference/endpoints/transactions-create.html#timeout)
 */
export const TimeoutInfinite = 0;

/**
 * <p>Transaction builder helps constructs a new `{@link Transaction}` using the given {@link Account}
 * as the transaction's "source account". The transaction will use the current sequence
 * number of the given account as its sequence number and increment the given account's
 * sequence number by one. The given source account must include a private key for signing
 * the transaction or an error will be thrown.</p>
 *
 * <p>Operations can be added to the transaction via their corresponding builder methods, and
 * each returns the TransactionBuilder object so they can be chained together. After adding
 * the desired operations, call the `build()` method on the `TransactionBuilder` to return a fully
 * constructed `{@link Transaction}` that can be signed. The returned transaction will contain the
 * sequence number of the source account and include the signature from the source account.</p>
 *
 * <p><strong>Be careful about unsubmitted transactions!</strong> When you build a transaction, stellar-sdk
 * automatically increments the source account's sequence number. If you end up
 * not submitting this transaction and submitting another one instead, it'll fail due to
 * the sequence number being wrong. So if you decide not to use a built transaction,
 * make sure to update the source account's sequence number
 * with [Server.loadAccount](https://stellar.github.io/js-stellar-sdk/Server.html#loadAccount) before creating another transaction.</p>
 *
 * <p>The following code example creates a new transaction with {@link Operation.createAccount} and
 * {@link Operation.payment} operations.
 * The Transaction's source account first funds `destinationA`, then sends
 * a payment to `destinationB`. The built transaction is then signed by `sourceKeypair`.</p>
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
 * @constructor
 * @param {Account} sourceAccount - The source account for this transaction.
 * @param {object} opts Options object
 * @param {number} opts.fee - The max fee willing to pay per operation in this transaction (**in stroops**). Required.
 * @param {object} [opts.timebounds] - The timebounds for the validity of this transaction.
 * @param {number|string|Date} [opts.timebounds.minTime] - 64 bit unix timestamp or Date object
 * @param {number|string|Date} [opts.timebounds.maxTime] - 64 bit unix timestamp or Date object
 * @param {Memo} [opts.memo] - The memo for the transaction
 * @param {string} [opts.networkPassphrase] passphrase of the target stellar network (e.g. "Public Global Stellar Network ; September 2015").
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
    this.timeoutSet = false;
    this.networkPassphrase = opts.networkPassphrase || null;
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
    if (this.timebounds != null && this.timebounds.maxTime > 0) {
      throw new Error(
        'TimeBounds.max_time has been already set - setting timeout would overwrite it.'
      );
    }

    if (timeout < 0) {
      throw new Error('timeout cannot be negative');
    }

    this.timeoutSet = true;
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
   * This will build the transaction.
   * It will also increment the source account's sequence number by 1.
   * @returns {Transaction} This method will return the built {@link Transaction}.
   */
  build() {
    // Ensure setTimeout called or maxTime is set
    if (
      (this.timebounds === null ||
        (this.timebounds !== null && this.timebounds.maxTime === 0)) &&
      !this.timeoutSet
    ) {
      throw new Error(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    }

    const sequenceNumber = new BigNumber(this.source.sequenceNumber()).add(1);

    const attrs = {
      sourceAccount: Keypair.fromPublicKey(
        this.source.accountId()
      ).xdrAccountId(),
      fee: this.baseFee * this.operations.length,
      seqNum: xdr.SequenceNumber.fromString(sequenceNumber.toString()),
      memo: this.memo ? this.memo.toXDRObject() : null,
      ext: new xdr.TransactionExt(0)
    };

    if (this.timebounds) {
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
    }

    const xtx = new xdr.Transaction(attrs);
    xtx.operations(this.operations);

    const xenv = new xdr.TransactionEnvelope({ tx: xtx });
    const tx = new Transaction(xenv, this.networkPassphrase);

    this.source.incrementSequenceNumber();

    return tx;
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
