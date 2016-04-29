# Changelog

As this project is pre 1.0, breaking changes may happen for minor version bumps. A breaking change will get clearly notified in this log.

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
