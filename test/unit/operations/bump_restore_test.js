const { Operation, xdr } = StellarBase;

describe('Operation', function () {
  describe('.bumpFootprintExpiration()', function () {
    it('creates operation', function () {
      const op = Operation.bumpFootprintExpiration({
        ledgersToExpire: 1234
      });
      const xdr = op.toXDR('hex');
      const operation = xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal(
        'bumpFootprintExpiration'
      );
      const obj = Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('bumpFootprintExpiration');
      expect(obj.ledgersToExpire).to.equal(1234);

      expect(() => {
        Operation.bumpFootprintExpiration({
          ledgersToExpire: 0
        });
      }).to.throw(/ledger quantity/i);
    });
  });

  describe('.restoreFootprint()', function () {
    it('creates operation', function () {
      const op = Operation.restoreFootprint();
      const xdr = op.toXDR('hex');
      const operation = xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal('restoreFootprint');
      const obj = Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('restoreFootprint');
    });
  });
});
