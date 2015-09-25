---
title: Base Examples
---


## Creating a transaction

In the example below we're sending 20 XLM from `GABJLI6IVBKJ7HIC5NN7HHDCIEW3CMWQ2DWYHREQQUFWSWZ2CDAMZZX4` to
`GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB`. Current sequence number of the sender account in the ledger is `46316927324160`-`1`=`46316927324159`.

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

Multi-signature accounts can be used to require that certain operations require multiple keypairs sign it before it's valid.
This is done by first configuration your accounts "threshold" levels. Each operation has a threshold level of low, medium,
or high. You give each threshold level a number between 1-255 in your account. Then, for each key in your account, you
assign it a weight (1-255, setting a 0 weight deletes the key). Each operation your account is the source account to needs to be signed with enough keys to meet the threshold.

For example, lets say you set your threshold levels low = 1, medium = 2, high = 3. You want to send a payment operation,
which has threshold level 2. Your master key has weight 1 (the master key weight is assigned when setting the threshold
levels for your account). Additionally, you have a secondary key associated with your account which has threshold level 1.
Now, the transaction you submit for this payment must include both signatures of your master key and secondary key.

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

## Asset example
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
