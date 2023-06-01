describe('Contract', function () {
  describe('constructor', function () {
    it('parses strkeys', function () {
      let contractId =
        'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
      let contract = new StellarBase.Contract(contractId);
      expect(contract.contractId('strkey')).to.equal(contractId);
    });

    it('parses hex addresses', function () {
      let contractId = '0'.repeat(63) + '1';
      let contract = new StellarBase.Contract(contractId);
      expect(contract.contractId('hex')).to.equal(contractId);
    });

    it('parses throws on invalid ids', function () {
      expect(() => {
        new StellarBase.Contract('foobar');
      }).to.throw();
    });
  });

  describe('address', function () {
    it('returns the contract address', function () {
      let contractId = '0'.repeat(63) + '1';
      let contract = new StellarBase.Contract(contractId);
      expect(contract.address().toBuffer().toString('hex')).to.equal(
        contractId
      );
    });
  });

  describe('getFootprint', function () {
    it('includes the correct contract code footprint', function () {
      let contractId = '0'.repeat(63) + '1';
      let contract = new StellarBase.Contract(contractId);
      expect(contract.contractId('hex')).to.equal(contractId);

      const fp = contract.getFootprint();

      let expected = new StellarBase.xdr.LedgerKey.contractData(
        new StellarBase.xdr.LedgerKeyContractData({
          contractId: Buffer.from(contractId, 'hex'),
          key: StellarBase.xdr.ScVal.scvLedgerKeyContractExecutable()
        })
      )
        .toXDR()
        .toString('base64');
      expect(fp.toXDR().toString('base64')).to.equal(expected);
    });
  });

  // describe('call', function() {
  //   it('should create an XDR operation', function() {
  //     const kp = StellarBase.Keypair.random();
  //     const account = new StellarBase.Account(kp.publicKey(), "1");
  //     const contractId = '0'.repeat(63) + '1';

  //     let contract = new StellarBase.Contract(contractId);

  //     const callOp = contract.call("balance", ...[
  //       new StellarBase.Address(kp.publicKey()).toScVal()
  //     ]);
  //     console.log(callOp);
  //     console.log(callOp.toXDR());

  //     let builder = new StellarBase.TransactionBuilder(account, {
  //       fee: "1000",
  //       timebounds: { minTime: 0, maxTime: 0 },
  //       networkPassphrase: StellarBase.Networks.FUTURENET,
  //     });

  //     const txXdr = builder.addOperation(callOp).build();
  //     const txB64 = txXdr.toXDR();
  //     console.log(txB64);

  //     const txRt = StellarBase.TransactionBuilder.fromXDR(txB64,
  //       StellarBase.Networks.FUTURENET);
  //     console.log(txRt);
  //   });
  // });
});
