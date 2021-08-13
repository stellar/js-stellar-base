import {
  liquidityPoolId,
  validateLexicographicalAssetsOrder,
  xdr
} from '../../src';
import { LiquidityPoolFeeV18 } from '../../src/liquidity_pool_id';
const liquidityPoolTypeConstantProduct = xdr.LiquidityPoolType.liquidityPoolConstantProduct();

describe('StellarBase#liquidityPoolId', function() {
  it('throws an error if the liquidity pool type is not `0` for constant product', function() {
    expect(() => liquidityPoolId()).to.throw(/liquidityPoolType is invalid/);

    expect(() => liquidityPoolId(1)).to.throw(/liquidityPoolType is invalid/);
  });

  it('throws an error if liquidity pool parameters is missing', function() {
    expect(() => liquidityPoolId(liquidityPoolTypeConstantProduct)).to.throw(
      /liquidityPoolParams cannot be empty/
    );
  });

  it('throws an error if assetA is invalid', function() {
    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, {})
    ).to.throw(/asseta is invalid/);
    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, { asseta: 'random' })
    ).to.throw(/asseta is invalid/);
  });

  it('throws an error if assetB is invalid', function() {
    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, { asseta: assetA })
    ).to.throw(/assetB is invalid/);
    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: assetA,
        assetB: 'random'
      })
    ).to.throw(/assetB is invalid/);
  });

  it('throws an error if fee is invalid', function() {
    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetB = new StellarBase.Asset(
      'USD',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );
    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: assetA,
        assetB
      })
    ).to.throw(/fee is invalid/);
  });

  it('returns poolId correctly', function() {
    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetB = new StellarBase.Asset(
      'USD',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );
    const fee = LiquidityPoolFeeV18;

    const poolId = liquidityPoolId(liquidityPoolTypeConstantProduct, {
      asseta: assetA,
      assetB,
      fee
    });

    expect(poolId).to.be.instanceof(Buffer);
    expect(poolId.toString('hex')).to.equal(
      'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
    );
  });

  it('throws an error if assets are not in lexicografichal order', function() {
    const assetA = new StellarBase.Asset(
      'USD',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );
    const assetB = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const fee = LiquidityPoolFeeV18;

    expect(() =>
      liquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: assetA,
        assetB,
        fee
      })
    ).to.throw(/assets are not in lexicografichal order/);
  });
});

describe('StellarBase#validateLexicographicalAssetsOrder', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(() => validateLexicographicalAssetsOrder()).to.throw(
      /assetA is invalid/
    );

    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(() => validateLexicographicalAssetsOrder(assetA)).to.throw(
      /assetB is invalid/
    );
  });

  it('returns false if assets are equal', function() {
    const XLM = new StellarBase.Asset.native();
    expect(validateLexicographicalAssetsOrder(XLM, XLM)).to.false;
  });

  it('test if asset types are being validated as native < anum4 < anum12', function() {
    const XLM = new StellarBase.Asset.native();
    const anum4 = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const anum12 = new StellarBase.Asset(
      'ARSTANUM12',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(validateLexicographicalAssetsOrder(XLM, XLM)).to.false;
    expect(validateLexicographicalAssetsOrder(XLM, anum4)).to.true;
    expect(validateLexicographicalAssetsOrder(XLM, anum12)).to.true;

    expect(validateLexicographicalAssetsOrder(anum4, XLM)).to.false;
    expect(validateLexicographicalAssetsOrder(anum4, anum4)).to.false;
    expect(validateLexicographicalAssetsOrder(anum4, anum12)).to.true;

    expect(validateLexicographicalAssetsOrder(anum12, XLM)).to.false;
    expect(validateLexicographicalAssetsOrder(anum12, anum4)).to.false;
    expect(validateLexicographicalAssetsOrder(anum12, anum12)).to.false;
  });

  it('test if asset codes are being validated as assetACode < assetBCode', function() {
    const assetARST = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetUSDX = new StellarBase.Asset(
      'USDX',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(validateLexicographicalAssetsOrder(assetARST, assetUSDX)).to.true;
    expect(validateLexicographicalAssetsOrder(assetARST, assetARST)).to.false;

    expect(validateLexicographicalAssetsOrder(assetUSDX, assetARST)).to.false;
    expect(validateLexicographicalAssetsOrder(assetUSDX, assetUSDX)).to.false;
  });

  it('test if asset issuers are being validated as assetAIssuer < assetBIssuer', function() {
    const assetARSTIssuerA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetARSTIssuerB = new StellarBase.Asset(
      'ARST',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );
    expect(
      validateLexicographicalAssetsOrder(assetARSTIssuerA, assetARSTIssuerB)
    ).to.true;
    expect(
      validateLexicographicalAssetsOrder(assetARSTIssuerA, assetARSTIssuerA)
    ).to.false;

    expect(
      validateLexicographicalAssetsOrder(assetARSTIssuerB, assetARSTIssuerA)
    ).to.false;
    expect(
      validateLexicographicalAssetsOrder(assetARSTIssuerB, assetARSTIssuerB)
    ).to.false;
  });
});
