describe('Contract.getFootprint', function () {
  it('includes the correct contract code footprint', function () {
    let contractId = '0'.repeat(63) + '1';

    let contract = new StellarBase.Contract(contractId);
    expect(contract.contractId()).to.equal(contractId);

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
