const { Asset, Contract, Operation, hash } = StellarBase;

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
        )
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

    describe('abstractions', function () {
      it('lets you create custom contracts', function () {
        let op;
        const h = hash(Buffer.from('random stuff'));

        op = Operation.createCustomContract({
          address: this.c.address(),
          wasmHash: h,
          salt: h
        });
        expect(op.body().switch().name).to.equal('invokeHostFunction');

        // round trip back

        const xdr = op.toXDR('hex');
        const xdrOp = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');
        const decodedOp = Operation.fromXDRObject(xdrOp, 'hex');

        expect(decodedOp.type).to.equal('invokeHostFunction');
        expect(decodedOp.func.switch().name).to.equal(
          'hostFunctionTypeCreateContract'
        );
        expect(
          // check deep inner field to ensure RT
          decodedOp.func
            .createContract()
            .contractIdPreimage()
            .fromAddress()
            .salt()
        ).to.eql(h);
        expect(decodedOp.auth).to.be.empty;
      });

      describe('lets you wrap tokens', function () {
        [
          'USD:GCP2QKBFLLEEWYVKAIXIJIJNCZ6XEBIE4PCDB6BF3GUB6FGE2RQ3HDVP',
          Asset.native(),
          new Asset(
            'USD',
            'GCP2QKBFLLEEWYVKAIXIJIJNCZ6XEBIE4PCDB6BF3GUB6FGE2RQ3HDVP'
          )
        ].forEach((asset) => {
          it(`with asset ${asset.toString()}`, function () {
            const op = Operation.createStellarAssetContract({ asset });
            expect(op.body().switch().name).to.equal('invokeHostFunction');

            // round trip back

            const xdr = op.toXDR('hex');
            const xdrOp = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');
            const decodedOp = Operation.fromXDRObject(xdrOp, 'hex');

            expect(decodedOp.type).to.equal('invokeHostFunction');
            expect(decodedOp.func.switch().name).to.equal(
              'hostFunctionTypeCreateContract'
            );
            expect(
              // check deep inner field to ensure RT
              Asset.fromOperation(
                decodedOp.func.createContract().contractIdPreimage().fromAsset()
              ).toString()
            ).to.equal(asset.toString());
            expect(decodedOp.auth).to.be.empty;
          });
        });
      });

      it('lets you upload wasm', function () {
        const wasm = Buffer.alloc(512);
        const op = Operation.uploadContractWasm({ wasm });
        expect(op.body().switch().name).to.equal('invokeHostFunction');

        // round trip back

        const xdr = op.toXDR('hex');
        const xdrOp = StellarBase.xdr.Operation.fromXDR(xdr, 'hex');
        const decodedOp = Operation.fromXDRObject(xdrOp, 'hex');

        expect(decodedOp.type).to.equal('invokeHostFunction');
        expect(decodedOp.func.switch().name).to.equal(
          'hostFunctionTypeUploadContractWasm'
        );
        expect(decodedOp.func.wasm()).to.eql(wasm);
        expect(decodedOp.auth).to.be.empty;
      });
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
