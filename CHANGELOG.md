# Changelog

As this project is pre 1.0, breaking changes may happen for minor version bumps.
A breaking change will get clearly notified in this log.

## [v0.13.1](https://github.com/stellar/js-stellar-base/compare/v0.13.0...v0.13.1)

- Travis: Deploy NPM with an environment variable instead of an encrypted API key.
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
