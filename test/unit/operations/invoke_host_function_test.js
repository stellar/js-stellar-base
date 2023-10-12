const { Contract, Operation } = StellarBase;

describe('Operation', function () {
  describe('.invokeHostFunction()', function () {
    beforeEach(function () {
      this.contractId =
        'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
      this.c = new Contract(this.contractId);
    });

    it('creates operation', function () {

      const op = Operation.invokeHostFunction({
        auth: [],
        func: StellarBase.xdr.HostFunction.hostFunctionTypeInvokeContract(
          new StellarBase.xdr.InvokeContractArgs({
            contractAddress: this.c.address().toScAddress(),
            functionName: 'hello',
            args: [StellarBase.nativeToScVal('world')]
          })
        ),
      });
      var xdr = op.toXDR('hex');
      var operation = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal('invokeHostFunction');
      var obj = Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('invokeHostFunction');
      expect(obj.func.switch().name).to.equal('hostFunctionTypeInvokeContract');
      expect(obj.auth).to.deep.equal([]);

      expect(
        Operation.invokeContractFunction({
          contract: this.contractId,
          function: 'hello',
          args: [StellarBase.nativeToScVal('world')]
        }).toXDR('hex')
      ).to.eql(xdr);
    });

    it('throws when no func passed', function () {
      expect(() => Operation.invokeHostFunction({ auth: [] })).to.throw(
        /\('func'\) required/
      );
    });
  });

  describe('.bumpFootprintExpiration()', function () {
    it('creates operation', function () {
      const op = Operation.bumpFootprintExpiration({
        ledgersToExpire: 1234
      });
      const xdr = op.toXDR('hex');
      const operation = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');

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
      const operation = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');

      expect(operation.body().switch().name).to.equal('restoreFootprint');
      const obj = Operation.fromXDRObject(operation);
      expect(obj.type).to.be.equal('restoreFootprint');
    });
  });
});
