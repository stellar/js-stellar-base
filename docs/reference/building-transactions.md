---
title: Building Transactions
---

[Transactions](https://stellar.org/developers/learn/concepts/transactions.html) are the commands that modify the state of the ledger.
They include sending payments, creating offers, making account configuration changes, etc.

Every transaction has a source [account](https://stellar.org/developers/learn/concepts/accounts.html). This is the account
that pays the [fee](https://stellar.org/developers/learn/concepts/fees.html) and uses up a sequence number for the transaction.

Transactions are made up of one or more [operations](https://stellar.org/developers/learn/concepts/operations.html). Each operation also has a source account, which defaults to the transaction's source account.


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
StellarSdk.Network.useTestNetwork();
// StellarBase.Network.usePublicNetwork(); if this transaction is for the public network
// Create an Account object from an address and sequence number.
var account=new StellarBase.Account("GD6WU64OEP5C4LRBH6NK3MHYIA2ADN6K6II6EXPNVUR3ERBXT4AN4ACD","2319149195853854");

var transaction = new StellarBase.TransactionBuilder(account)
        // add a payment operation to the transaction
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "100.50"  // 100.50 XLM
            }))
        // add a set options operation to the transaction
        .addOperation(StellarBase.Operation.setOptions({
                signer: {
                    ed25519PublicKey: secondAccountAddress,
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
* `Memo.text` - 28-byte ascii encoded string memo,
* `Memo.id` - 64-bit number memo,
* `Memo.hash` - 32-byte hash - ex. hash of an item in a content server,
* `Memo.returnHash` - 32-byte hash used for returning payments - contains hash of the transaction being rejected.

```js
var memo = Memo.text('Happy birthday!');
var transaction = new StellarBase.TransactionBuilder(account, {memo:memo})
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "2000"
            }))
        .build();
```


## [Transaction](https://github.com/stellar/js-stellar-base/blob/master/src/transaction.js)

You probably won't instantiate `Transaction` objects directly. Objects of this class are returned after `TransactionBuilder`
builds a transaction. However, you can create a new `Transaction` object from a base64 representation of a transaction envelope.

```js
var transaction = new Transaction(envelope);
```

> Once a Transaction has been created from an envelope, its attributes and operations should not be changed. You should only add signatures to a Transaction object before submitting to the network or forwarding on for others to also sign.

Most importantly, you can sign a transaction using `sign()` method. See below...


## Signing and Multi-sig
Transactions require signatures for authorization, and generally they only require one.  However, you can exercise more
control over authorization and set up complex schemes by increasing the number of signatures a transaction requires.  For
more, please consult the [multi-sig documentation](https://stellar.org/developers/learn/concepts/multi-sig.html).

You add signatures to a transaction with the `Transaction.sign()` function. You can chain multiple `sign()` calls together.

## `Keypair` class

`Keypair` object represents key pair used to sign transactions in Stellar network. `Keypair` object can contain both a public and private key, or only a public key.

If `Keypair` object does not contain private key it can't be used to sign transactions. The most convenient method of creating new keypair is by passing the account's secret seed:

```js
var keypair = Keypair.fromSecret('SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM');
var address = keypair.publicKey(); // GDHMW6QZOL73SHKG2JA3YHXFDHM46SS5ZRWEYF5BCYHX2C5TVO6KZBYL
var canSign = keypair.canSign(); // true
```

You can create `Keypair` object from secret seed raw bytes:

```js
var keypair = Keypair.fromRawSeed([0xdc, 0x9c, 0xbf, 0xb5, 0xd7, 0x12, 0x83, 0x6a, 0xbf, 0x7d, 0x5d, 0xd8, 0xc4, 0xc4, 0x3e, 0x9d, 0xc7, 0x81, 0x85, 0xf1, 0x4b, 0x12, 0x0e, 0x9b, 0x59, 0x5d, 0x62, 0x65, 0x52, 0xa8, 0xcb, 0xcc]);
var address = keypair.publicKey(); // GADMPH2LB7VDK4UHNGKMJIJBXC5WTWTQMXYWSPVWPMNVVR4MGWLI2IXN
var canSign = keypair.canSign(); // true
```

You can also create a randomly generated keypair:
```js
var keypair = Keypair.random();
```


```js
StellarBase.Network.useTestNetwork();
var key1 = Keypair.fromSecret('SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM');
var key2 = Keypair.fromSecret('SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7');

// Create an Account object from an address and sequence number.
var account=new StellarBase.Account("GD6WU64OEP5C4LRBH6NK3MHYIA2ADN6K6II6EXPNVUR3ERBXT4AN4ACD","2319149195853854");

var transaction = new StellarBase.TransactionBuilder(account)
        .addOperation(StellarBase.Operation.payment({
                destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
                asset: StellarBase.Asset.native(),
                amount: "2000"  // 2000 XLM
            }))
        .build();

transaction.sign(key1);
transaction.sign(key2);
// submit tx to Horizon...
```


