# Migrating from v14.x to v16 of `@stellar/stellar-base`

## Overview

v16 is a major release that corrects long-standing mismatches between TypeScript declarations and runtime behavior, tightens validation, removes deprecated APIs, and moves several numeric types to `bigint`. Most changes are type-level fixes that will surface at compile time, but a handful — default network change, stricter validation, removed exports — affect runtime behavior and require careful review.

## Prerequisites

- **Node >= 20** (unchanged from v14)
- TypeScript 5.x recommended (for `const` object type inference)
- Familiarize yourself with the `bigint` literal syntax (`60n`, `0n`, etc.)

## Breaking Changes

### 1. `minAccountSequenceAge` is now `bigint`

`Transaction.minAccountSequenceAge` and `TransactionBuilder.setMinAccountSequenceAge` now use native `bigint` instead of `number` / `xdr.UnsignedHyper`. The underlying XDR type (`Duration = Uint64`) can exceed `Number.MAX_SAFE_INTEGER`.

**Before:**

```ts
const builder = new TransactionBuilder(account, { fee: "100" });
builder.setMinAccountSequenceAge(60);
// tx.minAccountSequenceAge was number
```

**After:**

```ts
const builder = new TransactionBuilder(account, { fee: "100" });
builder.setMinAccountSequenceAge(60n);
// tx.minAccountSequenceAge is bigint
```

> **Note:** `0n` is no longer coerced to `null` — it is preserved, which may change whether `hasV2Preconditions()` returns `true` when explicitly set to `0n`.

---

### 2. `Transaction.extraSigners` is now `xdr.SignerKey[]`

The type was corrected from `string[]` to `xdr.SignerKey[]` to match runtime behavior.

**Before:**

```ts
const signers: string[] = tx.extraSigners;
```

**After:**

```ts
import { SignerKey } from "@stellar/stellar-base";

const signerKeys: xdr.SignerKey[] = tx.extraSigners;
// To get strings:
const signerStrings = signerKeys.map((k) => SignerKey.encodeSignerKey(k));
```

---

### 3. `Transaction` generic type parameters removed

`Transaction` no longer accepts `<TMemo, TOps>` generic parameters.

**Before:**

```ts
const tx: Transaction<Memo<MemoType.Text>> = buildTx();
```

**After:**

```ts
const tx: Transaction = buildTx();
// Access memo normally — cast if needed:
const textMemo = tx.memo as Memo<MemoType.Text>;
```

---

### 4. Default `networkPassphrase` changed for `authorizeEntry` / `authorizeInvocation`

The default changed from `Networks.FUTURENET` to `Networks.TESTNET`. Callers omitting this argument will **silently produce signatures for a different network**.

**Before:**

```ts
// Implicitly used FUTURENET
await authorizeEntry(entry, signer);
```

**After:**

```ts
// Explicitly pass your network to avoid surprises
await authorizeEntry(entry, signer, {
  networkPassphrase: Networks.FUTURENET, // or Networks.PUBLIC, etc.
});
```

> **Note:** This is a silent behavioral change. Always pass the `networkPassphrase` explicitly to avoid signing for the wrong network.

---

### 5. Internal `Operation` methods removed

`Operation.isValidAmount()`, `Operation.constructAmountRequirementsError()`, and `Operation.setSourceAccount()` have been removed from the public `Operation` class. They now exist only as internal standalone functions.

**Before:**

```js
// JavaScript-only (these were never in the TS declarations)
Operation.isValidAmount("100");
Operation.setSourceAccount(opts, attributes);
```

**After:**

```js
// These are no longer accessible. If you relied on them,
// copy the validation logic into your own codebase.
```

---

### 6. Revoke sponsorship operation `type` field split into specific strings

The single `"revokeSponsorship"` type has been split into 7 specific strings matching runtime behavior.

**Before:**

```ts
if (op.type === "revokeSponsorship") {
  // handle all revoke operations
}
```

**After:**

```ts
// The specific types are now:
// "revokeAccountSponsorship"
// "revokeTrustlineSponsorship"
// "revokeOfferSponsorship"
// "revokeDataSponsorship"
// "revokeClaimableBalanceSponsorship"
// "revokeLiquidityPoolSponsorship"
// "revokeSignerSponsorship"

if (op.type.startsWith("revoke") && op.type.endsWith("Sponsorship")) {
  // handle all revoke operations
}
// Or switch on specific types for targeted handling
```

> **Note:** `OperationType.RevokeSponsorship` is kept but deprecated.

---

### 7. Default export removed

The module no longer has a default export.

**Before:**

```ts
import StellarBase from "@stellar/stellar-base";
StellarBase.Keypair.random();
```

**After:**

```ts
import * as StellarBase from "@stellar/stellar-base";
StellarBase.Keypair.random();

// Or use named imports (preferred):
import { Keypair } from "@stellar/stellar-base";
Keypair.random();
```

---

### 8. `FastSigning` constant removed

The library now uses `@noble/curves/ed25519` exclusively.

**Before:**

```ts
import { FastSigning } from "@stellar/stellar-base";
if (FastSigning) {
  /* ... */
}
```

**After:**

```ts
// Remove all references to FastSigning — signing is always fast now.
```

---

### 9. `TransactionI` removed — use `TransactionBase`

**Before:**

```ts
function submit(tx: TransactionI) { /* ... */ }
```

**After:**

```ts
function submit(tx: TransactionBase) { /* ... */ }
```

---

### 10. `AssetType` and `AuthFlag` changed from TS namespaces to `const` objects

Runtime value usage still works, but type-position usage breaks.

**Before:**

```ts
let t: AssetType.native = AssetType.native; // type-position usage
```

**After:**

```ts
// Value usage — unchanged:
const t = AssetType.native;

// Type-position — use typeof or the string literal:
let t: typeof AssetType.native = AssetType.native;
// or
let t: "native" = AssetType.native;
```

---

### 11. `Asset.code` and `Asset.issuer` are now `readonly`

**Before:**

```ts
const asset = new Asset("USD", issuer);
asset.code = "EUR"; // mutation
```

**After:**

```ts
// Create a new Asset instance instead of mutating
const newAsset = new Asset("EUR", issuer);
```

---

### 12. `Asset.issuer` is now `string | undefined`

Native assets have no issuer — the type now reflects runtime behavior.

**Before:**

```ts
const issuer: string = asset.issuer; // always string
```

**After:**

```ts
const issuer = asset.issuer; // string | undefined
if (issuer !== undefined) {
  // use issuer safely
}
```

---

### 13. `SorobanDataBuilder.fromXDR` return type corrected

Return type corrected from `SorobanDataBuilder` to `xdr.SorobanTransactionData` to match runtime.

**Before:**

```ts
const builder: SorobanDataBuilder = SorobanDataBuilder.fromXDR(xdrStr);
builder.setReadOnly(keys); // chaining on the "builder" — never actually worked
```

**After:**

```ts
const data: xdr.SorobanTransactionData = SorobanDataBuilder.fromXDR(xdrStr);
// To get a builder from existing data:
const builder = new SorobanDataBuilder(xdrStr);
```

---

### 14. `Keypair.rawSecretKey()` now throws on public-key-only Keypair

**Before:**

```ts
const secret = keypair.rawSecretKey(); // returned undefined for public-only
```

**After:**

```ts
// Now throws Error("no secret seed available")
try {
  const secret = keypair.rawSecretKey();
} catch (e) {
  // Handle public-key-only keypair
}

// Or check first:
if (keypair.canSign()) {
  const secret = keypair.rawSecretKey();
}
```

---

### 15. `CreateInvocation.token` renamed to `CreateInvocation.asset`

**Before:**

```ts
const tokenAsset = invocation.token;
```

**After:**

```ts
const tokenAsset = invocation.asset;
```

---

### 16. `XdrLargeInt.getType()` return type changed

Now returns `ScIntType | undefined` instead of a raw lowercase string. Non-integer types yield `undefined`.

**Before:**

```ts
const type: string = largeInt.getType();
```

**After:**

```ts
const type: ScIntType | undefined = largeInt.getType();
if (type !== undefined) {
  // handle known int types
}
```

---

### 17. `ScIntType` now includes `'timepoint'` and `'duration'`

**Before:**

```ts
switch (scIntType) {
  case "i64":
  case "u64":
  // ... exhaustive
}
```

**After:**

```ts
switch (scIntType) {
  case "i64":
  case "u64":
  case "timepoint": // new
  case "duration": // new
  // ... exhaustive
}
```

---

### 18. Removed unused `supportMuxing` parameter

`decodeAddressToMuxedAccount` and `encodeMuxedAccountToAddress` no longer accept the `supportMuxing` parameter (it was already ignored at runtime).

**Before:**

```ts
decodeAddressToMuxedAccount(address, true);
```

**After:**

```ts
decodeAddressToMuxedAccount(address);
```

---

### 19. `XdrLargeInt` constructor spreads values for 128/256-bit types

**Before:**

```ts
new XdrLargeInt("u128", [lo, hi]); // array passed directly
```

**After:**

```ts
new XdrLargeInt("u128", lo, hi); // values spread as arguments
// or
new XdrLargeInt("u128", ...[lo, hi]); // explicit spread
```

---

### 20. `RevokeSignerSponsorship.signer` no longer accepts `Ed25519SignedPayload`

**Before:**

```ts
const opts = {
  signer: {
    ed25519SignedPayload: payload,
  },
};
```

**After:**

```ts
// Use ed25519PublicKey, sha256Hash, or preAuthTx instead
const opts = {
  signer: {
    ed25519PublicKey: publicKey,
  },
};
```

---

### 21. `SetOptions.clearFlags`/`setFlags` widened to accept any number

Type changed from `AuthFlag` to `AuthFlags` (`AuthFlag | (number & {})`), accepting combined bitmask values.

**Before:**

```ts
// Only AuthFlag enum values accepted in types
Operation.setOptions({ setFlags: AuthFlag.required });
```

**After:**

```ts
// Now accepts combined bitmask values too
Operation.setOptions({
  setFlags: AuthFlag.required | AuthFlag.revocable,
});
```

> **Note:** This is a widening change — existing code using single `AuthFlag` values still works.

---

### 22. `toXDRPrice` now rejects zero denominator

**Before:**

```ts
toXDRPrice("1/0"); // silently accepted
```

**After:**

```ts
toXDRPrice("1/0"); // throws — denominator must be > 0
```

---

### 23. `checkUnsignedIntValue` now uses `Number()` instead of `parseFloat()`

**Before:**

```ts
checkUnsignedIntValue("123abc"); // silently accepted as 123
```

**After:**

```ts
checkUnsignedIntValue("123abc"); // now rejected (NaN)
```

---

## Step-by-Step Migration Checklist

- [ ] **Update the package** — `npm install @stellar/stellar-base@16` _(Effort: Automated)_
- [ ] **Fix default import** — Replace `import StellarBase from ...` with `import * as StellarBase from ...` or named imports. Search for: `import StellarBase from` _(Effort: Automated — find-replace)_
- [ ] **Remove `FastSigning` references** — Delete all uses of the `FastSigning` constant _(Effort: Automated — find-replace)_
- [ ] **Replace `TransactionI` with `TransactionBase`** — Search for `TransactionI` in type annotations _(Effort: Automated — find-replace)_
- [ ] **Rename `CreateInvocation.token` to `.asset`** — Search for `.token` on `CreateInvocation` variables _(Effort: Automated — find-replace)_
- [ ] **Remove `supportMuxing` parameter** — Remove the second argument from `decodeAddressToMuxedAccount` / `encodeMuxedAccountToAddress` calls _(Effort: Automated — find-replace)_
- [ ] **Update `minAccountSequenceAge` to `bigint`** — Change number literals to bigint literals (`60` -> `60n`) in `setMinAccountSequenceAge` calls and related options _(Effort: Quick)_
- [ ] **Add explicit `networkPassphrase`** to all `authorizeEntry` / `authorizeInvocation` calls _(Effort: Quick)_
- [ ] **Fix `Transaction` generic usage** — Remove generic type parameters from `Transaction<...>` _(Effort: Quick)_
- [ ] **Handle `extraSigners` type change** — Update code that treats `tx.extraSigners` as `string[]` to use `SignerKey.encodeSignerKey()` for conversion _(Effort: Quick)_
- [ ] **Update `Asset.issuer` usage** — Add `undefined` checks where `asset.issuer` is used as `string` _(Effort: Quick)_
- [ ] **Remove `Asset` mutation** — Replace `asset.code = ...` / `asset.issuer = ...` with new `Asset(...)` construction _(Effort: Quick)_
- [ ] **Fix `AssetType` / `AuthFlag` type-position usage** — Replace namespace-style type references with `typeof` or string literals _(Effort: Quick)_
- [ ] **Update revoke sponsorship type checks** — Replace `=== "revokeSponsorship"` with specific type strings or a prefix check _(Effort: Quick)_
- [ ] **Handle `SorobanDataBuilder.fromXDR` return type** — Update variables typed as `SorobanDataBuilder` to `xdr.SorobanTransactionData` _(Effort: Quick)_
- [ ] **Handle `Keypair.rawSecretKey()` throw** — Add try/catch or `canSign()` guard for public-key-only keypairs _(Effort: Quick)_
- [ ] **Update `XdrLargeInt` constructor calls** — Spread 128/256-bit values as separate arguments _(Effort: Quick)_
- [ ] **Add `'timepoint'` / `'duration'` cases** to any exhaustive `ScIntType` switch statements _(Effort: Quick)_
- [ ] **Remove uses of `Operation.isValidAmount()` etc.** — Copy validation logic if needed _(Effort: Quick)_
- [ ] **Audit string-to-number conversions** — Check for strings like `"123abc"` passed to operations that are now rejected _(Effort: Medium — requires manual review)_
- [ ] **Run your test suite** and fix any remaining type errors or runtime failures _(Effort: Medium)_

## Common Gotchas

- **Silent network change:** The default `networkPassphrase` for `authorizeEntry`/`authorizeInvocation` changed from `FUTURENET` to `TESTNET`. If you relied on the default, your signatures will now target the wrong network with no error. Always pass the network explicitly.
- **`0n` is now preserved, not coerced to `null`:** `0n` (the same value as `BigInt(0)`) is falsy in JavaScript, but `TransactionBuilder` now keeps `0n` instead of converting it to `null`. This may trigger `hasV2Preconditions()` returning `true` when it previously returned `false`.
- **`extraSigners` was always objects:** The old `string[]` type was always wrong — the runtime stored `xdr.SignerKey[]`. If your code "worked" before, you may have been passing `SignerKey` objects where `string` was declared. Check that you're not double-converting.
- **`SorobanDataBuilder.fromXDR` was never a builder:** If your code chained methods on the return value, it was always broken at runtime. The type correction may surface a real bug.
- **`Keypair.rawSecretKey()` undefined check removal:** If you checked for `undefined` return, that code path will now throw instead. Switch to checking `canSign()` before calling.
- **Revoke sponsorship type strings already changed at runtime:** The runtime always returned specific strings (e.g., `"revokeAccountSponsorship"`). If you compared against `"revokeSponsorship"`, your code was already broken — this just makes TypeScript agree.
- **`parseFloat` to `Number` is stricter:** `parseFloat("123abc")` returns `123`, but `Number("123abc")` returns `NaN`. If any operation parameters were passed with trailing garbage characters, they will now fail.

## Testing Your Migration

- [ ] TypeScript compilation passes with zero errors (`npx tsc --noEmit`)
- [ ] All existing unit tests pass
- [ ] Transaction building works with `bigint` sequence ages
- [ ] `authorizeEntry` / `authorizeInvocation` produce valid signatures for your target network
- [ ] Revoke sponsorship operations parse with the correct specific type strings
- [ ] `Keypair` from public key throws (not returns `undefined`) when calling `rawSecretKey()`
- [ ] `Asset` creation and comparison works with `readonly` properties
- [ ] `XdrLargeInt` construction for 128/256-bit types works with spread arguments
- [ ] Named imports (`import { Keypair, Asset, ... }`) resolve correctly
- [ ] End-to-end transaction submission succeeds on testnet
