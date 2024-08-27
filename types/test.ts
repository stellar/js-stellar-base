import * as StellarSdk from 'stellar-base';

const masterKey = StellarSdk.Keypair.master(StellarSdk.Networks.TESTNET); // $ExpectType Keypair
const sourceKey = StellarSdk.Keypair.random(); // $ExpectType Keypair
const destKey = StellarSdk.Keypair.random();
const usd = new StellarSdk.Asset('USD', 'GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7'); // $ExpectType Asset
const account = new StellarSdk.Account(sourceKey.publicKey(), '1'); // $ExpectType Account
const muxedAccount = new StellarSdk.MuxedAccount(account, '123'); // $ExpectType MuxedAccount
const muxedConforms = muxedAccount as StellarSdk.Account; // $ExpectType Account

const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: StellarSdk.Networks.TESTNET
})
  .addOperation(
    StellarSdk.Operation.beginSponsoringFutureReserves({
      sponsoredId: account.accountId(),
      source: masterKey.publicKey(),
    })
  ).addOperation(
    StellarSdk.Operation.accountMerge({ destination: destKey.publicKey() }),
  ).addOperation(
    StellarSdk.Operation.payment({
      source: account.accountId(),
      destination: muxedAccount.accountId(),
      amount: "100",
      asset: usd,
    })
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
    StellarSdk.Operation.endSponsoringFutureReserves({})
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
    StellarSdk.Operation.revokeLiquidityPoolSponsorship({
      liquidityPoolId: "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
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
  ).addOperation(
    StellarSdk.Operation.clawback({
      from: account.accountId(),
      amount: "1000",
      asset: usd,
    })
  ).addOperation(
    StellarSdk.Operation.clawbackClaimableBalance({
      balanceId: "00000000da0d57da7d4850e7fc10d2a9d0ebc731f7afb40574c03395b17d49149b91f5be",
    })
  ).addOperation(
    StellarSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
        authorizedToMaintainLiabilities: true,
        clawbackEnabled: true,
      },
    })
  ).addOperation(
    StellarSdk.Operation.setTrustLineFlags({
      trustor: account.accountId(),
      asset: usd,
      flags: {
        authorized: true,
      },
    })
  ).addOperation(
    StellarSdk.Operation.liquidityPoolDeposit({
      liquidityPoolId: "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
      maxAmountA: "10000",
      maxAmountB: "20000",
      minPrice: "0.45",
      maxPrice: "0.55",
    })
  ).addOperation(
    StellarSdk.Operation.liquidityPoolWithdraw({
      liquidityPoolId: "dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7",
      amount: "100",
      minAmountA: "10000",
      minAmountB: "20000",
    })
  ).addOperationAt(
    StellarSdk.Operation.setOptions({
      setFlags:   (StellarSdk.AuthImmutableFlag | StellarSdk.AuthRequiredFlag) as StellarSdk.AuthFlag,
      clearFlags: (StellarSdk.AuthRevocableFlag | StellarSdk.AuthClawbackEnabledFlag) as StellarSdk.AuthFlag,
    }),
    0
  ).clearOperationAt(2
  ).addMemo(new StellarSdk.Memo(StellarSdk.MemoText, 'memo'))
  .setTimeout(5)
  .setTimebounds(Date.now(), Date.now() + 5000)
  .setLedgerbounds(5, 10)
  .setMinAccountSequence("5")
  .setMinAccountSequenceAge(5)
  .setMinAccountSequenceLedgerGap(5)
  .setExtraSigners([sourceKey.publicKey()])
  .build(); // $ExpectType () => Transaction<Memo<MemoType>, Operation[]>

const transactionFromXDR = new StellarSdk.Transaction(transaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]>

transactionFromXDR.networkPassphrase; // $ExpectType string
transactionFromXDR.networkPassphrase = "SDF";

StellarSdk.TransactionBuilder.fromXDR(transaction.toXDR(), StellarSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction | Transaction<Memo<MemoType>, Operation[]>
StellarSdk.TransactionBuilder.fromXDR(transaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction | Transaction<Memo<MemoType>, Operation[]>

const sig = StellarSdk.xdr.DecoratedSignature.fromXDR(Buffer.of(1, 2)); // $ExpectType DecoratedSignature
sig.hint(); // $ExpectType Buffer
sig.signature(); // $ExpectType Buffer

StellarSdk.Memo.none(); // $ExpectType Memo<"none">
StellarSdk.Memo.text('asdf'); // $ExpectType Memo<"text">
StellarSdk.Memo.id('asdf'); // $ExpectType Memo<"id">
StellarSdk.Memo.return('asdf'); // $ExpectType Memo<"return">
StellarSdk.Memo.hash('asdf'); // $ExpectType Memo<"hash">
StellarSdk.Memo.none().value; // $ExpectType null
StellarSdk.Memo.id('asdf').value; // $ExpectType string
StellarSdk.Memo.text('asdf').value; // $ExpectType string | Buffer
StellarSdk.Memo.return('asdf').value; // $ExpectType Buffer
StellarSdk.Memo.hash('asdf').value; // $ExpectType Buffer

const feeBumptransaction = StellarSdk.TransactionBuilder.buildFeeBumpTransaction(masterKey, "120", transaction, StellarSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction

feeBumptransaction.feeSource; // $ExpectType string
feeBumptransaction.innerTransaction; // $ExpectType Transaction<Memo<MemoType>, Operation[]>
feeBumptransaction.fee; // $ExpectType string
feeBumptransaction.toXDR(); // $ExpectType string
feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
feeBumptransaction.hash(); // $ExpectType Buffer

StellarSdk.TransactionBuilder.fromXDR(feeBumptransaction.toXDR(), StellarSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction | Transaction<Memo<MemoType>, Operation[]>
StellarSdk.TransactionBuilder.fromXDR(feeBumptransaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType FeeBumpTransaction | Transaction<Memo<MemoType>, Operation[]>

// P.S. You shouldn't be using the Memo constructor
//
// Unfortunately, it appears that type aliases aren't unwrapped by the linter,
// causing the following lines to fail unnecessarily:
//
// new StellarSdk.Memo(StellarSdk.MemoHash, 'asdf').value; // $ExpectType MemoValue
// new StellarSdk.Memo(StellarSdk.MemoHash, 'asdf').type; // $ExpectType MemoType
//
// This is because the linter just does a raw string comparison on type names:
// https://github.com/Microsoft/dtslint/issues/57#issuecomment-451666294

const noSignerXDR = StellarSdk.Operation.setOptions({ lowThreshold: 1 });
StellarSdk.Operation.fromXDRObject(noSignerXDR).signer; // $ExpectType never

const newSignerXDR1 = StellarSdk.Operation.setOptions({
  signer: { ed25519PublicKey: sourceKey.publicKey(), weight: '1' }
});
StellarSdk.Operation.fromXDRObject(newSignerXDR1).signer; // $ExpectType Ed25519PublicKey

const newSignerXDR2 = StellarSdk.Operation.setOptions({
  signer: { sha256Hash: Buffer.from(''), weight: '1' }
});
StellarSdk.Operation.fromXDRObject(newSignerXDR2).signer; // $ExpectType Sha256Hash

const newSignerXDR3 = StellarSdk.Operation.setOptions({
  signer: { preAuthTx: '', weight: 1 }
});
StellarSdk.Operation.fromXDRObject(newSignerXDR3).signer; // $ExpectType PreAuthTx

StellarSdk.TimeoutInfinite; // $ExpectType 0

const envelope = feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
envelope.v0(); // $ExpectType TransactionV0Envelope
envelope.v1(); // $ExpectType TransactionV1Envelope
envelope.feeBump(); // $ExpectType FeeBumpTransactionEnvelope

const meta = StellarSdk.xdr.TransactionMeta.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAQAAAAIAAAADAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuDAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAcEsRAAAAAAAAAAArZu2SrdQ9krkyj7RBqTx1txDNZBfcS+wGjuEUizV9hkAAAAAAKXgdAGig34AADuEAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA==',
  'base64'
);
meta; // $ExpectType TransactionMeta
meta.v1().txChanges(); // $ExpectType LedgerEntryChange[]
const op = StellarSdk.xdr.AllowTrustOp.fromXDR(
  'AAAAAMNQvnFVCnBnEVzd8ZaKUvsI/mECPGV8cnBszuftCmWYAAAAAUNPUAAAAAAC',
  'base64'
);
op; // $ExpectType AllowTrustOp
op.authorize(); // $ExpectType number
op.trustor().ed25519(); // $ExpectType Buffer
op.trustor(); // $ExpectedType AccountId
const e = StellarSdk.xdr.LedgerEntry.fromXDR(
  "AAAAAAAAAAC2LgFRDBZ3J52nLm30kq2iMgrO7dYzYAN3hvjtf1IHWg==",
  'base64'
);
e; // $ExpectType LedgerEntry
const a = StellarSdk.xdr.AccountEntry.fromXDR(
  // tslint:disable:max-line-length
  'AAAAALYuAVEMFncnnacubfSSraIyCs7t1jNgA3eG+O1/UgdaAAAAAAAAA+gAAAAAGc1zDAAAAAIAAAABAAAAAEB9GCtIe8SCLk7LV3MzmlKN3U4M2JdktE7ofCKtTNaaAAAABAAAAAtzdGVsbGFyLm9yZwABAQEBAAAAAQAAAACEKm+WHjUQThNzoKx6WbU8no3NxzUrGtoSLmtxaBAM2AAAAAEAAAABAAAAAAAAAAoAAAAAAAAAFAAAAAA=',
  'base64'
);
a; // $ExpectType AccountEntry
a.homeDomain(); // $ExpectType string | Buffer
const t = StellarSdk.xdr.TransactionV0.fromXDR(
    // tslint:disable:max-line-length
    '1bzMAeuKubyXUug/Xnyj1KYkv+cSUtCSvAczI2b459kAAABkAS/5cwAAABMAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAsBL/lzAAAAFAAAAAA=',
    'base64'
);
t; // $ExpectType TransactionV0
t.timeBounds(); // $ExpectType TimeBounds | null

StellarSdk.xdr.Uint64.fromString("12"); // $ExpectType UnsignedHyper
StellarSdk.xdr.Int32.toXDR(-1); // $ExpectType Buffer
StellarSdk.xdr.Uint32.toXDR(1); // $ExpectType Buffer
StellarSdk.xdr.String32.toXDR("hellow world"); // $ExpectedType Buffer
StellarSdk.xdr.Hash.toXDR(Buffer.alloc(32)); // $ExpectedType Buffer
StellarSdk.xdr.Signature.toXDR(Buffer.alloc(9, 'a')); // $ExpectedType Buffer

const change = StellarSdk.xdr.LedgerEntryChange.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAwHBW0UAAAAAAAAAADwkQ23EX6ohsRsGoCynHl5R8D7RXcgVD4Y92uUigLooAAAAAIitVMABlM5gABTlLwAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA',
  'base64'
);
change; // $ExpectType LedgerEntryChange
const raw = StellarSdk.xdr.LedgerEntryChanges.toXDR([change]); // $ExpectType Buffer
StellarSdk.xdr.LedgerEntryChanges.fromXDR(raw); // $ExpectType LedgerEntryChange[]

StellarSdk.xdr.Asset.assetTypeNative(); // $ExpectType Asset
StellarSdk.xdr.InnerTransactionResultResult.txInternalError(); // $ExpectType InnerTransactionResultResult
StellarSdk.xdr.TransactionV0Ext[0](); // $ExpectedType TransactionV0Ext

StellarSdk.Claimant.predicateUnconditional(); // $ExpectType ClaimPredicate
const claimant = new StellarSdk.Claimant(sourceKey.publicKey()); // $ExpectType Claimant
claimant.toXDRObject(); // $ExpectType Claimant
claimant.destination; // $ExpectType string
claimant.predicate; // $ExpectType ClaimPredicate

const claw = StellarSdk.xdr.ClawbackOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABMAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAADFTYDKyTn2O0DVUEycHKfvsnFWj91TVl0ut1kwg5nLigAAAAJUC+QA',
  'base64'
);
claw; // $ExpectType ClawbackOp

const clawCb = StellarSdk.xdr.ClawbackClaimableBalanceOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAxU2Aysk59jtA1VBMnByn77JxVo/dU1ZdLrdZMIOZy4oAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAH',
  'base64'
);
clawCb; // $ExpectType ClawbackClaimableBalanceOp

const trust = StellarSdk.xdr.SetTrustLineFlagsOp.fromXDR(
  // tslint:disable:max-line-length
  'AAAAAAAAABUAAAAAF1frB6QZRDTYW4dheEA3ZZLCjSWs9eQgzsyvqdUy2rgAAAABVVNEAAAAAADNTrgPO19O0EsnYjSc333yWGLKEVxLyu1kfKjCKOz9ewAAAAAAAAAB',
  'base64'
);
trust; // $ExpectType SetTrustLineFlagsOp

const lpDeposit = StellarSdk.xdr.LiquidityPoolDepositOp.fromXDR(
  // tslint:disable:max-line-length
  '3XsauDHCczEN2+xvl4cKqDwvvXjOIq3tN+y/TzOA+scAAAAABfXhAAAAAAAL68IAAAAACQAAABQAAAALAAAAFA==',
  'base64'
);
lpDeposit; // $ExpectType LiquidityPoolDepositOp

const lpWithdraw = StellarSdk.xdr.LiquidityPoolWithdrawOp.fromXDR(
  // tslint:disable:max-line-length
  '3XsauDHCczEN2+xvl4cKqDwvvXjOIq3tN+y/TzOA+scAAAAAAvrwgAAAAAAF9eEAAAAAAAvrwgA=',
  'base64'
);
lpWithdraw; // $ExpectType LiquidityPoolWithdrawOp

const pubkey = masterKey.rawPublicKey(); // $ExpectType Buffer
const seckey = masterKey.rawSecretKey(); // $ExpectType Buffer
const muxed = StellarSdk.encodeMuxedAccount(masterKey.publicKey(), '1'); // $ExpectType MuxedAccount
const muxkey = muxed.toXDR("raw"); // $ExpectType Buffer

let result = StellarSdk.StrKey.encodeEd25519PublicKey(pubkey);  // $ExpectType string
StellarSdk.StrKey.decodeEd25519PublicKey(result);               // $ExpectType Buffer
StellarSdk.StrKey.isValidEd25519PublicKey(result);              // $ExpectType boolean

result = StellarSdk.StrKey.encodeEd25519SecretSeed(seckey); // $ExpectType string
StellarSdk.StrKey.decodeEd25519SecretSeed(result);          // $ExpectType Buffer
StellarSdk.StrKey.isValidEd25519SecretSeed(result);         // $ExpectType boolean

result = StellarSdk.StrKey.encodeMed25519PublicKey(muxkey);   // $ExpectType string
StellarSdk.StrKey.decodeMed25519PublicKey(result);            // $ExpectType Buffer
StellarSdk.StrKey.isValidMed25519PublicKey(result);           // $ExpectType boolean

result = StellarSdk.StrKey.encodeSignedPayload(pubkey);   // $ExpectType string
StellarSdk.StrKey.decodeSignedPayload(result);            // $ExpectType Buffer
StellarSdk.StrKey.isValidSignedPayload(result);           // $ExpectType boolean

const muxedAddr = StellarSdk.encodeMuxedAccountToAddress(muxed, true);  // $ExpectType string
StellarSdk.decodeAddressToMuxedAccount(muxedAddr, true);                // $ExpectType MuxedAccount

const sk = StellarSdk.xdr.SignerKey.signerKeyTypeEd25519SignedPayload(
  new StellarSdk.xdr.SignerKeyEd25519SignedPayload({
    ed25519: sourceKey.rawPublicKey(),
    payload: Buffer.alloc(1)
  })
);
StellarSdk.SignerKey.encodeSignerKey(sk);                   // $ExpectType string
StellarSdk.SignerKey.decodeAddress(sourceKey.publicKey());  // $ExpectType SignerKey

new StellarSdk.ScInt(1234);           // $ExpectType ScInt
new StellarSdk.ScInt('1234');         // $ExpectType ScInt
new StellarSdk.ScInt(BigInt(1234));   // $ExpectType ScInt
(['i64', 'u64', 'i128', 'u128', 'i256', 'u256'] as StellarSdk.ScIntType[]).forEach((type) => {
  new StellarSdk.ScInt(1234, { type }); // $ExpectType ScInt
});
