const liquidityPoolTypeConstantProduct = 'constant_product';

describe('StellarBase#liquidityPoolId', function() {
  it('throws an error if the liquidity pool type is not `0` for constant product', function() {
    expect(() => StellarBase.getLiquidityPoolId()).to.throw(
      /liquidityPoolType is invalid/
    );

    expect(() => StellarBase.getLiquidityPoolId(1)).to.throw(
      /liquidityPoolType is invalid/
    );
  });

  it('throws an error if liquidity pool parameters is missing', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct)
    ).to.throw(/liquidityPoolParams cannot be empty/);
  });

  it('throws an error if assetA is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {})
    ).to.throw(/asseta is invalid/);
    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: 'random'
      })
    ).to.throw(/asseta is invalid/);
  });

  it('throws an error if assetB is invalid', function() {
    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: assetA
      })
    ).to.throw(/assetB is invalid/);
    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {
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
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {
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
    const fee = StellarBase.LiquidityPoolFeeV18;

    const poolId = StellarBase.getLiquidityPoolId(
      liquidityPoolTypeConstantProduct,
      {
        asseta: assetA,
        assetB,
        fee
      }
    );

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
    const fee = StellarBase.LiquidityPoolFeeV18;

    expect(() =>
      StellarBase.getLiquidityPoolId(liquidityPoolTypeConstantProduct, {
        asseta: assetA,
        assetB,
        fee
      })
    ).to.throw(/assets are not in lexicografichal order/);
  });
});

describe('StellarBase#validateLexicographicalAssetsOrder', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(() => StellarBase.validateLexicographicalAssetsOrder()).to.throw(
      /assetA is invalid/
    );

    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    expect(() =>
      StellarBase.validateLexicographicalAssetsOrder(assetA)
    ).to.throw(/assetB is invalid/);
  });

  it('returns false if assets are equal', function() {
    const XLM = new StellarBase.Asset.native();
    expect(StellarBase.validateLexicographicalAssetsOrder(XLM, XLM)).to.false;
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
    expect(StellarBase.validateLexicographicalAssetsOrder(XLM, XLM)).to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(XLM, anum4)).to.true;
    expect(StellarBase.validateLexicographicalAssetsOrder(XLM, anum12)).to.true;

    expect(StellarBase.validateLexicographicalAssetsOrder(anum4, XLM)).to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(anum4, anum4)).to
      .false;
    expect(StellarBase.validateLexicographicalAssetsOrder(anum4, anum12)).to
      .true;

    expect(StellarBase.validateLexicographicalAssetsOrder(anum12, XLM)).to
      .false;
    expect(StellarBase.validateLexicographicalAssetsOrder(anum12, anum4)).to
      .false;
    expect(StellarBase.validateLexicographicalAssetsOrder(anum12, anum12)).to
      .false;
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
    expect(StellarBase.validateLexicographicalAssetsOrder(assetARST, assetUSDX))
      .to.true;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetARST, assetARST))
      .to.false;

    expect(StellarBase.validateLexicographicalAssetsOrder(assetUSDX, assetARST))
      .to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetUSDX, assetUSDX))
      .to.false;
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
      StellarBase.validateLexicographicalAssetsOrder(
        assetARSTIssuerA,
        assetARSTIssuerB
      )
    ).to.true;
    expect(
      StellarBase.validateLexicographicalAssetsOrder(
        assetARSTIssuerA,
        assetARSTIssuerA
      )
    ).to.false;

    expect(
      StellarBase.validateLexicographicalAssetsOrder(
        assetARSTIssuerB,
        assetARSTIssuerA
      )
    ).to.false;
    expect(
      StellarBase.validateLexicographicalAssetsOrder(
        assetARSTIssuerB,
        assetARSTIssuerB
      )
    ).to.false;
  });
});
