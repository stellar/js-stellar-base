# Changelog

As this project is pre 1.0, breaking changes may happen for minor version bumps. A breaking change will get clearly notified in this log.

## 0.7.7

* Updated docs.

## 0.7.6

* Updated docs.

## 0.7.5

* `Keypair.constructor` now requires `type` field to define public-key signature system used in this instance (so `Keypair` can support other systems in a future). It also checks if public key and secret key match if both are passed (to prevent nasty bugs).
* `Keypair.fromRawSeed` has been renamed to `Keypair.fromRawEd25519Seed` to make it clear that the seed must be Ed25519 seed.
* It's now possible to instantiate `Memo` class so it's easier to check it's type and value (without dealing with low level `xdr.Memo` objects).
* Changed `Asset.toXdrObject` to `Asset.toXDRObject` and `Operation.operationToObject` to `Operation.toXDRObject` for consistency.
* Time bounds support for numeric input values.
* Added `browser` prop to package.json.

## 0.7.4

* Update dependencies.
* Remove unused methods.

## 0.7.3

* Allow hex string in setOptions signers

## 0.7.2

* Updated XDR files

## 0.7.1

* Checking hash preimage length

## 0.7.0

* Support for new signer types: `sha256Hash`, `preAuthTx`.
* `StrKey` helper class with `strkey` encoding related methods.
* Removed deprecated methods: `Keypair.isValidPublicKey` (use `StrKey`), `Keypair.isValidSecretKey` (use `StrKey`), `Keypair.fromSeed`, `Keypair.seed`, `Keypair.rawSeed`.
* **Breaking changes**:
  * `Network` must be explicitly selected. Previously testnet was a default network.
  * `Operation.setOptions()` method `signer` param changed.
  * `Keypair.fromAccountId()` renamed to `Keypair.fromPublicKey()`.
  * `Keypair.accountId()` renamed to `Keypair.publicKey()`.
  * Dropping support for `End-of-Life` node versions.

## 0.6.0

* **Breaking change** `ed25519` package is now optional dependency.
* Export account flags constants.

## 0.5.7

* Fixes XDR decoding issue when using firefox

## 0.5.6

* UTF-8 support in `Memo.text()`.

## 0.5.5

* Make 0 a valid number for transaction fee,
* Fix signer in Operation.operationToObject() - close #82

## 0.5.4

* Fixed Lodash registering itself to global scope. 

## 0.5.3

* Add support for ManageData operation.

## 0.5.2

* Moved `Account.isValidAccountId` to `Keypair.isValidPublicKey`. It's still possible to use `Account.isValidAccountId` but it will be removed in the next minor release (breaking change). (af10f2a)
* `signer.address` option in `Operation.setOptions` was changed to `signer.pubKey`. It's still possible to use `signer.address` but it will be removed in the next minor release (breaking change). (07f43fb)
* `Operation.setOptions` now accepts strings for `clearFlags`, `setFlags`, `masterWeight`, `lowThreshold`, `medThreshold`, `highThreshold`, `signer.weight` options. (665e018)
* Fixed TransactionBuilder timebounds option. (854f275)
* Added `CHANGELOG.md` file.

## 0.5.1

* Now it's possible to pass `price` params as `{n: numerator, d: denominator}` object. Thanks @FredericHeem. (#73)

## 0.5.0

* **Breaking change** `sequence` in `Account` constructor must be a string. (4da5dfc)
* **Breaking change** Removed deprecated methods (180a5b8):
  * `Account.isValidAddress` (replaced by `Account.isValidAccountId`)
  * `Account.getSequenceNumber` (replaced by `Account.sequenceNumber`)
  * `Keypair.address` (replaced by `Keypair.accountId`)
  * `Network.usePublicNet` (replaced by `Network.usePublicNetwork`)
  * `Network.useTestNet` (replaced by `Network.useTestNetwork`)
  * `TransactionBuilder.addSigner` (call `Transaction.sign` on build `Transaction` object)
