import * as StellarSdk from 'stellar-base';

const masterKey = StellarSdk.Keypair.master(StellarSdk.Networks.TESTNET); // $ExpectType Keypair
const sourceKey = StellarSdk.Keypair.random(); // $ExpectType Keypair
const destKey = StellarSdk.Keypair.random();
const account = new StellarSdk.Account(sourceKey.publicKey(), '1');
const transaction = new StellarSdk.TransactionBuilder(account, {
  fee: "100",
  networkPassphrase: StellarSdk.Networks.TESTNET
})
  .addOperation(
    StellarSdk.Operation.accountMerge({ destination: destKey.publicKey() })
  )
  .addMemo(new StellarSdk.Memo(StellarSdk.MemoText, 'memo'))
  .setTimeout(5)
  .build(); // $ExpectType () => Transaction<Memo<MemoType>, Operation[]>

const transactionFromXDR = new StellarSdk.Transaction(transaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]>

transactionFromXDR.networkPassphrase; // $ExpectType string
transactionFromXDR.networkPassphrase = "SDF";

StellarSdk.TransactionBuilder.fromXDR(transaction.toXDR(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
StellarSdk.TransactionBuilder.fromXDR(transaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

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

StellarSdk.TransactionBuilder.fromXDR(feeBumptransaction.toXDR(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction
StellarSdk.TransactionBuilder.fromXDR(feeBumptransaction.toEnvelope(), StellarSdk.Networks.TESTNET); // $ExpectType Transaction<Memo<MemoType>, Operation[]> | FeeBumpTransaction

// P.S. don't use Memo constructor
new StellarSdk.Memo(StellarSdk.MemoHash, 'asdf').value; // $ExpectType MemoValue
// (new StellarSdk.Memo(StellarSdk.MemoHash, 'asdf')).type; // $ExpectType MemoType  // TODO: Inspect what's wrong with linter.

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

const buffer = Buffer.alloc(4);
StellarSdk.xdr.Uint32.write(4, buffer); //  $ExpectType void
StellarSdk.xdr.Uint32.fromXDR(buffer); //  $ExpectType number
StellarSdk.xdr.Uint32.fromXDR(buffer.toString('base64'), 'base64'); //  $ExpectType number
StellarSdk.xdr.Uint32.read(buffer); //  $ExpectType number
StellarSdk.xdr.Uint32.toXDR(4); //  $ExpectType Buffer
StellarSdk.xdr.Uint32.isValid(4); //  $ExpectType number

StellarSdk.xdr.Uint64.fromString("1234").high; //  $ExpectType number
StellarSdk.xdr.Int64.fromString("1234").high; //  $ExpectType number

StellarSdk.xdr.String32.toXDR("hola"); // $ExpectType Buffer
StellarSdk.xdr.String64.toXDR("hola"); // $ExpectType Buffer

StellarSdk.xdr.Hash.isValid(Buffer.alloc(32)); // $ExpectType boolean
StellarSdk.xdr.Hash.isValid(Buffer.alloc(32)); // $ExpectType boolean

StellarSdk.xdr.Int64.fromXDR(Buffer.alloc(8)); // $ExpectType Hyper
StellarSdk.xdr.SequenceNumber.fromXDR(Buffer.alloc(8)); // $ExpectType Hyper
StellarSdk.xdr.Int64.MIN_VALUE; // $ExpectType Hyper
StellarSdk.xdr.SequenceNumber.MIN_VALUE; // $ExpectType Hyper

const envelope = feeBumptransaction.toEnvelope(); // $ExpectType TransactionEnvelope
envelope.v0(); // $ExpectType TransactionV0Envelope
envelope.v1(); // $ExpectType TransactionV1Envelope
envelope.feeBump(); // $ExpectType FeeBumpTransactionEnvelope
