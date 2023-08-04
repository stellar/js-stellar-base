const NULL_ADDRESS = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';

describe('Contract', function () {
  describe('constructor', function () {
    it('parses strkeys', function () {
      let contractId =
        'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
      let contract = new StellarBase.Contract(contractId);
      expect(contract.contractId('strkey')).to.equal(contractId);
    });

    it('throws on obsolete hex ids', function () {
      expect(() => {
        new StellarBase.Contract('0'.repeat(63) + '1');
      }).to.throw();
    });

    it('throws on invalid ids', function () {
      expect(() => {
        new StellarBase.Contract('foobar');
      }).to.throw();
    });
  });

  describe('address', function () {
    it('returns the contract address', function () {
      let contract = new StellarBase.Contract(NULL_ADDRESS);
      expect(contract.address().toString()).to.equal(NULL_ADDRESS);
    });
  });

  describe('getFootprint', function () {
    it('includes the correct contract code footprint', function () {
      let contract = new StellarBase.Contract(NULL_ADDRESS);
      expect(contract.contractId()).to.equal(NULL_ADDRESS);

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
    let call = new StellarBase.Contract(NULL_ADDRESS).call(
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
        new StellarBase.Contract(NULL_ADDRESS).address().toScVal()
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
