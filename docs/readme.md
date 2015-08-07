---
id: readme
title: Getting Started
category: Getting Started
---

# Overview

The stellar-base library is the lowest-level stellar helper library.  It consists of classes to read, write, hash, and sign the xdr structures that are used in stellar-core.

# Building

To build this project run:

```
gulp build
```

More information about building can be found in the main [README.md](https://github.com/stellar/js-stellar-base/blob/master/README.md) file.

# Using js-stellar-base

You can use js-stellar-base in a browser or in Node.js.
* To use it in a browser simply load one of the scripts in `dist` directory using `<script>` tag.
* In Node.js use `require`/`import` to load a library.

js-stellar-base exposes following classes:
* `Account` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/account.js)</sub>
* `Asset` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/asset.js)</sub>
* `Keypair` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/keypair.js)</sub>
* `Memo` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/memo.js)</sub>
* `Operation` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/operation.js)</sub>
* `Transaction` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/transaction.js)</sub>
* `TransactionBuilder` <sub>[_source_](https://github.com/stellar/js-stellar-base/blob/master/src/transaction_builder.js)</sub>

## `Account` class

Object of `Account` class represents a single account in Stellar network and it's [sequence number]().

```js
var account = new Account('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB', 46316927320064);
```

## `Asset` class

Object of `Asset` class represents an asset in Stellar network. Right now there are 3 possible types of assets in Stellar network:
* native `XLM` asset (`ASSET_TYPE_NATIVE`),
* issued assets with asset code of maximum 4 characters (`ASSET_TYPE_CREDIT_ALPHANUM4`),
* issued assets with asset code of maximum 12 characters (`ASSET_TYPE_CREDIT_ALPHANUM12`).

To create a new native asset representation use static `native()` method:
```js
var nativeAsset = Asset.native();
var isNative = nativeAsset.isNative(); // true
```

To represent issued asset you need to create a new object of `Asset` with asset code and issuer:
```js
// Creates TEST asset issued by GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB
var testAsset = new Asset('TEST', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
var isNative = testAsset.isNative(); // false
// Creates Google stock asset issued by GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB
var googleStockAsset = new Asset('US38259P7069', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
```

Underlying structure depends on asset code length.

## `Keypair` class

`Keypair` object represents key pair used to sign transactions in Stellar network. `Keypair` object can:
* contain both public and private key,
* only public key.

If `Keypair` object does not contain private key it can't be used to sign transactions. The most convinient method of creating new keypair is by passing your account secret seed:

```js
let keypair = Keypair.fromSeed('SBK2VIYYSVG76E7VC3QHYARNFLY2EAQXDHRC7BMXBBGIFG74ARPRMNQM');
let address = keypair.address(); // GDHMW6QZOL73SHKG2JA3YHXFDHM46SS5ZRWEYF5BCYHX2C5TVO6KZBYL
let canSign = keypair.canSign(); // true
```

You can also create randomly generated keypair:
```js
let keypair = Keypair.random();
```

## `Memo` class

`Memo` object represents a message/information that can be attached to a transaction. There are 5 types of memos:
* `Memo.none` - empty memo,
* `Memo.text` - 32 bytes ascii encoded string memo,
* `Memo.id` - 64-bit number memo,
* `Memo.hash` - 32-bit hash - ex. hash of the item in the content server,
* `Memo.returnHash` - 32-bit hash used for returning transansfers - contains hash of transaction being rejected.

```js
var memo = Memo.text('Happy birthday!');
```

## `Operation` class

`Operation` object represents a single operation. Possible operations:
* `Operation.createAccount` - Creates a new account in Stellar network
* `Operation.payment` - Sends a simple payment between two accounts in Stellar network,
* `Operation.pathPayment` - Sends a path payment between two accounts in the Stellar network,
* `Operation.manageOffer` - Creates, updates or deletes an offer in the Stellar network,
* `Operation.createPassiveOffer` - Creates an offer that won't consume a counter offer that exactly matches this offer,
* `Operation.setOptions` - Sets account options (inflation destination, adding signers, etc.),
* `Operation.changeTrust` - Creates, updates or deletes a trust line,
* `Operation.allowTrust` - Updates the "authorized" flag of an existing trust line this is called by the issuer of the related currency,
* `Operation.accountMerge` - Deletes account and transfers remaining balance to destination account,
* `Operation.inflation` - Runs inflation.

Created operation can then be added to a transaction:

```js
var keypair = Keypair.random();
var destination = 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
var currency = Currency.native();
var amount = 1000000;
var transaction = new TransactionBuilder(this.session.getAccount())
  .addOperation(Operation.payment({
    destination: destination,
    currency: currency,
    amount: amount
  }))
  .addSigner(keypair)
  .build();
```

## `Transaction` class

You probably won't instantiate `Transaction` object directly. Objects of this class are returned after `TransactionBuilder` builds a transaction from operations and signs it. However, you can create a new `Transaction` object from a hex representation of transaction envelope.

```js
var transaction = new Transaction(envelope);
```

Most importantly, you can sign a transaction using `sign()` method:

```js
var keypair = Keypair.fromSeed('SECRETSEED');
transaction.sign([keypair]);
```

> Once a Transaction has been created from an envelope, its attributes and operations should not be changed. You should only add signers to a Transaction object before submitting to the network or forwarding on to additional signers.

## `TransactionBuilder` class

`TransactionBuilder` helps constructs a new `Transaction` using the given account as the transaction's "source account". The transaction will use the current sequence number of the given `Account` object as its sequence number and increment the given account's sequence number by one.

Operations can be added to the transaction using `addOperation(operation)` method which returns the current `TransactionBuilder` object so they can be chained together. After adding the desired operations, call the `build()` method on the TransactionBuilder to return a fully constructed Transaction that can be signed. The returned transaction will contain the sequence number of the source account and include the signature from the source account.

To sign a transaction execute `addSigner(keypair)` method.

```js
var source = new Account('GABJLI6IVBKJ7HIC5NN7HHDCIEW3CMWQ2DWYHREQQUFWSWZ2CDAMZZX4', 46316927324160);
var transaction = new TransactionBuilder(source)
  .addOperation(Operation.payment({
      destination: 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      amount: 20000000,
      currency: Currency.native()
  })
  .addSigner(keypair)
  .build();
```

# Examples
