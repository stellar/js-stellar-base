describe('Transaction', function() {

  it("constructs Transaction object from a TransactionEnvelope", function(done) {
    var transaction = new StellarBase.Transaction('42cf0559790f6c3b64de15120df0bb25caab7dc2db4fb4a18a35e881bf323af7000003e800002daf0000000a0000000000000000000000010000000000000001dbf7da8de1508d8aa4c6030cf860d9d97b1476742809b0958e020977d4a3faff0000000000000000773594000000000142cf0559ae85a7bdb6e58ae6a3f2f58ab30740b093f1d9e7631cbda27e59ddde4c753068f675be655a4351947e8c3d2594c272771e7bc7be550213dbedaed13b0d1f3004');
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal('gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wn');
    expect(transaction.fee).to.be.equal(1000);
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal('gsC18vAa8NYhX9akw8z6TmBicQ9WNAHf7uiJcLuikGFLb3CjiQi');

    done();
  });

});
