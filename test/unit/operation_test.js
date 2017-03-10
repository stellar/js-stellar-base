import BigNumber from 'bignumber.js';
import crypto from 'crypto';
import isString from 'lodash/isString';

describe('Operation', function() {

    describe(".createAccount()", function () {
        it("creates a createAccountOp", function () {
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var startingBalance = '1000';
            let op = StellarBase.Operation.createAccount({destination, startingBalance});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("createAccount");
            expect(obj.destination).to.be.equal(destination);
            expect(operation.body().value().startingBalance().toString()).to.be.equal('10000000000');
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
            expect(() => StellarBase.Operation.createAccount(opts)).to.throw(/startingBalance argument must be of type String, represent a positive number and have at most 7 digits after the decimal/)
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
            var asset = new StellarBase.Asset("USDUSD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.payment({destination, asset, amount});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("payment");
            expect(obj.destination).to.be.equal(destination);
            expect(operation.body().value().amount().toString()).to.be.equal('10000000000');
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
            var sendMax = '3.007';
            var destination = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ";
            var destAsset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            var destAmount = '3.1415';
            var path = [
                new StellarBase.Asset('USD', 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB'),
                new StellarBase.Asset('EUR', 'GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL')
            ];
            let op = StellarBase.Operation.pathPayment({sendAsset, sendMax, destination, destAsset, destAmount, path});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("pathPayment");
            expect(obj.sendAsset.equals(sendAsset)).to.be.true;
            expect(operation.body().value().sendMax().toString()).to.be.equal('30070000');
            expect(obj.sendMax).to.be.equal(sendMax);
            expect(obj.destination).to.be.equal(destination);
            expect(obj.destAsset.equals(destAsset)).to.be.true;
            expect(operation.body().value().destAmount().toString()).to.be.equal('31415000');
            expect(obj.destAmount).to.be.equal(destAmount);
            expect(obj.path[0].getCode()).to.be.equal('USD');
            expect(obj.path[0].getIssuer()).to.be.equal('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');
            expect(obj.path[1].getCode()).to.be.equal('EUR');
            expect(obj.path[1].getIssuer()).to.be.equal('GDTNXRLOJD2YEBPKK7KCMR7J33AAG5VZXHAJTHIG736D6LVEFLLLKPDL');
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
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line).to.be.deep.equal(asset);
            expect(operation.body().value().limit().toString()).to.be.equal('9223372036854775807'); // MAX_INT64
            expect(obj.limit).to.be.equal("922337203685.4775807");
        });

        it("creates a changeTrustOp with limit", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset, limit: "50"});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("changeTrust");
            expect(obj.line).to.be.deep.equal(asset);
            expect(operation.body().value().limit().toString()).to.be.equal('500000000');
            expect(obj.limit).to.be.equal("50");
        });

        it("deletes a trustline", function () {
            let asset = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            let op = StellarBase.Operation.changeTrust({asset: asset, limit: "0"});
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
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
            var obj = StellarBase.Operation.fromXDRObject(operation);
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
        it("auth flags are set correctly", function () {
            expect(StellarBase.AuthRequiredFlag).to.be.equal(1);
            expect(StellarBase.AuthRevocableFlag).to.be.equal(2);
            expect(StellarBase.AuthImmutableFlag).to.be.equal(4);
        });

        it("creates a setOptionsOp", function () {
            var opts = {};
            opts.inflationDest = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
            opts.clearFlags = StellarBase.AuthRevocableFlag | StellarBase.AuthImmutableFlag;
            opts.setFlags = StellarBase.AuthRequiredFlag;
            opts.masterWeight = 0;
            opts.lowThreshold = 1;
            opts.medThreshold = 2;
            opts.highThreshold = 3;

            opts.signer = {
                ed25519PublicKey: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
                weight: 1
            };
            opts.homeDomain = "www.example.com";
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expect(obj.type).to.be.equal("setOptions");
            expect(obj.inflationDest).to.be.equal(opts.inflationDest);
            expect(obj.clearFlags).to.be.equal(6);
            expect(obj.setFlags).to.be.equal(1);
            expect(obj.masterWeight).to.be.equal(opts.masterWeight);
            expect(obj.lowThreshold).to.be.equal(opts.lowThreshold);
            expect(obj.medThreshold).to.be.equal(opts.medThreshold);
            expect(obj.highThreshold).to.be.equal(opts.highThreshold);

            expect(obj.signer.ed25519PublicKey).to.be.equal(opts.signer.ed25519PublicKey);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
            expect(obj.homeDomain).to.be.equal(opts.homeDomain);
        });

        it("creates a setOptionsOp with preAuthTx signer", function () {
            var opts = {};

            var hash = crypto.createHash('sha256').update("Tx hash").digest();

            opts.signer = {
                preAuthTx: hash,
                weight: 10
            };
            
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expectBuffersToBeEqual(obj.signer.preAuthTx, hash);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
        });

        it("creates a setOptionsOp with preAuthTx signer from a hex string", function () {
            var opts = {};

            var hash = crypto.createHash('sha256').update("Tx hash").digest('hex');
            expect(isString(hash)).to.be.true

            opts.signer = {
                preAuthTx: hash,
                weight: 10
            };

            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expectBuffersToBeEqual(obj.signer.preAuthTx, hash);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
        });

        it("creates a setOptionsOp with hash signer", function () {
            var opts = {};

            var hash = crypto.createHash('sha256').update("Hash Preimage").digest();

            opts.signer = {
                sha256Hash: hash,
                weight: 10
            };
            
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expectBuffersToBeEqual(obj.signer.sha256Hash, hash);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
        });

        it("creates a setOptionsOp with hash signer from a hex string", function () {
            var opts = {};

            var hash = crypto.createHash('sha256').update("Hash Preimage").digest('hex');
            expect(isString(hash)).to.be.true

            opts.signer = {
                sha256Hash: hash,
                weight: 10
            };

            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expectBuffersToBeEqual(obj.signer.sha256Hash, hash);
            expect(obj.signer.weight).to.be.equal(opts.signer.weight);
        });

        it("string setFlags", function() {
            let opts = {
                setFlags: '4'
            };
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expect(obj.type).to.be.equal("setOptions");
            expect(obj.setFlags).to.be.equal(4);
        });

        it("fails to create setOptions operation with an invalid setFlags", function () {
            let opts = {
                setFlags: {}
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw();
        });

        it("string clearFlags", function() {
            let opts = {
                clearFlags: '4'
            };
            let op = StellarBase.Operation.setOptions(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);

            expect(obj.type).to.be.equal("setOptions");
            expect(obj.clearFlags).to.be.equal(4);
        });

        it("fails to create setOptions operation with an invalid clearFlags", function () {
            let opts = {
                clearFlags: {}
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw();
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
                    ed25519PublicKey: "GDGU5OAPHNPU5UCL",
                    weight: 1
                }
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/signer.ed25519PublicKey is invalid/)
        });

        it("fails to create setOptions operation with multiple signer values", function () {
            let opts = {
                signer: {
                    ed25519PublicKey: "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7",
                    sha256Hash: new Buffer(32),
                    weight: 1
                }
            };
            expect(() => StellarBase.Operation.setOptions(opts)).to.throw(/Signer object must contain exactly one/)
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
        it("creates a manageOfferOp (string price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '3.123456';
            opts.price = '8.141592';
            opts.offerId = '1';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('31234560');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(obj.offerId).to.be.equal(opts.offerId);
        });
        it("creates a manageOfferOp (price fraction)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '3.123456';
            opts.price = {
                n: 11,
                d: 10
            }
            opts.offerId = '1';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.price).to.be.equal(new BigNumber(opts.price.n).div(opts.price.d).toString());
        });

        it("creates an invalid manageOfferOp (price fraction)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '3.123456';
            opts.price = {
                n: 11,
                d: -1
            }
            opts.offerId = '1';
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/price must be positive/)
        });
        it("creates a manageOfferOp (number price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '3.123456';
            opts.price = 3.07;
            opts.offerId = 1;
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.price).to.be.equal(opts.price.toString());
        });

        it("creates a manageOfferOp (BigNumber price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '3.123456';
            opts.price = new BigNumber(5).dividedBy(4);
            opts.offerId = '1';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.price).to.be.equal("1.25");
        });

        it("creates a manageOfferOp with no offerId", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '1000';
            opts.price = '3.141592';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('10000000000');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(obj.offerId).to.be.equal('0'); // 0=create a new offer, otherwise edit an existing offer
        });

        it("cancels offer", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '0';
            opts.price = '3.141592';
            opts.offerId = '1';
            let op = StellarBase.Operation.manageOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('0');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
            expect(obj.offerId).to.be.equal('1'); // 0=create a new offer, otherwise edit an existing offer
        });

        it("fails to create manageOffer operation with an invalid amount", function () {
            let opts = {
                amount: 20,
                price: '10',
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

        it("fails to create manageOffer operation with negative price", function () {
            let opts = {
                amount: '20',
                price: '-1',
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/price must be positive/)
        });

        it("fails to create manageOffer operation with invalid price", function () {
            let opts = {
                amount: '20',
                price: 'test',
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.manageOffer(opts)).to.throw(/not a number/)
        });
    });

    describe(".createPassiveOffer", function () {
        it("creates a createPassiveOfferOp (string price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '11.27827';
            opts.price = '3.07';
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('112782700');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price);
        });

        it("creates a createPassiveOfferOp (number price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '11.27827';
            opts.price = 3.07;
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('112782700');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal(opts.price.toString());
        });

        it("creates a createPassiveOfferOp (BigNumber price)", function () {
            var opts = {};
            opts.selling = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.buying = new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7");
            opts.amount = '11.27827';
            opts.price = new BigNumber(5).dividedBy(4);
            let op = StellarBase.Operation.createPassiveOffer(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("createPassiveOffer");
            expect(obj.selling.equals(opts.selling)).to.be.true;
            expect(obj.buying.equals(opts.buying)).to.be.true;
            expect(operation.body().value().amount().toString()).to.be.equal('112782700');
            expect(obj.amount).to.be.equal(opts.amount);
            expect(obj.price).to.be.equal('1.25');
        });

        it("fails to create createPassiveOffer operation with an invalid amount", function () {
            let opts = {
                amount: 20,
                price: '10',
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

        it("fails to create createPassiveOffer operation with negative price", function () {
            let opts = {
                amount: '20',
                price: '-2',
                selling: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7"),
                buying: new StellarBase.Asset("USD", "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7")
            };
            expect(() => StellarBase.Operation.createPassiveOffer(opts)).to.throw(/price must be positive/)
        });
    });

    describe(".accountMerge", function () {
        it("creates a accountMergeOp", function () {
            var opts = {};
            opts.destination = "GDGU5OAPHNPU5UCLE5RDJHG7PXZFQYWKCFOEXSXNMR6KRQRI5T6XXCD7";
            let op = StellarBase.Operation.accountMerge(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
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
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("inflation");
        });
    });

    describe(".manageData", function () {
        it("creates a manageDataOp with string value", function () {
            var opts = {
                name: "name",
                value: "value"
            };
            let op = StellarBase.Operation.manageData(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageData");
            expect(obj.name).to.be.equal(opts.name);
            expect(obj.value.toString('hex')).to.be.equal(new Buffer(opts.value).toString('hex'));
        });

        it("creates a manageDataOp with Buffer value", function () {
            var opts = {
                name: "name",
                value: new Buffer("value")
            };
            let op = StellarBase.Operation.manageData(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageData");
            expect(obj.name).to.be.equal(opts.name);
            expect(obj.value.toString('hex')).to.be.equal(opts.value.toString('hex'));
        });

        it("creates a manageDataOp with null dataValue", function () {
            var opts = {
                name: "name",
                value: null
            };
            let op = StellarBase.Operation.manageData(opts);
            var xdr = op.toXDR("hex");
            var operation = StellarBase.xdr.Operation.fromXDR(new Buffer(xdr, "hex"));
            var obj = StellarBase.Operation.fromXDRObject(operation);
            expect(obj.type).to.be.equal("manageData");
            expect(obj.name).to.be.equal(opts.name);
            expect(obj.value).to.be.undefined;
        });

        describe("fails to create manageData operation", function () {
            it("name is not a string", function () {
                expect(() => StellarBase.Operation.manageData({name: 123})).to.throw()
            });

            it("name is too long", function () {
                expect(() => StellarBase.Operation.manageData({name: "a".repeat(65)})).to.throw()
            });

            it("value is too long", function () {
                expect(() => StellarBase.Operation.manageData({name: "a", value: new Buffer(65)})).to.throw()
            });
        });
    });

    describe("._checkUnsignedIntValue()", function () {
        it("returns true for valid values", function () {
            let values = [
                {value: 0, expected: 0},
                {value: 10, expected: 10},
                {value: "0", expected: 0},
                {value: "10", expected: 10},
                {value: undefined, expected: undefined}
            ];

            for (var i in values) {
                let {value, expected} = values[i];
                expect(StellarBase.Operation._checkUnsignedIntValue(value, value)).to.be.equal(expected);
            }
        });

        it("throws error for invalid values", function () {
            let values = [
                {},
                [],
                "", // empty string
                "test", // string not representing a number
                "0.5",
                "-10",
                "-10.5",
                "Infinity",
                Infinity,
                "Nan",
                NaN
            ];

            for (var i in values) {
                let value = values[i];
                expect(() => StellarBase.Operation._checkUnsignedIntValue(value, value)).to.throw();
            }
        });

        it("return correct values when isValidFunction is set", function () {
            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", undefined, value => value < 10)
            ).to.equal(undefined);

            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", 8, value => value < 10)
            ).to.equal(8);
            expect(
                StellarBase.Operation._checkUnsignedIntValue("test", "8", value => value < 10)
            ).to.equal(8);

            expect(() => {
                StellarBase.Operation._checkUnsignedIntValue("test", 12, value => value < 10);
            }).to.throw();
            expect(() => {
                StellarBase.Operation._checkUnsignedIntValue("test", "12", value => value < 10);
            }).to.throw();
        });
    });

    describe(".isValidAmount()", function () {
        it("returns true for valid amounts", function () {
            let amounts = [
              "10",
              "0.10",
              "0.1234567",
              "922337203685.4775807" // MAX
            ];

            for (var i in amounts) {
                expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.true;
            }
        });

        it("returns false for invalid amounts", function () {
            let amounts = [
                100, // integer
                100.50, // float
                "", // empty string
                "test", // string not representing a number
                "0",
                "-10",
                "-10.5",
                "0.12345678",
                "922337203685.4775808", // Overflow
                "Infinity",
                Infinity,
                "Nan",
                NaN
            ];

            for (var i in amounts) {
                expect(StellarBase.Operation.isValidAmount(amounts[i])).to.be.false;
            }
        });

        it("allows 0 only if allowZero argument is set to true", function () {
            expect(StellarBase.Operation.isValidAmount("0")).to.be.false;
            expect(StellarBase.Operation.isValidAmount("0", true)).to.be.true;
        });
    });
});

function expectBuffersToBeEqual(left, right) {
    let leftHex = left.toString('hex');
    let rightHex = right.toString('hex');
    expect(leftHex).to.eql(rightHex);
}
