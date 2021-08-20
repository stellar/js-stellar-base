import xdr from './generated/stellar-xdr_generated';
import { Asset } from './asset';
import { hash } from './hashing';

// LiquidityPoolFeeV18 is the default liquidity pool fee in protocol v18. It defaults to 30 base points (0.3%).
export const LiquidityPoolFeeV18 = 30;

/**
 * getLiquidityPoolId computes the Pool ID for the given assets, fee and pool type.
 * @see [stellar-core getPoolID](https://github.com/stellar/stellar-core/blob/9f3a48c6a8f1aa77b6043a055d0638661f718080/src/ledger/test/LedgerTxnTests.cpp#L3746-L3751)
 *
 * @export
 * @param {LiquidityPoolType} liquidityPoolType – A number representing the liquidity pool type.
 * @param {LiquidityPoolParameters} liquidityPoolParameters – The liquidity pool parameters.
 * @param {Asset} liquidityPoolParameters.asseta – The first asset in the Pool, it must respect the rule assetA < assetB.
 * @param {Asset} liquidityPoolParameters.assetB – The second asset in the Pool, it must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParameters.fee – The liquidity pool fee. For now the only fee supported is `30`.
 * @return {Buffer} the Pool ID buffer, it can be stringfied with `toString('hex')`.
 */
export function getLiquidityPoolId(
  liquidityPoolType,
  liquidityPoolParameters = {}
) {
  if (liquidityPoolType !== 'constant_product') {
    throw new Error('liquidityPoolType is invalid');
  }

  const { asseta, assetB, fee } = liquidityPoolParameters;
  if (!asseta || !(asseta instanceof Asset)) {
    throw new Error('asseta is invalid');
  }
  if (!assetB || !(assetB instanceof Asset)) {
    throw new Error('assetB is invalid');
  }
  if (!fee || fee !== LiquidityPoolFeeV18) {
    throw new Error('fee is invalid');
  }

  if (!validateLexicographicAssetsOrder(asseta, assetB)) {
    throw new Error('Assets are not in lexicographic order');
  }

  const lpTypeData = xdr.LiquidityPoolType.liquidityPoolConstantProduct().toXDR();
  const lpParamsData = new xdr.LiquidityPoolConstantProductParameters({
    asseta: asseta.toXDRObject(),
    assetB: assetB.toXDRObject(),
    fee
  }).toXDR();
  const payload = Buffer.concat([lpTypeData, lpParamsData]);
  return hash(payload);
}

/**
 * validateLexicographicAssetsOrder validates if assetA < assetB:
 * 1. First compare the type (eg. native before alphanum4 before alphanum12).
 * 2. If the types are equal, compare the assets codes.
 * 3. If the asset codes are equal, compare the issuers.
 *
 * @param {Asset} assetA - The first asset in the lexicographic order.
 * @param {Asset} assetB - The second asset in the lexicographic order.
 * @return {boolean} `true` if assetA < assetB.
 */
export function validateLexicographicAssetsOrder(assetA, assetB) {
  if (!assetA || !(assetA instanceof Asset)) {
    throw new Error('assetA is invalid');
  }
  if (!assetB || !(assetB instanceof Asset)) {
    throw new Error('assetB is invalid');
  }

  if (assetA === assetB) {
    return false;
  }

  // Compare asset types.
  switch (assetA.getAssetType()) {
    case 'native':
      return true;
    case 'credit_alphanum4':
      if (assetB.getAssetType() === 'native') {
        return false;
      }
      if (assetB.getAssetType() === 'credit_alphanum12') {
        return true;
      }
      break;
    case 'credit_alphanum12':
      if (assetB.getAssetType() !== 'credit_alphanum12') {
        return false;
      }
      break;
    default:
      throw new Error('Unexpected asset type');
  }

  // Compare asset codes.
  switch (assetA.getCode().localeCompare(assetB.getCode())) {
    case -1: // assetA < assetB
      return true;
    case 1: // assetA > assetB
      return false;
    default:
      break;
  }

  // Compare asset issuers.
  return assetA.getIssuer().localeCompare(assetB.getIssuer()) === -1;
}
