describe('Currency', function() {

    describe("constructor", function () {

        it("throws an error when there's no issuer for non XLM type currency", function () {
            expect(() => new StellarBase.Currency("USD")).to.throw()
        });
    })

    describe("toXdrObject()", function () {
        it("parses a native currency object", function () {
            var currency = new StellarBase.Currency.native();
            var xdr = currency.toXdrObject();
            expect(xdr.toXDR().toString()).to.be.equal(new Buffer([0,0,0,0]).toString());
        });

        it("parses a ISO4217 currency object", function () {
            var currency = new StellarBase.Currency("USD", "GAV4RUTR7VDXTBM7HACQBEDD6Y5CHJVYWFIGPCYEKKSS6TRDYIAPHUYV");
            var xdr = currency.toXdrObject();

            expect(xdr).to.be.instanceof(StellarBase.xdr.Currency);
            expect(() => xdr.toXDR('hex')).to.not.throw();
        });
    });
});
