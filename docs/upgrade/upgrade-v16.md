---
name: upgrade-v16
description:
  Scan a consumer codebase for @stellar/stellar-base v15 patterns that break in
  v16 and apply automated fixes (or flag complex cases for the user).
user_invocable: true
---

# Upgrade to @stellar/stellar-base v16

You are a migration assistant. The user has a codebase that depends on
`@stellar/stellar-base` v15 and wants to upgrade to v16 (the TypeScript
rewrite). Your job is to scan their code for breaking patterns and either fix
them automatically or alert the user when a fix requires human judgment.

## How to run

1. **Determine the scan root.** If the user passes a directory as an argument,
   use that. Otherwise use the current working directory.
2. Work through each check below **in order**. For every check:
   - Run the Grep/Glob searches described.
   - If no matches are found, skip silently.
   - If matches are found, decide whether the fix is **auto-fixable** or
     **needs-review**.
     - **Auto-fixable**: apply the Edit, then report what you changed.
     - **Needs-review**: print the file, line number, and a short explanation of
       what must change. Do NOT guess at a fix.
3. After all checks, print a summary table of everything found.

## Important rules

- Never modify files inside `node_modules/`.
- Never modify test snapshots — flag them for the user instead.
- Only edit files that match `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.mjs`, `*.cjs`
  unless the user says otherwise.
- If a single line matches multiple checks, report all of them but only edit
  once.
- Run checks in parallel where possible (use multiple Grep calls in one
  message).

---

## Checks

### CHECK 1 — Default import of stellar-base

**Search**: Grep for `import\s+\w+\s+from\s+['"]@stellar/stellar-base['"]`
**Also search**: Grep for
`require\s*\(\s*['"]@stellar/stellar-base['"]\s*\)\s*;?\s*$` (bare require
assigned to a single identifier, not destructured)

**Auto-fix**: Replace `import StellarBase from '@stellar/stellar-base'` with
`import * as StellarBase from '@stellar/stellar-base'`. For require, replace
`const StellarBase = require('@stellar/stellar-base')` — this form already
works, so only flag if the user is using ESM default import syntax.

---

### CHECK 2 — `FastSigning` usage

**Search**: Grep for `FastSigning`

**Auto-fix**: If the match is a simple boolean check like
`if (StellarBase.FastSigning)` or `if (FastSigning)`, remove the condition and
keep the body (the new library always uses fast signing). If the usage is more
complex (assigned to a variable, passed as an argument, etc.), flag as
**needs-review** with the message: "`FastSigning` has been removed. The library
now always uses `@noble/curves/ed25519`. Remove any code that branches on this
flag."

---

### CHECK 3 — `TransactionI` references

**Search**: Grep for `TransactionI[^a-zA-Z]` (word boundary — avoid matching
`TransactionInner` etc.)

**Auto-fix**: Replace `TransactionI` with `TransactionBase` in type annotations
and `instanceof` checks.

---

### CHECK 4 — `minAccountSequenceAge` with number values

**Search**: Grep for `minAccountSequenceAge`

**Needs-review**: For every match, check whether the value is a `number` literal
(e.g., `60`) or a variable typed as `number`. If so, alert the user:
"`minAccountSequenceAge` is now `bigint`. Change `60` to `60n`, or wrap with
`BigInt(value)`. Also check comparisons — `bigint` cannot be compared with `===`
to `number`."

**Auto-fix**: If the value is a simple numeric literal (e.g.,
`minAccountSequenceAge: 100`), replace with the `n` suffix
(`minAccountSequenceAge: 100n`). If it uses
`setMinAccountSequenceAge(someNumber)` with a non-literal, flag as
**needs-review**.

---

### CHECK 5 — `extraSigners` used as `string[]`

**Search**: Grep for `extraSigners`

**Needs-review**: For every match, alert the user: "`extraSigners` is now
`xdr.SignerKey[]` instead of `string[]`. If you were treating elements as
strings, use `SignerKey.encodeSignerKey(signer)` to convert." Do not auto-fix —
the correct conversion depends on context.

---

### CHECK 6 — `authorizeEntry` / `authorizeInvocation` without explicit `networkPassphrase`

**Search**: Grep for `authorizeEntry\(` and `authorizeInvocation\(`

**Needs-review**: For each call site, read the surrounding lines. If the call
does NOT pass a `networkPassphrase` argument, alert the user: "The default
`networkPassphrase` changed from `Networks.FUTURENET` to `Networks.TESTNET`. If
you were relying on the default for Futurenet, add
`networkPassphrase: Networks.FUTURENET` explicitly." Do not auto-fix — the
correct network depends on the user's intent.

---

### CHECK 7 — `createStellarAssetContract` or `uploadContractWasm` with `auth`

**Search**: Grep for `createStellarAssetContract\s*\(` and
`uploadContractWasm\s*\(`

**Needs-review**: For each call site, read the options object. If it contains an
`auth` property, alert the user: "`auth` is no longer forwarded to
`invokeHostFunction` by `createStellarAssetContract` / `uploadContractWasm`. You
must call `invokeHostFunction` directly if you need to pass authorization
entries."

---

### CHECK 8 — `Operation.isValidAmount` / `Operation.constructAmountRequirementsError` / `Operation.setSourceAccount`

**Search**: Grep for
`Operation\.(isValidAmount|constructAmountRequirementsError|setSourceAccount)\b`

**Needs-review**: Alert the user: "These static methods have been removed from
the `Operation` class. They are now internal utility functions and are not
re-exported. If you need amount validation, re-implement locally or import from
the source if your bundler supports it."

---

### CHECK 9 — `op.type === 'revokeSponsorship'` or `OperationType.RevokeSponsorship`

**Search**: Grep for `revokeSponsorship` (case-sensitive, excluding filenames
containing `revoke_sponsorship`)

**Needs-review**: For matches that compare `op.type === "revokeSponsorship"` or
reference `OperationType.RevokeSponsorship`, alert: "Revoke operations now have
specific type strings: `revokeAccountSponsorship`, `revokeTrustlineSponsorship`,
`revokeOfferSponsorship`, `revokeDataSponsorship`,
`revokeClaimableBalanceSponsorship`, `revokeLiquidityPoolSponsorship`,
`revokeSignerSponsorship`. Update your type checks accordingly." Do not auto-fix
— the user must decide which specific types to check.

---

### CHECK 10 — `AssetType.` or `AuthFlag.` in type position

**Search**: Grep for `:\s*(AssetType|AuthFlag)\.\w+` (used as a type annotation)

**Auto-fix**: If used as a type annotation (e.g., `let x: AssetType.native`),
replace with the string literal type (e.g., `let x: "native"`). If used as a
value (`AssetType.native`), it still works — skip.

---

### CHECK 11 — `SorobanDataBuilder.fromXDR(...)` chained with builder methods

**Search**: Grep for
`SorobanDataBuilder\.fromXDR\(.*\)\.\s*(set|append|get|build)`

**Needs-review**: Alert: "`SorobanDataBuilder.fromXDR()` now correctly returns
`xdr.SorobanTransactionData`, not `SorobanDataBuilder`. To chain builder
methods, wrap the result:
`new SorobanDataBuilder(SorobanDataBuilder.fromXDR(data))`."

---

### CHECK 12 — `Transaction<` generic type parameters

**Search**: Grep for `Transaction\s*<\s*(Memo|Operation)`

**Auto-fix**: Remove the generic parameters. Replace
`Transaction<Memo<MemoType.Text>>` with `Transaction`,
`Transaction<Memo, Operation[]>` with `Transaction`, etc.

---

### CHECK 13 — `asset.code =` or `asset.issuer =` (mutation)

**Search**: Grep for `\.\s*(code|issuer)\s*=\s*[^=]` — then filter to lines that
reference asset-like variables.

**Needs-review**: Alert: "`Asset.code` and `Asset.issuer` are now `readonly`.
Create a new `Asset` instance instead of mutating."

---

### CHECK 14 — `rawSecretKey()` with falsy check

**Search**: Grep for `rawSecretKey\(\)`

**Needs-review**: For each match, check if the result is used in a falsy check
(e.g., `if (!kp.rawSecretKey())`). Alert: "`rawSecretKey()` now throws instead
of returning `undefined` when no secret seed is available. Wrap in a try/catch,
or check `kp.canSign()` first."

---

### CHECK 15 — `CreateInvocation` `.token` usage

**Search**: Grep for `\.token\b` in files that also reference `CreateInvocation`
or `buildInvocationTree` or `InvocationTree`

**Auto-fix**: Replace `.token` with `.asset` on `CreateInvocation` objects.

---

### CHECK 16 — `XdrLargeInt.getType(` without undefined check

**Search**: Grep for `XdrLargeInt\.getType\(`

**Needs-review**: Alert: "`XdrLargeInt.getType()` now returns
`ScIntType | undefined` instead of always a string. Check for `undefined` before
using the result."

---

### CHECK 17 — `Keypair.xdrMuxedAccount` or `Memo` setter usage

**Search**: Grep for `\.type\s*=\s*` or `\.value\s*=\s*` near `memo` references.

**Needs-review**: Alert if setting `memo.type = ...` or `memo.value = ...`:
"`Memo` is now immutable. Setters throw. Create a new `Memo` instance instead."

---

### CHECK 18 — `toXDRPrice` with zero denominator

**Search**: Grep for `[{,]\s*d\s*:\s*0\s*[},]`

**Needs-review**: Alert: "`toXDRPrice` now rejects prices with denominator `0`
(`d <= 0` instead of `d < 0`). This was always a bug — fix the price value."

---

### CHECK 19 — `instanceof TransactionI`

Already covered by CHECK 3. Skip duplicate.

---

### CHECK 20 — `Signer` weight as `number` without string handling

**Search**: Grep for `signer\.weight` or `\.weight\b` near signer-related code

**Needs-review**: Alert: "`Signer.weight` is now `number | string | undefined`.
If you are using the weight as a number, ensure you handle the `string` case
(e.g., `Number(signer.weight)`)."

---

## Summary format

After all checks, print:

```
## Upgrade Summary

| # | Check | Matches | Action |
|---|-------|---------|--------|
| 1 | Default import | 2 | Auto-fixed |
| 2 | FastSigning | 0 | Skipped |
| ... | ... | ... | ... |

### Files modified
- src/foo.ts (lines 12, 45)
- src/bar.ts (line 8)

### Items needing manual review
- src/baz.ts:23 — `extraSigners` used as string array
- src/qux.ts:91 — `authorizeEntry` missing networkPassphrase
```
