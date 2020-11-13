# Changelog

## Unreleased

## [v4.0.3](https://github.com/stellar/js-stellar-base/compare/v4.0.2..v4.0.3)

## Update

- Update TS definitions for XDRs ([#381](https://github.com/stellar/js-stellar-base/pull/381))
- Fix typing for ManageData.value ([#379](https://github.com/stellar/js-stellar-base/pull/379))


## [v4.0.2](https://github.com/stellar/js-stellar-base/compare/v4.0.1..v4.0.2)

## Update

- Fix deployment script.


## [v4.0.1](https://github.com/stellar/js-stellar-base/compare/v4.0.0..v4.0.1)

## Update

- Update `createAccount` operation to accept `0` as the starting balance ([#375](https://github.com/stellar/js-stellar-base/pull/375)).

## [v4.0.0](https://github.com/stellar/js-stellar-base/compare/v3.0.4..v4.0.0)

## Add
- Add the `Claimant` class which helps the creation of claimable balances. ([#367](https://github.com/stellar/js-stellar-base/pull/367)).
The default behavior of this class it to create claimants with an unconditional predicate if none is passed:

```
const claimant = new StellarBase.Claimant(
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
);
```

However, you can use any of the following helpers to create a predicate:

```
StellarBase.Claimant.predicateUnconditional();
StellarBase.Claimant.predicateAnd(left, right);
StellarBase.Claimant.predicateOr(left, right);
StellarBase.Claimant.predicateNot(predicate);
StellarBase.Claimant.predicateBeforeAbsoluteTime(unixEpoch);
StellarBase.Claimant.predicateBeforeRelativeTime(seconds);
```

And then pass the predicate in the constructor:

```
const left = StellarBase.Claimant.predicateBeforeRelativeTime('800');
const right = StellarBase.Claimant.predicateBeforeRelativeTime(
  '1200'
);
const predicate = StellarBase.Claimant.predicateOr(left, right);
const claimant = new StellarBase.Claimant(
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
  predicate
);
```

- Add `Operation.createClaimableBalance` ([#368](https://github.com/stellar/js-stellar-base/pull/368))
Extend the operation class with a new helper to create claimable balance operations.

```js
const asset = new Asset(
  'USD',
  'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
);
const amount = '100.0000000';
const claimants = [
  new Claimant(
    'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
     Claimant.predicateBeforeAbsoluteTime("4102444800000")
  )
];

const op = Operation.createClaimableBalance({
  asset,
  amount,
  claimants
});
```

- Add `Operation.claimClaimableBalance` ([#368](https://github.com/stellar/js-stellar-base/pull/368))
Extend the operation class with a new helper to create claim claimable balance operations. It receives the `balanceId` as exposed by Horizon in the `/claimable_balances` end-point.

```js
const op = Operation.createClaimableBalance({
  balanceId: '00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be',
});
```
- Add support for Sponsored Reserves (CAP33)([#369](https://github.com/stellar/js-stellar-base/pull/369/))

Extend the operation class with helpers that allow sponsoring reserves and also revoke sponsorships.

To start sponsoring reserves for an account use:
- `Operation.beginSponsoringFutureReserves`
- `Operation.endSponsoringFutureReserves`

To revoke a sponsorship after it has been created use any of the following helpers:

- `Operation.revokeAccountSponsorship`
- `Operation.revokeTrustlineSponsorship`
- `Operation.revokeOfferSponsorship`
- `Operation.revokeDataSponsorship`
- `Operation.revokeClaimableBalanceSponsorship`
- `Operation.revokeSignerSponsorship`

The following example contains a transaction which sponsors operations for an account and then revoke some sponsorships.

```
const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: StellarSdk.Networks.TESTNET
})
  .addOperation(
    StellarSdk.Operation.beginSponsoringFutureReserves({
      sponsoredId: account.accountId(),
      source: masterKey.publicKey()
    })
  )
  .addOperation(
    StellarSdk.Operation.accountMerge({ destination: destKey.publicKey() }),
  ).addOperation(
    StellarSdk.Operation.createClaimableBalance({
      amount: "10",
      asset: StellarSdk.Asset.native(),
      claimants: [
        new StellarSdk.Claimant(account.accountId())
      ]
    }),
  ).addOperation(
    StellarSdk.Operation.claimClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    }),
  ).addOperation(
    StellarSdk.Operation.endSponsoringFutureReserves({
    })
  ).addOperation(
    StellarSdk.Operation.revokeAccountSponsorship({
      account: account.accountId(),
    })
  ).addOperation(
      StellarSdk.Operation.revokeTrustlineSponsorship({
        account: account.accountId(),
        asset: usd,
      })
  ).addOperation(
    StellarSdk.Operation.revokeOfferSponsorship({
      seller: account.accountId(),
      offerId: '12345'
    })
  ).addOperation(
    StellarSdk.Operation.revokeDataSponsorship({
      account: account.accountId(),
      name: 'foo'
    })
  ).addOperation(
    StellarSdk.Operation.revokeClaimableBalanceSponsorship({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    StellarSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        ed25519PublicKey: sourceKey.publicKey()
      }
    })
  ).addOperation(
    StellarSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        sha256Hash: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).addOperation(
    StellarSdk.Operation.revokeSignerSponsorship({
      account: account.accountId(),
      signer: {
        preAuthTx: "da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be"
      }
    })
  ).build();
```

### Breaking

- The XDR generated in this code includes breaking changes on the internal XDR library since a bug was fixed which was causing incorrect code to be generated (see https://github.com/stellar/xdrgen/pull/52).

The following functions were renamed:

- `xdr.OperationBody.setOption()` -> `xdr.OperationBody.setOptions()`
- `xdr.OperationBody.manageDatum()` -> `xdr.OperationBody.manageData()`
- `xdr.OperationType.setOption()` -> `xdr.OperationType.setOptions()`
- `xdr.OperationType.manageDatum()` -> `xdr.OperationType.manageData()`

The following enum values were rename in `OperationType`:

- `setOption` -> `setOptions`
- `manageDatum` -> `manageData`

## [v3.0.4](https://github.com/stellar/js-stellar-base/compare/v3.0.3..v3.0.4)

### Update

- Generate V1 transactions by default and allow V0 transactions to be fee bumped ([#355](https://github.com/stellar/js-stellar-base/pull/355)).

## [v3.0.3](https://github.com/stellar/js-stellar-base/compare/v3.0.2..v3.0.3)

### Remove

- Rollback support for SEP23 (Muxed Account StrKey) ([#349](https://github.com/stellar/js-stellar-base/pull/349)).

## [v3.0.2](https://github.com/stellar/js-stellar-base/compare/v3.0.1..v3.0.2)

### Fix
- Extend `files` in npm package to include XDR type definitions ([#345](https://github.com/stellar/js-stellar-base/pull/345)).

## [v3.0.1](https://github.com/stellar/js-stellar-base/compare/v3.0.0..v3.0.1)

### Add
- Add TypeScript definitions for auto-generated XDR code ([#342](https://github.com/stellar/js-stellar-base/pull/342)).

## [v3.0.0](https://github.com/stellar/js-stellar-base/compare/v2.1.9..v3.0.0)

This version brings protocol 13 support with backwards compatibility support for protocol 12.

### Add
- Add `TransactionBuilder.buildFeeBumpTransaction` which makes it easy to create `FeeBumpTransaction` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- Adds a feature flag which allow consumers of this library to create V1 (protocol 13) transactions using the `TransactionBuilder` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- Add support for [CAP0027](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md): First-class multiplexed accounts ([#325](https://github.com/stellar/js-stellar-base/pull/325)).
- ~Add `Keypair.xdrMuxedAccount` which creates a new `xdr.MuxedAccount`([#325](https://github.com/stellar/js-stellar-base/pull/325)).~
- Add `FeeBumpTransaction` which makes it easy to work with fee bump transactions ([#328](https://github.com/stellar/js-stellar-base/pull/328)).
- Add `TransactionBuilder.fromXDR` which receives an xdr envelope and return a `Transaction` or `FeeBumpTransaction` ([#328](https://github.com/stellar/js-stellar-base/pull/328)).

### Update
- Update XDR definitions with protocol 13 ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
- Extend `Transaction` to work with `TransactionV1Envelope` and `TransactionV0Envelope` ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
- Add backward compatibility support for [CAP0018](https://github.com/stellar/stellar-protocol/blob/f01c9354aaab1e8ca97a25cf888829749cadf36a/core/cap-0018.md) ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
  CAP0018 provides issuers with a new level of authorization between unauthorized and fully authorized, called "authorized to maintain liabilities". The changes in this release allow you to use the new authorization level and provides backward compatible support for Protocol 12.

  Before Protocol 13, the argument `authorize` in the `AllowTrust` operation was of type `boolean` where `true` was authorize and `false` deauthorize. Starting in Protocol 13, this value is now a `number` where `0` is deauthorize, `1` is authorize, and `2` is authorize to maintain liabilities.

  The syntax for authorizing a trustline is still the same, but the authorize parameter is now a `number`.

    ```js
    Operation.allowTrust({
      trustor: trustor.publicKey(),
      assetCode: "COP",
      authorize: 1
    });
    ```

  You can use still use a `boolean`; however, we recommend you update your code to pass a `number` instead. Finally,  using the value `2` for authorize to maintain liabilities will only be valid if Stellar Core is running on Protocol 13; otherwise, you'll get an error.

- ~Update operations builder to support multiplexed accounts ([#337](https://github.com/stellar/js-stellar-base/pull/337)).~

### Breaking changes

- `Transaction.toEnvelope()` returns a protocol 13 `xdr.TransactionEnvelope` which is an `xdr.Union` ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
  If you have code that looks like this - `transaction.toEnvelope().tx` - you have two options:
    - You can grab the value wrapped by the union, calling `value()` like `transaction.toEnvelope().value().tx`.
    - You can check which is the discriminant by using `switch()` and then call `v0()`, `v1()`, or `feeBump()`.
- The return value from `Transaction.fee` changed from `number` to `string`. This brings support for `Int64` values ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The const `BASE_FEE` changed from `number` to `string` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The option `fee` passed to  `new TransactionBuilder({fee: ..})` changed from `number` to `string` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The following fields, which were previously an `xdr.AccountID` are now a  `xdr.MuxedAccount` ([#325](https://github.com/stellar/js-stellar-base/pull/325)):
  - `PaymentOp.destination`
  - `PathPaymentStrictReceiveOp.destination`
  - `PathPaymentStrictSendOp.destination`
  - `Operation.sourceAccount`
  - `Operation.destination` (for `ACCOUNT_MERGE`)
  - `Transaction.sourceAccount`
  - `FeeBumpTransaction.feeSource`

  You can get the string representation by calling `StrKey.encodeMuxedAccount` which will return a `G..` or `M..` account.
- Remove the following deprecated functions ([#331](https://github.com/stellar/js-stellar-base/pull/331)):
  - `Operation.manageOffer`
  - `Operation.createPassiveOffer`
  - `Operation.pathPayment`
  - `Keypair.fromBase58Seed`
- Remove the `Network` class ([#331](https://github.com/stellar/js-stellar-base/pull/331)).
- Remove `vendor/base58.js` ([#331](https://github.com/stellar/js-stellar-base/pull/331)).

## [v3.0.0-alpha.1](https://github.com/stellar/js-stellar-base/compare/v3.0.0-alpha.0..v3.0.0-alpha.1)

### Update

- Update operations builder to support multiplexed accounts ([#337](https://github.com/stellar/js-stellar-base/pull/337)).

  This allows you to specify an `M` account as the destination or source:
  ```
  var destination = 'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL6';
  var amount = '1000.0000000';
  var asset = new StellarBase.Asset(
    'USDUSD',
    'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
  );
  var source =
    'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL6';
  StellarBase.Operation.payment({
    destination,
    asset,
    amount,
    source
  });
  ```

  **To use multiplexed accounts you need an instance of Stellar running on Protocol 13 or higher**

## [v3.0.0-alpha.0](https://github.com/stellar/js-stellar-base/compare/v2.1.9..v3.0.0-alpha.0)

This version brings protocol 13 support with backwards compatibility support for protocol 12.

### Add
- Add `TransactionBuilder.buildFeeBumpTransaction` which makes it easy to create `FeeBumpTransaction` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- Adds a feature flag which allow consumers of this library to create V1 (protocol 13) transactions using the `TransactionBuilder` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- Add support for [CAP0027](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md): First-class multiplexed accounts ([#325](https://github.com/stellar/js-stellar-base/pull/325)).
- Add `Keypair.xdrMuxedAccount` which creates a new `xdr.MuxedAccount`([#325](https://github.com/stellar/js-stellar-base/pull/325)).
- Add `FeeBumpTransaction` which makes it easy to work with fee bump transactions ([#328](https://github.com/stellar/js-stellar-base/pull/328)).
- Add `TransactionBuilder.fromXDR` which receives an xdr envelope and return a `Transaction` or `FeeBumpTransaction` ([#328](https://github.com/stellar/js-stellar-base/pull/328)).

### Update
- Update XDR definitions with protocol 13 ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
- Extend `Transaction` to work with `TransactionV1Envelope` and `TransactionV0Envelope` ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
- Add backward compatibility support for [CAP0018](https://github.com/stellar/stellar-protocol/blob/f01c9354aaab1e8ca97a25cf888829749cadf36a/core/cap-0018.md) ([#317](https://github.com/stellar/js-stellar-base/pull/317)).

### Breaking changes

- `Transaction.toEnvelope()` returns a protocol 13 `xdr.TransactionEnvelope` which is an `xdr.Union` ([#317](https://github.com/stellar/js-stellar-base/pull/317)).
  If you have code that looks like this `transaction.toEnvelope().tx` you have two options:
    - You can grab the value wrapped by the union, calling `value()` like `transaction.toEnvelope().value().tx`.
    - You can check which is the discriminant by using `switch()` and then call `v0()`, `v1()`, or `feeBump()`.
- The return value from `Transaction.fee` changed from `number` to `string`. This brings support for `Int64` values ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The const `BASE_FEE` changed from `number` to `string` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The option `fee` passed to  `new TransactionBuilder({fee: ..})` changed from `number` to `string` ([#321](https://github.com/stellar/js-stellar-base/pull/321)).
- The following fields, which were previously an `xdr.AccountID` are now a  `xdr.MuxedAccount` ([#325](https://github.com/stellar/js-stellar-base/pull/325)):
  - `PaymentOp.destination`
  - `PathPaymentStrictReceiveOp.destination`
  - `PathPaymentStrictSendOp.destination`
  - `Operation.sourceAccount`
  - `Operation.destination` (for `ACCOUNT_MERGE`)
  - `Transaction.sourceAccount`
  - `FeeBumpTransaction.feeSource`

  You can get the string representation by calling `StrKey.encodeMuxedAccount` which will return a `G..` or `M..` account.
- Remove the following deprecated functions ([#331](https://github.com/stellar/js-stellar-base/pull/331)):
  - `Operation.manageOffer`
  - `Operation.createPassiveOffer`
  - `Operation.pathPayment`
  - `Keypair.fromBase58Seed`
- Remove the `Network` class ([#331](https://github.com/stellar/js-stellar-base/pull/331)).
- Remove `vendor/base58.js` ([#331](https://github.com/stellar/js-stellar-base/pull/331)).


## [v2.1.9](https://github.com/stellar/js-stellar-base/compare/v2.1.8..v2.1.9)

### Fix
- Update dependencies which depend on minimist. ([#332](https://github.com/stellar/js-stellar-base/pull/332))

## [v2.1.8](https://github.com/stellar/js-stellar-base/compare/v2.1.7..v2.1.8)

### Fix
- Fix `setTimeout(0)` and partially defined timebounds ([#315](https://github.com/stellar/js-stellar-base/pull/315)).

## [v2.1.7](https://github.com/stellar/js-stellar-base/compare/v2.1.6..v2.1.7)

### Fix
- Fix TypeScript options for `ManageData` operation to allow setting value to `null` ([#310](https://github.com/stellar/js-stellar-base/issues/310))
- Fix crash on partially defined time bounds ([#303](https://github.com/stellar/js-stellar-base/issues/303))

## [v2.1.6](https://github.com/stellar/js-stellar-base/compare/v2.1.5..v2.1.6)

### Fix
- Fix npm deployment.

## [v2.1.5](https://github.com/stellar/js-stellar-base/compare/v2.1.4..v2.1.5)

### Add
- Add `toXDR` type to Transaction class ([#296](https://github.com/stellar/js-stellar-base/issues/296))

### Fix
- Fix doc link ([#298](https://github.com/stellar/js-stellar-base/issues/298))

### Remove
- Remove node engine restriction ([#294](https://github.com/stellar/js-stellar-base/issues/294))

### Update
- Update creating an account example ([#299](https://github.com/stellar/js-stellar-base/issues/299))
- Use `console.trace` to get line num in `Networks.use` ([#300](https://github.com/stellar/js-stellar-base/issues/300))

## [v2.1.4](https://github.com/stellar/js-stellar-base/compare/v2.1.3..v2.1.4)

## Update
- Regenerate the XDR definitions to include MetaV2 ([#288](https://github.com/stellar/js-stellar-base/issues/288))

## [v2.1.3](https://github.com/stellar/js-stellar-base/compare/v2.1.2...v2.1.3)

## Update 📣

- Throw errors when obviously invalid network passphrases are used in
  `new Transaction()`.
  ([284](https://github.com/stellar/js-stellar-base/pull/284))

## [v2.1.2](https://github.com/stellar/js-stellar-base/compare/v2.1.1...v2.1.2)

## Update 📣

- Update documentation for `Operation` to show `pathPaymentStrictSend` and `pathPaymentStrictReceive`. ([279](https://github.com/stellar/js-stellar-base/pull/279))

## [v2.1.1](https://github.com/stellar/js-stellar-base/compare/v2.1.0...v2.1.1)

## Update 📣

- Update `asset.toString()` to return canonical representation for asset. ([277](https://github.com/stellar/js-stellar-base/pull/277)).

  Calling `asset.toString()` will return `native` for `XLM` or `AssetCode:AssetIssuer` for issued assets. See [this PR](https://github.com/stellar/stellar-protocol/pull/313) for more information.

## [v2.1.0](https://github.com/stellar/js-stellar-base/compare/v2.0.2...v2.1.0)

This release adds support for [stellar-core protocol 12 release](https://github.com/stellar/stellar-core/projects/11) and [CAP 24](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0024.md) ("Make PathPayment Symmetrical").

### Add ➕

 - `Operation.pathPaymentStrictSend`: Sends a path payments, debiting from the source account exactly a specified amount of one asset, crediting at least a given amount of another asset. ([#274](https://github.com/stellar/js-stellar-base/pull/274)).

    The following operation will debit exactly 10 USD from the source account, crediting at least 9.2 EUR in the destination account 💸:
    ```js
    var sendAsset = new StellarBase.Asset(
      'USD',
      'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
    );
    var sendAmount = '10';
    var destination =
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
    var destAsset = new StellarBase.Asset(
      'USD',
      'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
    );
    var destMin = '9.2';
    var path = [
      new StellarBase.Asset(
        'USD',
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB'
      ),
      new StellarBase.Asset(
        'EUR',
        'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL'
      )
    ];
    let op = StellarBase.Operation.pathPaymentStrictSend({
      sendAsset,
      sendAmount,
      destination,
      destAsset,
      destMin,
      path
    });
    ```
 - `Operation.pathPaymentStrictReceive`: This behaves the same as the former `pathPayments` operation. ([#274](https://github.com/stellar/js-stellar-base/pull/274)).

   The following operation will debit maximum 10 USD from the source account, crediting exactly 9.2 EUR in the destination account  💸:
   ```js
   var sendAsset = new StellarBase.Asset(
     'USD',
     'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
   );
   var sendMax = '10';
   var destination =
     'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
   var destAsset = new StellarBase.Asset(
     'USD',
     'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'
   );
   var destAmount = '9.2';
   var path = [
     new StellarBase.Asset(
       'USD',
       'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB'
     ),
     new StellarBase.Asset(
       'EUR',
       'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL'
     )
   ];
   let op = StellarBase.Operation.pathPaymentStrictReceive({
     sendAsset,
     sendMax,
     destination,
     destAsset,
     destAmount,
     path
   });
   ```

## Deprecated ❗️

- `Operation.pathPayment` is being deprecated in favor of `Operation.pathPaymentStrictReceive`. Both functions take the same arguments and behave the same. ([#274](https://github.com/stellar/js-stellar-base/pull/274)).

## [v2.0.2](https://github.com/stellar/js-stellar-base/compare/v2.0.1...v2.0.2)

### Fix
- Fix issue [#269](https://github.com/stellar/js-stellar-base/issues/269). ManageBuyOffer should extend BaseOptions and inherited property "source". ([#270](https://github.com/stellar/js-stellar-base/pull/270)).

## [v2.0.1](https://github.com/stellar/js-stellar-base/compare/v2.0.0...v2.0.1)

No changes. Fixes deploy script and includes changes from [v2.0.0](https://github.com/stellar/js-stellar-base/compare/v1.1.2...v2.0.0).

## [v2.0.0](https://github.com/stellar/js-stellar-base/compare/v1.1.2...v2.0.0)

### BREAKING CHANGES

- Drop Support for Node 6 since it has been end-of-lifed and no longer in LTS. We now require Node 10 which is the current LTS until April 1st, 2021. ([#255](https://github.com/stellar/js-stellar-base/pull/255))

## [v1.1.2](https://github.com/stellar/js-stellar-base/compare/v1.1.1...v1.1.2)

### Fix
- Fix no-network warnings ([#248](https://github.com/stellar/js-stellar-base/issues/248))

## [v1.1.1](https://github.com/stellar/js-stellar-base/compare/v1.1.0...v1.1.1)

### Fix
- Add types for new networkPassphrase argument. Fix [#237](https://github.com/stellar/js-stellar-base/issues/237). ([#238](https://github.com/stellar/js-stellar-base/issues/238))

## [v1.1.0](https://github.com/stellar/js-stellar-base/compare/v1.0.3...v1.1.0)

### Deprecated

Deprecate global singleton for `Network`. The following classes and
methods take an optional network passphrase, and issue a warning if it
is not passed:

#### `Keypair.master`

```js
Keypair.master(Networks.TESTNET)
```

#### constructor for `Transaction`

```js
const xenv = new xdr.TransactionEnvelope({ tx: xtx });
new Transaction(xenv, Networks.TESTNET);
```

#### constructor for  `TransactionBuilder` and method `TransactionBuilder.setNetworkPassphrase`

```js
const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: StellarSdk.BASE_FEE,
  networkPassphrase: Networks.TESTNET
})
```

See [#207](https://github.com/stellar/js-stellar-base/issues/207) and [#112](https://github.com/stellar/js-stellar-base/issues/112) for more information.

The `Network` class will be removed on the `2.0` release.

### Add
- Add docs for BASE_FEE const. ([#211](https://github.com/stellar/js-stellar-base/issues/211))

### Fix
- Fix typo. ([#213](https://github.com/stellar/js-stellar-base/issues/213))

## [v1.0.3](https://github.com/stellar/js-stellar-base/compare/v1.0.2...v1.0.3)

### Add

- Add `toString()` to Asset ([#172](https://github.com/stellar/js-stellar-base/issues/172))
- Add types for missing Network functions ([#208](https://github.com/stellar/js-stellar-base/issues/208))
- Add BASE_FEE to TS types ([#209](https://github.com/stellar/js-stellar-base/issues/209))

### Fix
- Fix typo in types ([#194](https://github.com/stellar/js-stellar-base/issues/194))
- Fix types: Fee is no longer optional ([#195](https://github.com/stellar/js-stellar-base/issues/195))
- Fix typings for Account Sequence Number ([#203](https://github.com/stellar/js-stellar-base/issues/203))
- Fix typings for Transaction Sequence Number ([#205](https://github.com/stellar/js-stellar-base/issues/205))

## [v1.0.2](https://github.com/stellar/js-stellar-base/compare/v1.0.1...v1.0.2)

- Fix a bug where `sodium-native` was making it into the browser bundle, which
  is supposed to use `tweetnacl`.

## [v1.0.1](https://github.com/stellar/js-stellar-base/compare/v1.0.0...v1.0.1)

- Restore `Operation.manageOffer` and `Operation.createPassiveOffer`, and issue
  a warning if they're called.
- Add type definitions for the timeBounds property of transactions.

## [v1.0.0](https://github.com/stellar/js-stellar-base/compare/v0.13.2...v1.0.0)

- **Breaking change** Stellar Protocol 11 compatibility
  - Rename `Operation.manageOffer` to `Operation.manageSellOffer`.
  - Rename `Operation.createPassiveOffer` to `Operation.createPassiveSellOffer`.
  - Add `Operation.manageBuyOffer`.
- **Breaking change** The `fee` parameter to `TransactionBuilder` is now
  required. Failing to provide a fee will throw an error.

## [v0.13.2](https://github.com/stellar/js-stellar-base/compare/v0.13.1...v0.13.2)

- Bring DefinitelyTyped definitions into the repo for faster updating.
- Add missing Typescript type definitions.
- Add code to verify signatures when added to transactions.
- Replace ed25519 with sodium-native.
- Fix the xdr for SCP_MESSAGE.
- Update the README for the latest info.

## [v0.13.1](https://github.com/stellar/js-stellar-base/compare/v0.13.0...v0.13.1)

- Travis: Deploy NPM with an environment variable instead of an encrypted API
  key.
- Instruct Travis to cache node_modules

## [v0.13.0](https://github.com/stellar/js-stellar-base/compare/v0.12.0...v0.13.0)

- Remove the `crypto` library. This reduces the number of Node built-ins we have
  to shim into the production bundle, and incidentally fixes a bug with
  Angular 6.

## [v0.12.0](https://github.com/stellar/js-stellar-base/compare/v0.11.0...v0.12.0)

- _Warning_ Calling TransactionBuilder without a `fee` param is now deprecated
  and will issue a warning. In a later release, it will throw an error. Please
  update your transaction builders as soon as you can!
- Add a `toXDR` function for transactions that lets you get the transaction as a
  base64-encoded string (so you may enter it into the Stellar Laboratory XDR
  viewer, for one)
- Fix TransactionBuilder example syntax errors
- Use more thorough "create account" documentation
- Add `Date` support for `TransactionBuilder` `timebounds`
- Add two functions to `Transaction` that support pre-generated transactions:
  - `getKeypairSignature` helps users sign pre-generated transaction XDRs
  - `addSignature` lets you add pre-generated signatures to a built transaction

## 0.11.0

- Added ESLint and Prettier to enforce code style
- Upgraded dependencies, including Babel to 6
- Bump local node version to 6.14.0
- Change Operations.\_fromXDRAmount to not use scientific notation (1e-7) for
  small amounts like 0.0000001.

## 0.10.0

- **Breaking change** Added
  [`TransactionBuilder.setTimeout`](https://stellar.github.io/js-stellar-base/TransactionBuilder.html#setTimeout)
  method that sets `timebounds.max_time` on a transaction. Because of the
  distributed nature of the Stellar network it is possible that the status of
  your transaction will be determined after a long time if the network is highly
  congested. If you want to be sure to receive the status of the transaction
  within a given period you should set the TimeBounds with `maxTime` on the
  transaction (this is what `setTimeout` does internally; if there's `minTime`
  set but no `maxTime` it will be added). Call to
  `TransactionBuilder.setTimeout` is required if Transaction does not have
  `max_time` set. If you don't want to set timeout, use `TimeoutInfinite`. In
  general you should set `TimeoutInfinite` only in smart contracts. Please check
  [`TransactionBuilder.setTimeout`](https://stellar.github.io/js-stellar-base/TransactionBuilder.html#setTimeout)
  docs for more information.
- Fixed decoding empty `homeDomain`.

## 0.9.0

- Update `js-xdr` to support unmarshaling non-utf8 strings.
- String fields returned by `Operation.fromXDRObject()` are of type `Buffer` now
  (except `SetOptions.home_domain` and `ManageData.name` - both required to be
  ASCII by stellar-core).

## 0.8.3

- Update `xdr` files to V10.

## 0.8.2

- Upgrade `js-xdr`.

## 0.8.1

- Removed `src` from `.npmignore`.

## 0.8.0

- Added support for `bump_sequence` operation.
- Fixed many code style issues.
- Updated docs.

## 0.7.8

- Updated dependencies.

## 0.7.7

- Updated docs.

## 0.7.6

- Updated docs.

## 0.7.5

- `Keypair.constructor` now requires `type` field to define public-key signature
  system used in this instance (so `Keypair` can support other systems in a
  future). It also checks if public key and secret key match if both are passed
  (to prevent nasty bugs).
- `Keypair.fromRawSeed` has been renamed to `Keypair.fromRawEd25519Seed` to make
  it clear that the seed must be Ed25519 seed.
- It's now possible to instantiate `Memo` class so it's easier to check it's
  type and value (without dealing with low level `xdr.Memo` objects).
- Changed `Asset.toXdrObject` to `Asset.toXDRObject` and
  `Operation.operationToObject` to `Operation.toXDRObject` for consistency.
- Time bounds support for numeric input values.
- Added `browser` prop to package.json.

## 0.7.4

- Update dependencies.
- Remove unused methods.

## 0.7.3

- Allow hex string in setOptions signers

## 0.7.2

- Updated XDR files

## 0.7.1

- Checking hash preimage length

## 0.7.0

- Support for new signer types: `sha256Hash`, `preAuthTx`.
- `StrKey` helper class with `strkey` encoding related methods.
- Removed deprecated methods: `Keypair.isValidPublicKey` (use `StrKey`),
  `Keypair.isValidSecretKey` (use `StrKey`), `Keypair.fromSeed`, `Keypair.seed`,
  `Keypair.rawSeed`.
- **Breaking changes**:
  - `Network` must be explicitly selected. Previously testnet was a default
    network.
  - `Operation.setOptions()` method `signer` param changed.
  - `Keypair.fromAccountId()` renamed to `Keypair.fromPublicKey()`.
  - `Keypair.accountId()` renamed to `Keypair.publicKey()`.
  - Dropping support for `End-of-Life` node versions.

## 0.6.0

- **Breaking change** `ed25519` package is now optional dependency.
- Export account flags constants.

## 0.5.7

- Fixes XDR decoding issue when using firefox

## 0.5.6

- UTF-8 support in `Memo.text()`.

## 0.5.5

- Make 0 a valid number for transaction fee,
- Fix signer in Operation.operationToObject() - close #82

## 0.5.4

- Fixed Lodash registering itself to global scope.

## 0.5.3

- Add support for ManageData operation.

## 0.5.2

- Moved `Account.isValidAccountId` to `Keypair.isValidPublicKey`. It's still
  possible to use `Account.isValidAccountId` but it will be removed in the next
  minor release (breaking change). (af10f2a)
- `signer.address` option in `Operation.setOptions` was changed to
  `signer.pubKey`. It's still possible to use `signer.address` but it will be
  removed in the next minor release (breaking change). (07f43fb)
- `Operation.setOptions` now accepts strings for `clearFlags`, `setFlags`,
  `masterWeight`, `lowThreshold`, `medThreshold`, `highThreshold`,
  `signer.weight` options. (665e018)
- Fixed TransactionBuilder timebounds option. (854f275)
- Added `CHANGELOG.md` file.

## 0.5.1

- Now it's possible to pass `price` params as `{n: numerator, d: denominator}`
  object. Thanks @FredericHeem. (#73)

## 0.5.0

- **Breaking change** `sequence` in `Account` constructor must be a string.
  (4da5dfc)
- **Breaking change** Removed deprecated methods (180a5b8):
  - `Account.isValidAddress` (replaced by `Account.isValidAccountId`)
  - `Account.getSequenceNumber` (replaced by `Account.sequenceNumber`)
  - `Keypair.address` (replaced by `Keypair.accountId`)
  - `Network.usePublicNet` (replaced by `Network.usePublicNetwork`)
  - `Network.useTestNet` (replaced by `Network.useTestNetwork`)
  - `TransactionBuilder.addSigner` (call `Transaction.sign` on build
    `Transaction` object)
