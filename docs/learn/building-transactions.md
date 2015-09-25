---
title: Building Transactions
---

[Transactions](https://stellar.org/developers/learn/concepts/transactions/) are the commands that modify the state of the ledger.
They include sending payments, creating offers, making account configuration changes, etc.

Every transactions has a source [account](https://stellar.org/developers/learn/concepts/accounts/). This is the account
that pays the [fee](https://stellar.org/developers/learn/concepts/fees/) and uses up a sequence number for the transaction.

Transactions are made up of one or more [operations](https://stellar.org/developers/learn/concepts/operations/). Each operation also has a source account, which defaults to the transaction's source account.


## [TransactionBuilder](https://github.com/stellar/js-stellar-base/blob/master/src/transaction_builder.js)

The `TransactionBuilder` class is used to construct new transactions. TransactionBuilder is given an account that is used as transaction's "source account".
The transaction will use the current sequence number of the given [Account](https://github.com/stellar/js-stellar-base/blob/master/src/account.js) object as its sequence number and increments
the given account's sequence number when `build()` is called on the `TransactionBuilder`.

Operations can be added to the transaction calling `addOperation(operation)` for each operation you wish to add to the transaction.
See [operation.js](https://github.com/stellar/js-stellar-base/blob/master/src/operation.js) for a list of possible operations you can add.
`addOperation(operation)` returns the current `TransactionBuilder` object so you can chain multiple calls.

After adding the desired operations, call the `build()` method on the `TransactionBuilder`.
This will return a fully constructed [Transaction](https://github.com/stellar/js-stellar-base/blob/master/src/transaction.js).
The returned transaction will contain the sequence number of the source account. This transaction is unsigned. You must sign it before it will be accepted by the Stellar network.


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
        .build();
```



## Sequence Numbers

The sequence number of a transaction has to match the sequence number stored by the source account or else the transaction is invalid.
After the transaction is submitted and applied to the ledger, the source account's sequence number increases by 1.

There are two ways to ensure correct sequence numbers:

1. Read the source account's sequence number before submitting a transaction
2. Manage the sequence number locally

During periods of high transaction throughput, fetching a source account's sequence number from the network may not return
the correct value.  So, if you're submitting many transactions quickly, you will want to keep track of the sequence number locally.

## Adding Memos
Transactions can contain a "memo" field you can use to attach additional information to the transaction. You can do this
by passing a [memo](https://github.com/stellar/js-stellar-base/blob/master/src/memo.js) object when you construct the TransactionBuilder.
There are 5 types of memos:
* `Memo.none` - empty memo,
* `Memo.text` - 32 bytes ascii encoded string memo,
* `Memo.id` - 64-bit number memo,
* `Memo.hash` - 32-bit hash - ex. hash of an item in a content server,
* `Memo.returnHash` - 32-bit hash used for returning payments - contains hash of the transaction being rejected.

```js
var memo = Memo.text('Happy birthday!');
var transaction = new StellarBase.TransactionBuilder(account, {memo:memo})
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "20000000"
            }))
        .build();
```


## [Transaction](https://github.com/stellar/js-stellar-base/blob/master/src/transaction.js)

You probably won't instantiate `Transaction` objects directly. Objects of this class are returned after `TransactionBuilder`
builds a transaction. However, you can create a new `Transaction` object from a hex representation of a transaction envelope.

```js
var transaction = new Transaction(envelope);
```

> Once a Transaction has been created from an envelope, its attributes and operations should not be changed. You should only add signatures to a Transaction object before submitting to the network or forwarding on for others to also sign.

Most importantly, you can sign a transaction using `sign()` method. See below...


## Signing and Multi-sig
Transactions require signatures for authorization, and generally they only require one.  However, you can exercise more
control over authorization and set up complex schemes by increasing the number of signatures a transaction requires.  For
more, please consult the [multi-sig documentation](https://stellar.org/developers/learn/concepts/multi-sig/).

You add signatures to a transaction with the `Transaction.sign()` function. You can chain multiple `sign()` calls together.

## `Keypair` class

`Keypair` object represents key pair used to sign transactions in Stellar network. `Keypair` object can contain both a public and private key, or only a public key.

If `Keypair` object does not contain private key it can't be used to sign transactions. The most convenient method of creating new keypair is by passing the account's secret seed:

```js
let keypair = Keypair.fromSeed('SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM');
let address = keypair.address(); // GDHMW6QZOL73SHKG2JA3YHXFDHM46SS5ZRWEYF5BCYHX2C5TVO6KZBYL
let canSign = keypair.canSign(); // true
```

You can also create a randomly generated keypair:
```js
let keypair = Keypair.random();
```


```js
var key1 = Keypair.fromSeed('SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM');
var key2 = Keypair.fromSeed('SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7');

var transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "20000000"
            }))
        .build();

transaction.sign(key1);
transaction.sign(key2);
// submit tx to Horizon...
```


