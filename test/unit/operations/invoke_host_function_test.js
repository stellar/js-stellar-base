const { Asset, Contract, Operation, hash, nativeToScVal } = StellarBase;

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
            args: [nativeToScVal('world')]
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
          args: [nativeToScVal('world')]
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

      it('lets you create contracts with a constructor', function () {
        const h = hash(Buffer.from('random stuff'));
        const constructorArgs = [
          // note: using a string here doesn't work because once the operation
          // is encoded/decoded it will be a Buffer internally and it'd be a
          // mild pain in the ass to check equivalence
          nativeToScVal(Buffer.from('admin name')),
          nativeToScVal(1234, { type: 'i128' })
        ];

        const op = Operation.createConstructableContract({
          address: this.c.address(),
          constructorArgs,
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
          'hostFunctionTypeCreateContractV2'
        );

        // check deep inner field to ensure RT
        expect(
          decodedOp.func
            .createContractV2()
            .contractIdPreimage()
            .fromAddress()
            .salt()
        ).to.eql(h, "hashes don't match");

        // check deep inner field to ensure ctor args match
        const ctorArgs = decodedOp.func.createContractV2().constructorArgs();
        expect(ctorArgs).to.eql(
          constructorArgs,
          `constructor parameters don't match: ${JSON.stringify(
            ctorArgs,
            null,
            2
          )} vs. ${JSON.stringify(constructorArgs, null, 2)}`
        );
        expect(decodedOp.auth).to.be.empty;
      });
    });
  });
});
