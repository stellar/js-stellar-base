describe('Transaction', function() {

  it("constructs Transaction object from a TransactionEnvelope", function(done) {
    let source      = new StellarBase.Account("GDBY5F7J2BNYLZGCJGX6QXAPXEYN32KVKJU7HE4UALTNGRKPDWMVO6TR", 0);
    let destination = "GA5LIOWVBQRLDZI23MYAERI5FLUU67JWPWMQD3QEJA5Z5RDCOGXRCBAV";
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
