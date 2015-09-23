# Building Transactions

[Transactions](https://stellar.org/developers/learn/concepts/transactions/) are the commands that modify the state of the ledger.
They include sending payments, creating offers, making account configuration changes, etc.

Transactions are made up of one or more [operations](https://stellar.org/developers/learn/concepts/operations/). When building a
transaction you add operations sequentially. All operations either succeed or they all fail when the transaction is applied.

```js
var transaction = new StellarBase.TransactionBuilder(account)
        // add a payment operation to the transaction
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "20000000"
            }))
        // add a set options operation to the transaction
        .addOperation(StellarBase.Operation.setOptions({
                signer: {
                    address: secondAccountAddress,
                    weight: 1
                }
            }))
```

Every transactions has a source [account](https://stellar.org/developers/learn/concepts/accounts/). This is the account
that pays the [fee](https://stellar.org/developers/learn/concepts/fees/) and uses up a sequence number for the transaction.
Each operation also has a source account, which defaults to the transaction's source account.


## Sequence Numbers

There are strict rules governing a transaction's sequence number.  That sequence number has to match the sequence number
stored by the source account or else the transaction is invalid.  After the transaction is submitted and applied to the
ledger, the source account's sequence number increases by 1.

There are two ways to ensure correct sequence numbers:

1. Read the source account's sequence number before submitting a transaction
2. Manage the sequence number locally

During periods of high transaction throughput, fetching a source account's sequence number from the network may not return
the correct value.  So, if you're submitting many transactions quickly, you will want to keep track of the sequence number locally.

## Adding Memos

Transactions can contain a "memo" field to attach additional information to the transaction. You set this as one of the
options to the [TransactionBuilder](https://github.com/stellar/js-stellar-base/blob/master/src/transaction_builder.js).

## Signing and Multi-sig
Transactions require signatures for authorization, and generally they only require one.  However, you can exercise more
control over authorization and set up complex schemes by increasing the number of signatures a transaction requires.  For
more, please consult the [multi-sig documentation](https://stellar.org/developers/learn/concepts/multi-sig/).

You add signatures to a transaction with the `addSigner()` function. You can chain multiple `addSigner()` calls together.