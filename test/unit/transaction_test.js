describe('Transaction', function() {

  it("constructs Transaction object from a TransactionEnvelope", function(done) {
    let source      = new StellarBase.Account("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB", 0);
    let destination = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
    let asset       = StellarBase.Asset.native();
    let amount      = "2000";

    let input = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({destination, asset, amount}))
                .build()
                .toEnvelope()
                .toXDR('hex');


    var transaction = new StellarBase.Transaction(input);
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.address);
    expect(transaction.fee).to.be.equal(1000);
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal(destination);
    expect(operation.amount).to.be.equal(amount);

    done();
  });


  it("signs correctly", function() {
    let source      = new StellarBase.Account("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB", 0);
    let destination = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
    let asset       = StellarBase.Asset.native();
    let amount      = "2000";
    let signer      = StellarBase.Keypair.master();

    let tx = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({destination, asset, amount}))
                .addSigner(signer)
                .build();

    let env = tx.toEnvelope();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });

});
