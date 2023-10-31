const { Operation } = StellarBase;

describe('Operation', function () {
  describe('.extendFootprintTtl()', function () {
    it('creates operation', function () {
      const op = StellarBase.Operation.extendFootprintTtl({ extendTo: 1234 });
      const xdr = op.toXDR('hex');
      const operation = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal('extendFootprintTtl');
      const obj = StellarBase.Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('extendFootprintTtl');
      expect(obj.extendTo).to.equal(1234);

      expect(() => {
        StellarBase.Operation.extendFootprintTtl({ extendTo: 0 });
      }).to.throw(/ledger quantity/i);
    });
  });

  describe('.restoreFootprint()', function () {
    it('creates operation', function () {
      const op = Operation.restoreFootprint();
      const xdr = op.toXDR('hex');
      const operation = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal('restoreFootprint');
      const obj = Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('restoreFootprint');
    });
  });
});
