const { Contract, xdr } = StellarBase;
const NULL_ADDRESS = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM';

describe('Contract', function () {
  describe('constructor', function () {
    it('parses strkeys', function () {
      let contractId =
        'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
      let contract = new Contract(contractId);
      expect(contract.contractId('strkey')).to.equal(contractId);
    });

    it('throws on obsolete hex ids', function () {
      expect(() => new Contract('0'.repeat(63) + '1')).to.throw();
    });

    it('throws on invalid ids', function () {
      expect(() => new Contract('foobar')).to.throw();
    });
  });

  describe('address', function () {
    it('returns the contract address', function () {
      let contract = new Contract(NULL_ADDRESS);
      expect(contract.address().toString()).to.equal(NULL_ADDRESS);
    });
  });

  describe('getFootprint', function () {
    it('includes the correct contract ledger keys', function () {
      let contract = new Contract(NULL_ADDRESS);
      expect(contract.contractId()).to.equal(NULL_ADDRESS);

      const actual = contract.getFootprint();
      const expected = [
        new xdr.LedgerKey.contractCode(
          new xdr.LedgerKeyContractCode({
            hash: StellarBase.StrKey.decodeContract(contract.contractId())
          })
        ),
        new xdr.LedgerKey.contractData(
          new xdr.LedgerKeyContractData({
            contract: contract.address().toScAddress(),
            key: xdr.ScVal.scvLedgerKeyContractInstance(),
            durability: xdr.ContractDataDurability.persistent()
          })
        )
      ];

      expect(actual).to.eql(expected);
    });
  });

  describe('call', function () {
    const contract = new Contract(NULL_ADDRESS);
    let call = contract.call(
      'method',
      StellarBase.nativeToScVal('arg!'),
      StellarBase.nativeToScVal(2, { type: 'i32' }),
    );

    it('builds valid XDR', function () {
      call.toXDR();
    });

    let args = call
      .body()
      .invokeHostFunctionOp()
      .hostFunction()
      .invokeContract();

    it('passes the contract id as an ScAddress', function () {
      expect(args.contractAddress()).to.deep.equal(
        new Contract(NULL_ADDRESS).address().toScAddress()
      );
    });

    it('passes the method name as the second arg', function () {
      expect(args.functionName()).to.deep.equal(xdr.ScVal.scvSymbol('method'));
    });

    it('passes all params after that', function () {
      expect(args.args()).to.deep.equal([
        xdr.ScVal.scvString('arg!'),
        xdr.ScVal.scvI32(2)
      ]);
    });

    it('works with no parameters', function () {
      contract.call('empty').toXDR();
    });
  });
});
