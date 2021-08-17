const assetA = new StellarBase.Asset(
  'ARST',
  'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
);
const assetB = new StellarBase.Asset(
  'USD',
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
);
const fee = StellarBase.LiquidityPoolFeeV18;

describe('StellarBase#getLiquidityPoolId()', function() {
  it('throws an error if the liquidity pool type is not `constant_product`', function() {
    expect(() => StellarBase.getLiquidityPoolId()).to.throw(
      /liquidityPoolType is invalid/
    );

    expect(() => StellarBase.getLiquidityPoolId(1)).to.throw(
      /liquidityPoolType is invalid/
    );

    expect(() => StellarBase.getLiquidityPoolId('random_type')).to.throw(
      /liquidityPoolType is invalid/
    );
  });

  it('throws an error if assetA is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {})
    ).to.throw(/asseta is invalid/);

    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', { asseta: 'random' })
    ).to.throw(/asseta is invalid/);
  });

  it('throws an error if assetB is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        asseta: assetA
      })
    ).to.throw(/assetB is invalid/);

    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        asseta: assetA,
        assetB: 'random'
      })
    ).to.throw(/assetB is invalid/);
  });

  it('throws an error if fee is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        asseta: assetA,
        assetB
      })
    ).to.throw(/fee is invalid/);
  });

  it('returns poolId correctly', function() {
    const poolId = StellarBase.getLiquidityPoolId('constant_product', {
      asseta: assetA,
      assetB,
      fee
    });

    expect(poolId.toString('hex')).to.equal(
      'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
    );
  });

  it('throws an error if assets are not in lexicographical order', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        asseta: assetB,
        assetB: assetA,
        fee
      })
    ).to.throw(/Assets are not in lexicographical order/);
  });
});

describe('StellarBase#validateLexicographicalAssetsOrder()', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(() => StellarBase.validateLexicographicalAssetsOrder()).to.throw(
      /assetA is invalid/
    );

    expect(() =>
      StellarBase.validateLexicographicalAssetsOrder(assetA)
    ).to.throw(/assetB is invalid/);

    expect(() => StellarBase.validateLexicographicalAssetsOrder(assetA, assetB))
      .to.not.throw;
  });

  it('returns false if assets are equal', function() {
    const XLM = new StellarBase.Asset.native();
    expect(StellarBase.validateLexicographicalAssetsOrder(XLM, XLM)).to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetA, assetA)).to
      .false;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetB, assetB)).to
      .false;
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

  it('test if asset codes are being validated as assetCodeA < assetCodeB', function() {
    const assetARST = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetUSDX = new StellarBase.Asset(
      'USDX',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );

    expect(StellarBase.validateLexicographicalAssetsOrder(assetARST, assetARST))
      .to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetARST, assetUSDX))
      .to.true;

    expect(StellarBase.validateLexicographicalAssetsOrder(assetUSDX, assetARST))
      .to.false;
    expect(StellarBase.validateLexicographicalAssetsOrder(assetUSDX, assetUSDX))
      .to.false;
  });

  it('test if asset issuers are being validated as assetIssuerA < assetIssuerB', function() {
    const assetIssuerA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetIssuerB = new StellarBase.Asset(
      'ARST',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );

    expect(
      StellarBase.validateLexicographicalAssetsOrder(assetIssuerA, assetIssuerB)
    ).to.true;
    expect(
      StellarBase.validateLexicographicalAssetsOrder(assetIssuerA, assetIssuerA)
    ).to.false;

    expect(
      StellarBase.validateLexicographicalAssetsOrder(assetIssuerB, assetIssuerA)
    ).to.false;
    expect(
      StellarBase.validateLexicographicalAssetsOrder(assetIssuerB, assetIssuerB)
    ).to.false;
  });
});

describe('StellarBase#LiquidityPoolFeeV18', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(StellarBase.LiquidityPoolFeeV18).to.equal(30);
  });
});
