describe('TransactionBuilder', function() {

    describe("constructs a native payment transaction", function(done) {
        var source;
        var destination;
        var amount;
        var asset;
        var transaction;
        beforeEach(function () {
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", 0);
            destination = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
            amount = "1000";
            asset = StellarBase.Asset.native();

            transaction = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({
                    destination: destination,
                    asset: asset,
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
