describe('Transaction', function() {

  it("constructs Transaction object from a TransactionEnvelope", function(done) {
    let source      = new StellarBase.Account("gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wn", 0);
    let destination = "gsbkQ1tG4fEqk1sApdeQYZG9r19yVm28m2Zz72gRGjoDKTHi7UL";
    let currency    = StellarBase.Currency.native();
    let amount      = "2000";

    let input = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({destination, currency, amount}))
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

});
