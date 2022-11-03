describe('Contract.call', function() {
  it('includes the contract code footprint', function() {
    let contractId = '00000000000000000000000000000001';
    let contract = new StellarBase.Contract(contractId);
    let call = contract.call('foo');
    let op = call.body().invokeHostFunctionOp();
    let readOnly = op.footprint().readOnly();
    expect(readOnly.length).to.equal(1);
    let expected = new StellarBase.xdr.LedgerKeyContractData({
      contractId,
      key: StellarBase.xdr.ScVal.scvStatic(
        StellarBase.xdr.ScStatic.scsLedgerKeyContractCode()
      )
    })
      .toXDR()
      .toString('base64');
    expect(readOnly[0].toXDR().toString('base64')).to.equal(expected);
  });
});
