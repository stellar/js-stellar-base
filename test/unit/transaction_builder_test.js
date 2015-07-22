describe('TransactionBuilder', function() {

    describe("constructs a native payment transaction", function(done) {
        var source;
        var destination;
        var amount;
        var currency;
        var transaction;
        beforeEach(function () {
            source = new StellarBase.Account("GD42PMZLG7O2URVTUUWAFGI36ZGGFD3H6MN4UN452YBIBHX3WUYTTXXV", 0);
            destination = "GBMZKARX4XDCEOWFFHF7FJNJUOF66LHOS3Q55QPGQBC6QJ7IOIH46ZBF";
            amount = "1000";
            currency = StellarBase.Currency.native();

            transaction = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({
                    destination: destination,
                    currency: currency,
                    amount: amount
                }))
                .build();
        });

        it("should have the same source account", function (done) {
            expect(transaction.source)
                .to.be.equal(source.address);
            done()
        });

        it("should have the incremented sequence number", function (done) {
            expect(transaction.sequence).to.be.equal("1");
            done();
        });

        it("should increment the account's sequence number", function (done) {
            expect(source.sequence).to.be.equal(1);
            done();
        });

        it("should have one payment operation", function (done) {
            expect(transaction.operations.length).to.be.equal(1);
            expect(transaction.operations[0].type).to.be.equal("payment");
            done();
        });
    });
});
