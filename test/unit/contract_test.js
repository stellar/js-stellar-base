describe('Contract.call', function() {
  it('includes the contract code footprint', function() {
    let contractId =
      '0000000000000000000000000000000000000000000000000000000000000001';
    let contract = new StellarBase.Contract(contractId);
    expect(contract.contractId()).to.equal(contractId);
    let call = contract.call('foo');
    let op = call.body().invokeHostFunctionOp();
    let readOnly = op.footprint().readOnly();
    expect(readOnly.length).to.equal(1);
    let expected = new StellarBase.xdr.LedgerKey.contractData(
      new StellarBase.xdr.LedgerKeyContractData({
        contractId: Buffer.from(contractId, 'hex'),
        key: StellarBase.xdr.ScVal.scvStatic(
          StellarBase.xdr.ScStatic.scsLedgerKeyContractCode()
        )
      })
    )
      .toXDR()
      .toString('base64');
    expect(readOnly[0].toXDR().toString('base64')).to.equal(expected);
  });
});
