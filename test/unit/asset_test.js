describe('Asset', function() {

    describe("constructor", function () {

        it("throws an error when there's no issuer for non XLM type asset", function () {
            expect(() => new StellarBase.Asset("USD")).to.throw()
        });
    })

    describe("toXdrObject()", function () {
        it("parses a native asset object", function () {
            var asset = new StellarBase.Asset.native();
            var xdr = asset.toXdrObject();
            expect(xdr.toXDR().toString()).to.be.equal(new Buffer([0,0,0,0]).toString());
        });

        it("parses a ISO4217 asset object", function () {
            var asset = new StellarBase.Asset("USD", "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ");
            var xdr = asset.toXdrObject();

            expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
            expect(() => xdr.toXDR('hex')).to.not.throw();
        });
    });
});
