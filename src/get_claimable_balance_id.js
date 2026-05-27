import xdr from './xdr';

function parseTransactionResult(transactionResult) {
  if (typeof transactionResult === 'string') {
    return xdr.TransactionResult.fromXDR(transactionResult, 'base64');
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(transactionResult)) {
    return xdr.TransactionResult.fromXDR(transactionResult);
  }

  if (!transactionResult || typeof transactionResult.result !== 'function') {
    throw new TypeError(
      'transactionResult must be a base64 string, Buffer, or xdr.TransactionResult'
    );
  }

  return transactionResult;
}

function getOperationResults(transactionResult) {
  const result = transactionResult.result();
  const resultCode = result.switch().name;

  if (resultCode === 'txSuccess') {
    return result.results();
  }

  if (resultCode === 'txFeeBumpInnerSuccess') {
    return result
      .innerResultPair()
      .result()
      .result()
      .results();
  }

  throw new Error(
    `transaction result does not contain successful operation results: ${resultCode}`
  );
}

/**
 * getClaimableBalanceIdFromResult extracts a successful createClaimableBalance
 * operation's balance ID from a transaction result XDR.
 *
 * @export
 * @param {string|Buffer|xdr.TransactionResult} transactionResult - The transaction
 * result XDR as base64, raw Buffer, or XDR object.
 * @param {number} [opIndex=0] - The operation index containing
 * createClaimableBalance. Defaults to the first operation result.
 *
 * @return {string} the claimable balance ID as a hex string.
 */
export function getClaimableBalanceIdFromResult(
  transactionResult,
  opIndex = 0
) {
  if (!Number.isInteger(opIndex) || opIndex < 0) {
    throw new RangeError(`invalid operation index: ${opIndex}`);
  }

  const operationResults = getOperationResults(
    parseTransactionResult(transactionResult)
  );

  if (opIndex >= operationResults.length) {
    throw new RangeError(
      `invalid operation index: ${opIndex}; valid range is 0..${
        operationResults.length - 1
      }`
    );
  }

  const operationResult = operationResults[opIndex];
  if (operationResult.switch().name !== 'opInner') {
    throw new TypeError(
      `expected successful operation result, got ${operationResult.switch().name}`
    );
  }

  const operationResultTr = operationResult.tr();
  if (operationResultTr.switch().name !== 'createClaimableBalance') {
    throw new TypeError(
      `expected createClaimableBalance result, got ${operationResultTr.switch().name}`
    );
  }

  const createClaimableBalanceResult =
    operationResultTr.createClaimableBalanceResult();
  if (
    createClaimableBalanceResult.switch().name !==
    'createClaimableBalanceSuccess'
  ) {
    throw new TypeError(
      `expected successful createClaimableBalance result, got ${createClaimableBalanceResult.switch().name}`
    );
  }

  return createClaimableBalanceResult.balanceId().toXDR('hex');
}
