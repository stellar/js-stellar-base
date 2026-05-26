function buildClaimableBalanceResult() {
  const balanceId = StellarBase.xdr.ClaimableBalanceId.claimableBalanceIdTypeV0(
    Buffer.from(
      '536af35c666a28d26775008321655e9eda2039154270484e3f81d72c66d5c26f',
      'hex'
    )
  );

  const createClaimableBalanceResult =
    StellarBase.xdr.CreateClaimableBalanceResult.createClaimableBalanceSuccess(
      balanceId
    );
  const operationResultTr =
    StellarBase.xdr.OperationResultTr.createClaimableBalance(
      createClaimableBalanceResult
    );
  const operationResult = StellarBase.xdr.OperationResult.opInner(
    operationResultTr
  );

  return {
    balanceId,
    operationResult
  };
}

function buildTransactionResult(result) {
  return new StellarBase.xdr.TransactionResult({
    feeCharged: StellarBase.xdr.Int64.fromString('100'),
    result,
    ext: new StellarBase.xdr.TransactionResultExt(0)
  });
}

describe('StellarBase#getClaimableBalanceIdFromResult()', function () {
  it('extracts the claimable balance ID from a result XDR string', function () {
    const { balanceId, operationResult } = buildClaimableBalanceResult();
    const transactionResult = buildTransactionResult(
      StellarBase.xdr.TransactionResultResult.txSuccess([operationResult])
    );

    expect(
      StellarBase.getClaimableBalanceIdFromResult(
        transactionResult.toXDR('base64')
      )
    ).to.equal(balanceId.toXDR('hex'));
  });

  it('extracts the claimable balance ID from a TransactionResult object', function () {
    const { balanceId, operationResult } = buildClaimableBalanceResult();
    const transactionResult = buildTransactionResult(
      StellarBase.xdr.TransactionResultResult.txSuccess([operationResult])
    );

    expect(
      StellarBase.getClaimableBalanceIdFromResult(transactionResult)
    ).to.equal(balanceId.toXDR('hex'));
  });

  it('extracts the claimable balance ID from a successful fee bump inner result', function () {
    const { balanceId, operationResult } = buildClaimableBalanceResult();
    const innerResult = new StellarBase.xdr.InnerTransactionResult({
      feeCharged: StellarBase.xdr.Int64.fromString('100'),
      result: StellarBase.xdr.InnerTransactionResultResult.txSuccess([
        operationResult
      ]),
      ext: new StellarBase.xdr.InnerTransactionResultExt(0)
    });
    const innerResultPair = new StellarBase.xdr.InnerTransactionResultPair({
      transactionHash: Buffer.alloc(32),
      result: innerResult
    });
    const transactionResult = buildTransactionResult(
      StellarBase.xdr.TransactionResultResult.txFeeBumpInnerSuccess(
        innerResultPair
      )
    );

    expect(
      StellarBase.getClaimableBalanceIdFromResult(transactionResult)
    ).to.equal(balanceId.toXDR('hex'));
  });

  it('throws when the operation index is invalid', function () {
    const { operationResult } = buildClaimableBalanceResult();
    const transactionResult = buildTransactionResult(
      StellarBase.xdr.TransactionResultResult.txSuccess([operationResult])
    );

    expect(() =>
      StellarBase.getClaimableBalanceIdFromResult(transactionResult, -1)
    ).to.throw(/operation index/);
    expect(() =>
      StellarBase.getClaimableBalanceIdFromResult(transactionResult, 1)
    ).to.throw(/operation index/);
  });
});
