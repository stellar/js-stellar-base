describe('Contract', function () {
  describe('constructor', function () {
    it('parses strkeys', function () {
      let contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
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
        new StellarBase.Contract('foobar')
      }).to.throw();
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
});
