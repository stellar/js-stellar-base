describe('Operation', function() {

    describe(".createAccount()", function () {
        it("creates a createAccountOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var startingBalance = '1000';
            let op = StellarBase.Operation.createAccount({
                destination: destination,
                startingBalance: startingBalance
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("createAccount");
            expect(obj.destination).to.be.equal(destination);
            expect(obj.startingBalance).to.be.equal(startingBalance);
        });

        it("fails to create createAccount operation with an invalid destination address", function () {
            let opts = {
                destination: 'GCEZW',
                startingBalance: '20',
                source: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/destination is invalid/)
        });

        it("fails to create createAccount operation with an invalid startingBalance", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                startingBalance: 20,
                source: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/startingBalance argument must be of type String/)
        });

        it("fails to create createAccount operation with an invalid source address", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                startingBalance: '20',
                source: 'GCEZ'
            };
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/Source address is invalid/)
        });
    });

    describe(".payment()", function () {
        it("creates a paymentOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var amount = "1000";
            var asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.payment({
                destination: destination,
                asset: asset,
                amount: amount
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("payment");
            expect(obj.destination).to.be.equal(destination);
            expect(obj.amount).to.be.equal(amount);
            expect(obj.asset.equals(asset)).to.be.true;
        });

        it("fails to create payment operation with an invalid destination address", function () {
            let opts = {
                destination: 'GCEZW',
                asset: StellarBase.Asset.native(),
                amount: '20'
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/destination is invalid/)
        });

        it("fails to create payment operation with an invalid amount", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                asset: StellarBase.Asset.native(),
                amount: 20
            };
            expect(() => StellarBase.Operation.payment(opts)).to.throw(/amount argument must be of type String/)
        });
    });

    describe(".pathPayment()", function () {
        it("creates a pathPaymentOp", function() {
            var sendAsset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            var sendMax = '1000';
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var destAsset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            var destAmount = '1000';
            let op = StellarBase.Operation.pathPayment({
                sendAsset: sendAsset,
                sendMax: sendMax,
                destination: destination,
                destAsset: destAsset,
                destAmount: destAmount
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("pathPayment");
            expect(obj.sendAsset.equals(sendAsset)).to.be.true;
            expect(obj.sendMax).to.be.equal(sendMax);
            expect(obj.destination).to.be.equal(destination);
            expect(obj.destAsset.equals(destAsset)).to.be.true;
            expect(obj.destAmount).to.be.equal(destAmount);
        });

        it("fails to create path payment operation with an invalid destination address", function () {
            let opts = {
                destination: 'GCEZW',
                sendMax: '20',
                destAmount: '50',
                sendAsset: StellarBase.Asset.native(),
                destAsset: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.pathPayment(opts)).to.throw(/destination is invalid/)
        });

        it("fails to create path payment operation with an invalid sendMax", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                sendMax: 20,
                destAmount: '50',
                sendAsset: StellarBase.Asset.native(),
                destAsset: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.pathPayment(opts)).to.throw(/sendMax argument must be of type String/)
        });

        it("fails to create path payment operation with an invalid destAmount", function () {
            let opts = {
                destination: 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
                sendMax: '20',
                destAmount: 50,
                sendAsset: StellarBase.Asset.native(),
                destAsset: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.pathPayment(opts)).to.throw(/destAmount argument must be of type String/)
        });
    });

    describe(".changeTrust()", function () {
        it("creates a changeTrustOp", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line).to.be.deep.equal(asset);
            expect(obj.limit).to.be.equal("9223372036854775807");
        });

        it("creates a changeTrustOp with limit", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset, limit: "50"});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line).to.be.deep.equal(asset);
            expect(obj.limit).to.be.equal("50");
        });

        it("deletes a trustline", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset, limit: "0"});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line).to.be.deep.equal(asset);
            expect(obj.limit).to.be.equal("0");
        });

        it("throws TypeError for incorrect limit argument", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let changeTrust = () => StellarBase.Operation.changeTrust({asset: asset, limit: 0});
            expect(changeTrust).to.throw(TypeError);
        });
    });

    describe(".allowTrust()", function () {
        it("creates a allowTrustOp", function () {
            let trustor = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
            let assetCode = "USD";
            let authorize = true;
            let op = StellarBase.Operation.allowTrust({
                trustor: trustor,
                assetCode: assetCode,
                authorize: authorize
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("allowTrust");
            expect(obj.trustor).to.be.equal(trustor);
            expect(obj.assetCode).to.be.equal(assetCode);
            expect(obj.authorize).to.be.equal(authorize);
        });

        it("fails to create allowTrust operation with an invalid trustor address", function () {
            let opts = {
                trustor: 'GCEZW'
            };
            expect(() => StellarBase.Operation.allowTrust(opts)).to.throw(/trustor is invalid/)
        });
    });

    describe(".setOptions()", function () {
        it("creates a setOptionsOp", function () {
            var opts = {};
            opts.inflationDest = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
            opts.clearFlags = 1;
            opts.setFlags = 1;
            opts.masterWeight = 0;
            opts.lowThreshold = 1;
            opts.medThreshold = 2;
            opts.highThreshold = 3;

            opts.signer = {
                address: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
                weight: 1
            };
            opts.homeDomain = "www.example.com";
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);

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

        it("fails to create setOptions operation with an invalid inflationDest address", function () {
            let opts = {
                inflationDest: 'GCEZW'
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/inflationDest is invalid/)
        });

        it("fails to create setOptions operation with an invalid signer address", function () {
            let opts = {
                signer: {
                    address: "GDGU5OAPHNPU5UCL",
                    weight: 1
                }
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/signer.address is invalid/)
        });

        it("fails to create setOptions operation with an invalid masterWeight", function() {
            let opts = {
                masterWeight: 400
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/masterWeight value must be between 0 and 255/)
        });

        it("fails to create setOptions operation with an invalid lowThreshold", function() {
            let opts = {
                lowThreshold: 400
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/lowThreshold value must be between 0 and 255/)
        });

        it("fails to create setOptions operation with an invalid medThreshold", function() {
            let opts = {
                medThreshold: 400
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/medThreshold value must be between 0 and 255/)
        });

        it("fails to create setOptions operation with an invalid highThreshold", function() {
            let opts = {
                highThreshold: 400
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/highThreshold value must be between 0 and 255/)
        });

        it("fails to create setOptions operation with an invalid homeDomain", function() {
            let opts = {
                homeDomain: 67238
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/homeDomain argument must be of type String/)
        });
    });

    describe(".manageOffer", function () {
        it("creates a manageOfferOp", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '1000';
            opts.price = 3.07;
            opts.offerId = '1';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(obj.offerId).to.be.equal(opts.offerId);
        });

        it("creates a manageOfferOp with no offerId", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '1000';
            opts.price = 3.07;
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(obj.offerId).to.be.equal('0'); // 0=create a new offer, otherwise edit an existing offer
        });

        it("fails to create manageOffer operation with an invalid amount", function () {
            let opts = {
                amount: 20,
                price: 10,
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/amount argument must be of type String/)
        });

        it("fails to create manageOffer operation with missing price", function () {
            let opts = {
                amount: '20',
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/price argument is required/)
        });

        it("fails to create manageOffer operation with an invalid offerId", function () {
            let opts = {
                amount: '20',
                price: 10,
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                offerId: 0
            };
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/offerId argument must be of type String/)
        });
    });

    describe(".createPassiveOffer", function () {
        it("creates a createPassiveOfferOp", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '1000';
            opts.price = 3.07;
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
        });

        it("fails to create createPassiveOffer operation with an invalid amount", function () {
            let opts = {
                amount: 20,
                price: 10,
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.createPassiveOffer(opts)).to.throw(/amount argument must be of type String/)
        });

        it("fails to create createPassiveOffer operation with missing price", function () {
            let opts = {
                amount: '20',
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.createPassiveOffer(opts)).to.throw(/price argument is required/)
        });
    });

    describe(".accountMerge", function () {
        it("creates a accountMergeOp", function () {
            var opts = {};
            opts.destination = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
            let op = StellarBase.Operation.accountMerge(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("accountMerge");
            expect(obj.destination).to.be.equal(opts.destination);
        });

        it("fails to create accountMerge operation with an invalid destination address", function () {
            let opts = {
                destination: 'GCEZW'
            };
            expect(() => StellarBase.Operation.accountMerge(opts)).to.throw(/destination is invalid/)
        });
    });

    describe(".inflation", function () {
        it("creates a inflationOp", function () {
            let op = StellarBase.Operation.inflation();
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("inflation");
        });
    });
});
