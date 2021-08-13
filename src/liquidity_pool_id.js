import xdr from './generated/stellar-xdr_generated';
import { Asset } from './asset';
import { hash } from './hashing';

/**
 * Compute the Pool ID for a given set of assets, fee and pool type.
 * @see [stellar-core getPoolID](https://github.com/stellar/stellar-core/blob/9f3a48c6a8f1aa77b6043a055d0638661f718080/src/ledger/test/LedgerTxnTests.cpp#L3746-L3751)
 *
 * @export
 * @param {LiquidityPoolType} liquidityPoolType – a number representing the
 * liquidity pool type. It defaults to `0` for constant product type.
 * @param {LiquidityPoolParams.ConstantProduct} liquidityPoolParams – the
 * liquidity pool parameters.
 * @param {Asset} liquidityPoolParams.asseta – the first asset in the Pool, it
 * must respect the rule assetA < assetB.
 * @param {Asset} liquidityPoolParams.assetB – the second asset in the Pool, it
 * must respect the rule assetA < assetB.
 * @param {number} liquidityPoolParams.fee – the liquidity pool fee. For now the
 * only fee supported is `30`.
 * @return {Buffer} the Pool ID buffer. It can be stringfied with `toString('hex')`.
 */

export function liquidityPoolId(liquidityPoolType, liquidityPoolParams) {
  if (!liquidityPoolType) {
    liquidityPoolType = 0;
  }

  if (
    liquidityPoolType !== xdr.LiquidityPoolType.liquidityPoolConstantProduct()
  ) {
    throw new Error('liquidityPoolType is invalid');
  }

  if (!liquidityPoolParams) {
    throw new Error('liquidityPoolParams cannot be empty');
  }

  const { asseta, assetB, fee } = liquidityPoolParams;
  if (!asseta || !(asseta instanceof Asset)) {
    throw new Error('asseta is invalid');
  }
  if (!assetB || !(assetB instanceof Asset)) {
    throw new Error('assetB is invalid');
  }
  if (!fee || fee != LiquidityPoolFeeV18) {
    throw new Error('fee is invalid');
  }

  if (!validateLexicographicalAssetsOrder(asseta, assetB)) {
    throw new Error('assets are not in lexicografichal order');
  }

  const lpTypeData = xdr.LiquidityPoolType.liquidityPoolConstantProduct().toXDR();
  const lpParamsData = new xdr.LiquidityPoolConstantProductParameters({
    asseta: asseta.toXDRObject(),
    assetB: assetB.toXDRObject(),
    fee
  }).toXDR();
  const payload = Buffer.concat([lpTypeData, lpParamsData]);
  const poolId = hash(payload);

  return poolId;
}

/**
 * Validates if assetA < assetB:
 * 1. First compare the type (eg. native before alphanum4 before alphanum12).
 * 2. If the types are equal, compare the assets codes.
 * 3. If the asset codes are equal, compare the issuers.
 *
 * @param {Asset} assetA
 * @param {Asset} assetB
 * @return {boolean} true if assetA < assetB.
 */
export function validateLexicographicalAssetsOrder(assetA, assetB) {
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
  return assetA.getIssuer().localeCompare(assetB.getIssuer()) < 0;
}

export const LiquidityPoolFeeV18 = 30;
