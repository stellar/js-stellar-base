---
title: Transaction Examples
---

- [Creating an account](#creating-an-account)
- [Assets](#assets)
- [Path payment](#path-payment)
- [Multi-Signature account](#multi-signature-account)

## Creating an account

In the example below account `GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ` is creating account `GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW`.
The source account is giving the new account 25 XLM as its initial balance. Current sequence number of the source account in the ledger is `46316927324160`.


```javascript
StellarSdk.Network.useTestNetwork();
var secretString='secret key that corresponds to GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';

// create an Account object using locally tracked sequence number
var an_account = new StellarSdk.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", 46316927324160);

var transaction = new StellarSdk.TransactionBuilder(an_account)
    .addOperation(StellarSdk.Operation.createAccount({
      destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
      startingBalance: "25"  // in XLM
    }))
    .build();

transaction.sign(StellarSdk.Keypair.fromSecret(seedString)); // sign the transaction

// transaction is now ready to be sent to the network or saved somewhere

```

## Assets
Object of the `Asset` class represents an asset in the Stellar network. Right now there are 3 possible types of assets in the Stellar network:
* native `XLM` asset (`ASSET_TYPE_NATIVE`),
* issued assets with asset code of maximum 4 characters (`ASSET_TYPE_CREDIT_ALPHANUM4`),
* issued assets with asset code of maximum 12 characters (`ASSET_TYPE_CREDIT_ALPHANUM12`).

To create a new native asset representation use static `native()` method:
```js
var nativeAsset = Asset.native();
var isNative = nativeAsset.isNative(); // true
```

To represent an issued asset you need to create a new object of type `Asset` with an asset code and issuer:
```js
// Creates TEST asset issued by GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB
var testAsset = new Asset('TEST', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
var isNative = testAsset.isNative(); // false
// Creates Google stock asset issued by GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB
var googleStockAsset = new Asset('US38259P7069', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
```


## Path payment

In the example below we're sending 1000 XLM (at max) from `GABJLI6IVBKJ7HIC5NN7HHDCIEW3CMWQ2DWYHREQQUFWSWZ2CDAMZZX4` to
`GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`. Destination Asset will be `GBP` issued by
`GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW`. Assets will be exchanged using the following path:

* `USD` issued by `GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`,
* `EUR` issued by `GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL`.

The [path payment](https://www.stellar.org/developers/learn/concepts/list-of-operations.html#path-payment) will cause the destination address to get 5.5 GBP. It will cost the sender no more than 1000 XLM. In this example there will be 3 exchanges, XLM -> USD, USD-> EUR, EUR->GBP.

```js
StellarSdk.Network.useTestNetwork();
var keypair=StellarSdk.Keypair.fromSecret(secretString);

var source = new Account(keypair.accountId(), 46316927324160);
var transaction = new TransactionBuilder(source)
  .addOperation(Operation.pathPayment({
      sendAsset: Asset.native(),
      sendMax: "1000",
      destination: 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      destAsset: new Asset('GBP', 'GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW'),
      destAmount: "5.50",
      path: [
        new Asset('USD', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB'),
        new Asset('EUR', 'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL')
      ]
  }))
  .build();

transaction.sign(keypair);
```

## Multi-signature account

[Multi-signature accounts](https://www.stellar.org/developers/learn/concepts/multi-sig.html) can be used to require that transactions require multiple public keys to sign before they are considered valid.
This is done by first configuring your account's "threshold" levels. Each operation has a threshold level of either low, medium,
or high. You give each threshold level a number between 1-255 in your account. Then, for each key in your account, you
assign it a weight (1-255, setting a 0 weight deletes the key). Any transaction must be signed with enough keys to meet the threshold.

For example, let's say you set your threshold levels; low = 1, medium = 2, high = 3. You want to send a payment operation,
which is a medium threshold operation. Your master key has weight 1. Additionally, you have a secondary key associated with your account which has a weight of 1.
Now, the transaction you submit for this payment must include both signatures of your master key and secondary key since their combined weight is 2 which is enough to authorize the payment operation.

In this example, we will:

* Add a second signer to the account
* Set our account's masterkey weight and threshold levels
* Create a multi signature transaction that sends a payment

In each example, we'll use the root account.

### Set up multisig account


```js
StellarSdk.Network.useTestNetwork();
var rootKeypair = Keypair.fromSecret("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X")
var account = new Account(rootKeypair.accountId(), 46316927324160);

var secondaryAddress = "GC6HHHS7SH7KNUAOBKVGT2QZIQLRB5UA7QAGLA3IROWPH4TN65UKNJPK";

var transaction = new TransactionBuilder(account)
  .addOperation(Operation.setOptions({
    signer: {
      ed25519PublicKey: secondaryAddress,
      weight: 1
    }
  }))
  .addOperation(Operation.setOptions({
    masterWeight: 1, // set master key weight
    lowThreshold: 1,
    medThreshold: 2, // a payment is medium threshold
    highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
  }))
  .build();

transaction.sign(rootKeypair); // only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes

// now create a payment with the account that has two signers

var transaction = new TransactionBuilder(account)
    .addOperation(Operation.payment({
        destination: "GBTVUCDT5CNSXIHJTDHYSZG3YJFXBAJ6FM4CKS5GKSAWJOLZW6XX7NVC",
        asset: Asset.native(),
        amount: "2000" // 2000 XLM
    }))
    .build();

var secondKeypair = Keypair.fromSecret("SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7");

// now we need to sign the transaction with both the root and the secondaryAddress
transaction.sign(rootKeypair);
transaction.sign(secondKeypair);
```


