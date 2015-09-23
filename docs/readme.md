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

Object of `Account` class represents a single account in Stellar network and its sequence number. `Account` tracts the sequence number as it is used by `TransactionBuilder`.

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
transaction.sign(keypair);
```

> Once a Transaction has been created from an envelope, its attributes and operations should not be changed. You should only add signers to a Transaction object before submitting to the network or forwarding on to additional signers.

## `TransactionBuilder` class

`TransactionBuilder` helps constructs a new `Transaction` using the given account as the transaction's "source account". The transaction will use the current sequence number of the given `Account` object as its sequence number and increment the given account's sequence number by one when `build()` is called.

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

## Creating a transaction

In the example below we're sending 20 XLM from `GABJLI6IVBKJ7HIC5NN7HHDCIEW3CMWQ2DWYHREQQUFWSWZ2CDAMZZX4` to `GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`. Current sequence number of the sender account in the ledger is `46316927324160`-`1`=`46316927324159`.

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

## Creating a multi-signature account

Multi-signature accounts can be used to require that certain operations require multiple keypairs sign it before it's valid. This is done by first configuration your accounts "threshold" levels. Each operation has a threshold level of low, medium, or high. You give each threshold level a number between 1-255 in your account. Then, for each key in your account, you assign it a weight (1-255, setting a 0 weight deletes the key). Each operation your account is the source account to needs to be signed with enough keys to meet the threshold.

For example, lets say you set your threshold levels low = 1, medium = 2, high = 3. You want to send a payment operation, which has threshold level 2. Your master key has weight 1 (the master key weight is assigned when setting the threshold levels for your account). Additionally, you have a secondary key associated with your account which has threshold level 1. Now, the transaction you submit for this payment must include both signatures of your master key and secondary key.

In this example, we will:

* Add a second signer to the account
* Set our account's masterkey weight and threshold levels
* Create a multi signature transaction that sends a payment

In each example, we'll use the root account.

### Add a secondary key to the account

```js
var rootKeypair = Keypair.fromSeed("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X")
var account = new Account(rootKeypair.address(), 46316927324160);
var secondaryAddress = "GC6HHHS7SH7KNUAOBKVGT2QZIQLRB5UA7QAGLA3IROWPH4TN65UKNJPK";
var transaction = new TransactionBuilder(account)
  .addOperation(Operation.setOptions({
    signer: {
      address: secondaryAddress,
      weight: 1
    }
  }))
  .addSigner(rootKeypair)
  .build();
```

### Set Master key weight and threshold weights

```js
var rootKeypair = Keypair.fromSeed("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X");
var account = new Account(rootKeypair.address(), 46316927324160);
var transaction = new TransactionBuilder(account)
  .addOperation(Operation.setOptions({
    thresholds: {
      weight: 1, // master key weight
      low: 1,
      medium: 2, // a payment is medium threshold
      high: 2 // make sure to have enough weight to add up to the high threshold!
    }
  }))
  .addSigner(rootKeypair)
  .build();
```

### Create a multi-sig payment transaction

```js
var rootKeypair   = Keypair.fromSeed("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X");
var secondKeypair = Keypair.fromSeed("SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7");
var account = new Account(rootKeypair.address(), 46316927324160);
var transaction = new TransactionBuilder(account)
    .addOperation(Operation.payment({
        destination: "GBTVUCDT5CNSXIHJTDHYSZG3YJFXBAJ6FM4CKS5GKSAWJOLZW6XX7NVC",
        currency: Asset.native(),
        amount: "20000000"
    }))
    .build();
// now we need to sign the transaction with the source (root) account
transaction.sign(rootKeypair);
transaction.sign(secondKeypair);
```
