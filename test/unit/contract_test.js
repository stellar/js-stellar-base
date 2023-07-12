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

    it('converts strkeys to hex', function () {
      let contractId =
        'CDYFWOUPJCGPFU2CS33BZSEUD7INMFKXKJ25TIMRUHQGAFISBVM2D7J6';
      let contract = new StellarBase.Contract(contractId);
      let expected =
        'f05b3a8f488cf2d34296f61cc8941fd0d615575275d9a191a1e06015120d59a1';
      expect(contract.contractId('hex')).to.equal(expected);
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
          contract: contract.address().toScAddress(),
          key: StellarBase.xdr.ScVal.scvLedgerKeyContractInstance(),
          durability: StellarBase.xdr.ContractDataDurability.persistent(),
          bodyType: StellarBase.xdr.ContractEntryBodyType.dataEntry()
        })
      )
        .toXDR()
        .toString('base64');
      expect(fp.toXDR().toString('base64')).to.equal(expected);
    });
  });

  describe('call', function () {
    let contractId = '0'.repeat(63) + '1';
    let call = new StellarBase.Contract(contractId).call(
      'method',
      StellarBase.xdr.ScVal.scvU32(123)
    );
    let args = call
      .body()
      .invokeHostFunctionOp()
      .hostFunction()
      .invokeContract();

    it('passes the contract id as an ScAddress', function () {
      expect(args[0]).to.deep.equal(
        StellarBase.Address.contract(Buffer.from(contractId, 'hex')).toScVal()
      );
    });

    it('passes the method name as the second arg', function () {
      expect(args[1]).to.deep.equal(StellarBase.xdr.ScVal.scvSymbol('method'));
    });

    it('passes all params after that', function () {
      expect(args[2]).to.deep.equal(StellarBase.xdr.ScVal.scvU32(123));
    });
  });
});
