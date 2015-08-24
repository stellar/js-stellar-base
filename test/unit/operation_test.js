var assert = require('assert');

describe('Operation', function() {

    describe(".createAccount()", function () {
        it("creates a createAccountOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var startingBalance = 1000;
            let op = StellarBase.Operation.createAccount({
                destination: destination,
                startingBalance: startingBalance
            });
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("createAccount");
            expect(obj.destination).to.be.equal(destination);
            expect(Number(obj.startingBalance)).to.be.equal(startingBalance);
        });
    });

    describe(".payment()", function () {
        it("creates a paymentOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var amount = 1000;
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
            expect(Number(obj.amount)).to.be.equal(amount);
            expect(obj.asset.equals(asset)).to.be.true;
        });
    });

    describe(".pathPayment()", function () {
        it("creates a pathPaymentOp", function() {
            var sendAsset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            var sendMax = 1000;
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var destAsset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            var destAmount = 1000;
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
            expect(Number(obj.sendMax)).to.be.equal(sendMax);
            expect(obj.destination).to.be.equal(destination);
            expect(obj.destAsset.equals(destAsset)).to.be.true;
            expect(Number(obj.destAmount)).to.be.equal(destAmount);
        });
    });

    describe(".changeTrust() without limit", function () {
        it("creates a changeTrustOp", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line.equals(asset)).to.be.true;
        });
    });

    describe(".changeTrust() with limit", function () {
        it("creates a changeTrustOp", function () {
            let asset = new StellarBase.Asset("EUR", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let limit = "1000000";
            let op = StellarBase.Operation.changeTrust({asset: asset, limit:limit});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation._attributes);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line.equals(asset)).to.be.true;
            expect(obj.limit.low.toString()).to.equal(limit);
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
    });

    describe(".manageOffer", function () {
        it("creates a manageOfferOp", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = 1000;
            opts.price = 3.07;
            opts.offerId = 1;
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(Number(obj.amount)).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(Number(obj.offerId)).to.be.equal(opts.offerId);
        });
    });

    describe(".createPassiveOffer", function () {
        it("creates a createPassiveOfferOp", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = 1000;
            opts.price = 3.07;
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.operationToObject(operation);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(Number(obj.amount)).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
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
    describe(".error", function () {
        it("decode manageOfferUnderfunded xdr error", function () {
            var errorXdr = 't1qpS2SGmIWfZXnpmlFsZBt6JYb2+YIUC5RcngrmvCoAAAAAAAAD6P////8AAAABAAAAAAAAAAP////5AAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('xdr error message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage)
        });
        it("decode another manageOfferUnderfunded xdr error", function () {
            var errorXdr = 'ja5QtJgv9qARefYowyUQL9Un+YKGpFcZDa5Q3XNQkYkAAAAAAAAD6P////8AAAABAAAAAAAAAAP////5AAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('xdr error message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage)
        });
        it("decode changeTrustInvalidLimit xdr error", function () {
            var errorXdr = 'WQvVAlmvblK3ZFPMj3FhG2xAR1KYLdhGLxwutQ+srAYAAAAAAAAACv////8AAAABAAAAAAAAAAb////9AAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('xdr error message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage)
        });
        it("decode  changeTrustLowReserve xdr error", function () {
            var errorXdr = 'VrdhysJwnJ3mZw5EgYdKoay0hAtdw62F0fBEVlkwj3YAAAAAAAAD6P////8AAAABAAAAAAAAAAb////8AAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('xdr error message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage)
        });

        it("decode txInsufficientFee xdr error", function () {
            var errorXdr = 'AAAAAAAAAAD////3AAAAAA==';
            var errorMessage = StellarBase.xdr.TransactionResult.fromXDR(new Buffer(errorXdr, "base64"));
            //console.error('sendTransaction message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage);
        });
        
        it("decode tx success", function () {
            var errorXdr = 'fz2tTZxnhbdIoBoHAlt9Xq5/Nnxt8SwLmZTkoRwHVrIAAAAAAAAD6AAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('sendTransaction message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage);
        });
        it("decode trust error", function () {
            var errorXdr = '5nUpzap9LJKXUJ28zYB+ZWLmmDiqKjAa6vOSkxY9DW0AAAAAAAAD6P////8AAAABAAAAAAAAAAb////9AAAAAA==';
            var errorMessage = StellarBase.Transaction.decodeTransactionResultPair(errorXdr);
            //console.error('sendTransaction message\n', JSON.stringify(errorMessage, null, 4));
            assert(errorMessage);
        });

    });
});
