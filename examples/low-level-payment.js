import * as StellarBase from "../src"

let master      = StellarBase.Keypair.master();
let destination = StellarBase.Keypair.fromSeed("sfmwkyBAPKz85JxLKtbrTmMnvnUbzYbjcps27QnhUfuUxKenARa");

let tx = new StellarBase.xdr.Transaction({
  sourceAccount: master.accountId(),
  maxFee:        1000,
  seqNum:        StellarBase.xdr.SequenceNumber.fromString("1"),
  minLedger:     0,
  maxLedger:     1000,
})

let payment = new StellarBase.xdr.PaymentOp({
  destination: destination.accountId(),
  currency:    StellarBase.xdr.Currency.native(),
  path:        [],
  amount:      StellarBase.Hyper.fromString("200000000"),
  sendMax:     StellarBase.Hyper.fromString("200000000"),
  sourceMemo:  new Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
  memo:        new Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),
})

let op = new StellarBase.xdr.Operation({
  body: StellarBase.xdr.OperationBody.payment(payment),
})

tx.operations([op]);

let tx_raw = tx.toXDR();

let tx_hash    = StellarBase.hash(tx_raw);
let signatures = [master.signDecorated(tx_hash)];
let envelope = new StellarBase.xdr.TransactionEnvelope({tx, signatures});

console.log(envelope.toXDR("hex"));
