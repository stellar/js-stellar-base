describe('Operation', function() {

    describe(".createAccount()", function () {
        it("creates a createAccountOp", function () {
            var destination = "GDK7J46N74A337HHV4VJZKEOSXQRSXZBXLKNNVRGMXVFHAVOMVZF37OH";
            var startingBalance = 1000;
            let op = StellarBase.Operation.createAccount({
                destination: destination,
                startingBalance: startingBalance
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("createAccount");
            expect(obj.destination).to.be.equal(destination);
            expect(Number(obj.startingBalance)).to.be.equal(startingBalance);
        });
    });

    describe(".payment()", function () {
        it("creates a paymentOp", function () {
            var destination = "GB7ANT5Q6PZ6KJGAXGQ63ZX3TM7BBLANJTUJ4SQOAHRVWQL6HNVJPYLZ";
            var amount = 1000;
            var currency = new StellarBase.Currency("USD", "GCXWEXWOVDMNBLLDRX3V3MBOP2AZY5SKJL4RAVCTA7Q64NKTJ6GTEHCQ");
            let op = StellarBase.Operation.payment({
                destination: destination,
                currency: currency,
                amount: amount
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("payment");
            expect(obj.destination).to.be.equal(destination);
            expect(Number(obj.amount)).to.be.equal(amount);
            expect(obj.currency.equals(currency)).to.be.true;
        });
    });

    describe(".pathPayment()", function () {
        it("creates a pathPaymentOp", function() {
            var sendCurrency = new StellarBase.Currency("USD", "GA4NDEGZKVQSXTSQT6TWPONNNKN7ITFRAAOI5QI3A44PWRBKHCDJCRW2");
            var sendMax = 1000;
            var destination = "GBSIVQD4MB3SWZCMRG7NX7ADNEWNF5O4ZVX7IIXS2XD23WJGBEGSQJL6";
            var destCurrency = new StellarBase.Currency("USD", "GCUOUBZS2F2HNYOCSRJTAWOTDQZL6SHZ7LLSHUBMIZLVPL7HKPB4GZUM");
            var destAmount = 1000;
            let op = StellarBase.Operation.pathPayment({
                sendCurrency: sendCurrency,
                sendMax: sendMax,
                destination: destination,
                destCurrency: destCurrency,
                destAmount: destAmount
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("pathPayment");
            expect(obj.sendCurrency.equals(sendCurrency)).to.be.true;
            expect(Number(obj.sendMax)).to.be.equal(sendMax);
            expect(obj.destination).to.be.equal(destination);
            expect(obj.destCurrency.equals(destCurrency)).to.be.true;
            expect(Number(obj.destAmount)).to.be.equal(destAmount);
        });
    });

    describe(".changeTrust()", function () {
        it("creates a changeTrustOp", function () {
            let currency = new StellarBase.Currency("USD", "GD6SLNMPDE42WDZ2PYPURHCWZ44LBAKZKVGF2O6G4DEKSOBMF7GKEPFF");
            let op = StellarBase.Operation.changeTrust({currency: currency});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line.equals(currency)).to.be.true;
        });
    });

    describe(".allowTrust()", function () {
        it("creates a allowTrustOp", function () {
            let trustor = "GCL3U2JMIBQWK766CTC6CBENW3VQS6NM6ZDAOU3QUTA256FN66PTYA27";
            let currencyCode = "USD";
            let authorize = true;
            let op = StellarBase.Operation.allowTrust({
                trustor: trustor,
                currencyCode: currencyCode,
                authorize: authorize
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("allowTrust");
            expect(obj.trustor).to.be.equal(trustor);
            expect(obj.currencyCode).to.be.equal(currencyCode);
            expect(obj.authorize).to.be.equal(authorize);
        });
    });

    describe(".setOptions()", function () {
        it("creates a setOptionsOp", function () {
            var opts = {};
            opts.inflationDest = "GD2AOL7JJJCZJTXCQZV4K2Y7QBS7CHVGQYSIDJCYKQZQW7ZIH57RNKQ6";
            opts.clearFlags = 1;
            opts.setFlags = 1;
            opts.masterWeight = 0;
            opts.lowThreshold = 1;
            opts.medThreshold = 2;
            opts.highThreshold = 3;

            opts.signer = {
                address: "GBKQO4X25JAA7NRPYXKOEDGIUWQT2E6NQZ3ECFHX73J2VSYIY3XTMEIS",
                weight: 1
            };
            opts.homeDomain = "www.example.com";
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);

            expect(obj.type).to.be.equal("setOptions");
            expect(obj.inflationDest).to.be.equal(opts.inflationDest);
            expect(obj.clearFlags).to.be.equal(opts.clearFlags);
            expect(obj.setFlags).to.be.equal(opts.setFlags);
            expect(obj.masterWeight).to.be.equal(opts.masterWeight);
            expect(obj.lowThreshold).to.be.equal(opts.lowThreshold);
            expect(obj.medThreshold).to.be.equal(opts.medThreshold);
            expect(obj.highThreshold).to.be.equal(opts.highThreshold);

            expect(obj.signer.address).to.be.equal(opts.signer.address);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
            expect(obj.homeDomain).to.be.equal(opts.homeDomain);
        });
    });

    describe(".manageOffer", function () {
        it("creates a manageOfferOp", function () {
            var opts = {};
            opts.takerGets = new StellarBase.Currency("USD", "GC26WKQKDEMVTKHK34SXEFB2IBPT32JOA2AGWVUSIJHAZA2XKPZ2Y26Q");
            opts.takerPays = new StellarBase.Currency("USD", "GC26WKQKDEMVTKHK34SXEFB2IBPT32JOA2AGWVUSIJHAZA2XKPZ2Y26Q");
            opts.amount = 1000;
            opts.price = 3.07;
            opts.offerId = 1;
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.takerGets.equals(opts.takerGets)).to.be.true;
            expect(obj.takerPays.equals(opts.takerPays)).to.be.true;
            expect(Number(obj.amount)).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(Number(obj.offerId)).to.be.equal(opts.offerId);
        });
    });

    describe(".createPassiveOffer", function () {
        it("creates a createPassiveOfferOp", function () {
            var opts = {};
            opts.takerGets = new StellarBase.Currency("USD", "GD7YPO22TTSKFOUVUPAYFTDLASANU4OWYXPHKR2OUZDVYEB3C2H455HM");
            opts.takerPays = new StellarBase.Currency("USD", "GD7YPO22TTSKFOUVUPAYFTDLASANU4OWYXPHKR2OUZDVYEB3C2H455HM");
            opts.amount = 1000;
            opts.price = 3.07;
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.takerGets.equals(opts.takerGets)).to.be.true;
            expect(obj.takerPays.equals(opts.takerPays)).to.be.true;
            expect(Number(obj.amount)).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
        });
    });

    describe(".accountMerge", function () {
        it("creates a accountMergeOp", function () {
            var opts = {};
            opts.destination = "GB4WXN5E2SAKP45QP33QOOXWCQ6ZBUHSAVEDEIZDQ3WNFQLUKDXUZOPV";
            let op = StellarBase.Operation.accountMerge(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("accountMerge");
            expect(obj.destination).to.be.equal(opts.destination);
        });
    });

    describe(".inflation", function () {
        it("creates a inflationOp", function () {
            let op = StellarBase.Operation.inflation();
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("inflation");
        });
    });
});
