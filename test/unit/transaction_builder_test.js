describe('TransactionBuilder', function() {

    describe("constructs a native payment transaction with one operation", function() {
        var source;
        var destination;
        var amount;
        var asset;
        var transaction;
        var memo;
        beforeEach(function () {
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");
            destination = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
            amount = "1000";
            asset = StellarBase.Asset.native();
            memo = StellarBase.Memo.id("100");

            transaction = new StellarBase.TransactionBuilder(source)
                .addOperation(StellarBase.Operation.payment({
                    destination: destination,
                    asset: asset,
                    amount: amount
                }))
                .addMemo(memo)
                .build();
        });

        it("should have the same source account", function (done) {
            expect(transaction.source)
                .to.be.equal(source.accountId());
            done()
        });

        it("should have the incremented sequence number", function (done) {
            expect(transaction.sequence).to.be.equal("1");
            done();
        });

        it("should increment the account's sequence number", function (done) {
            expect(source.sequenceNumber()).to.be.equal("1");
            done();
        });

        it("should have one payment operation", function (done) {
            expect(transaction.operations.length).to.be.equal(1);
            expect(transaction.operations[0].type).to.be.equal("payment");
            done();
        });

        it("should have 100 stroops fee", function (done) {
            expect(transaction.fee).to.be.equal(100);
            done();
        });
    });

    describe("constructs a native payment transaction with two operations", function() {
        var source;
        var destination1;
        var amount1;
        var destination2;
        var amount2;
        var asset;
        var transaction;
        beforeEach(function () {
            asset = StellarBase.Asset.native();
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");

            destination1 = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
            amount1 = "1000";
            destination2 = "GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2";
            amount2 = "2000";


            transaction = new StellarBase.TransactionBuilder(source)
              .addOperation(StellarBase.Operation.payment({
                  destination: destination1,
                  asset: asset,
                  amount: amount1
              }))
              .addOperation(StellarBase.Operation.payment({
                  destination: destination2,
                  asset: asset,
                  amount: amount2
              }))
              .build();
        });

        it("should have the same source account", function (done) {
            expect(transaction.source)
              .to.be.equal(source.accountId());
            done()
        });

        it("should have the incremented sequence number", function (done) {
            expect(transaction.sequence).to.be.equal("1");
            done();
        });

        it("should increment the account's sequence number", function (done) {
            expect(source.sequenceNumber()).to.be.equal("1");
            done();
        });

        it("should have two payment operation", function (done) {
            expect(transaction.operations.length).to.be.equal(2);
            expect(transaction.operations[0].type).to.be.equal("payment");
            expect(transaction.operations[1].type).to.be.equal("payment");
            done();
        });

        it("should have 200 stroops fee", function (done) {
            expect(transaction.fee).to.be.equal(200);
            done();
        });
    });

    describe("constructs a native payment transaction with custom base fee", function() {
        var source;
        var destination1;
        var amount1;
        var destination2;
        var amount2;
        var asset;
        var transaction;
        beforeEach(function () {
            asset = StellarBase.Asset.native();
            source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");

            destination1 = "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2";
            amount1 = "1000";
            destination2 = "GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2";
            amount2 = "2000";


            transaction = new StellarBase.TransactionBuilder(source, {fee: 1000})
              .addOperation(StellarBase.Operation.payment({
                  destination: destination1,
                  asset: asset,
                  amount: amount1
              }))
              .addOperation(StellarBase.Operation.payment({
                  destination: destination2,
                  asset: asset,
                  amount: amount2
              }))
              .build();
        });


        it("should have 2000 stroops fee", function (done) {
            expect(transaction.fee).to.be.equal(2000);
            done();
        });
    });

    describe("constructs a native payment transaction with timebounds", function() {
        it("should have have timebounds", function (done) {
            let source = new StellarBase.Account("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ", "0");
            let timebounds = {
                minTime: "1455287522",
                maxTime: "1455297545"
            };
            let transaction = new StellarBase.TransactionBuilder(source, {timebounds})
              .addOperation(StellarBase.Operation.payment({
                  destination: "GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2",
                  asset: StellarBase.Asset.native(),
                  amount: "1000"
              }))
              .build();

            expect(transaction.timeBounds.minTime).to.be.equal(timebounds.minTime);
            expect(transaction.timeBounds.maxTime).to.be.equal(timebounds.maxTime);
            done();
        });
    });
});
