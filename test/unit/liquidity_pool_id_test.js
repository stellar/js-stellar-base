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
    ).to.throw(/assetA is invalid/);

    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', { assetA: 'random' })
    ).to.throw(/assetA is invalid/);
  });

  it('throws an error if assetB is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        assetA
      })
    ).to.throw(/assetB is invalid/);

    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        assetA,
        assetB: 'random'
      })
    ).to.throw(/assetB is invalid/);
  });

  it('throws an error if fee is invalid', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        assetA,
        assetB
      })
    ).to.throw(/fee is invalid/);
  });

  it('returns poolId correctly', function() {
    const poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA,
      assetB,
      fee
    });

    expect(poolId.toString('hex')).to.equal(
      'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
    );
  });

  it('returns poolId correctly, based on stellar-core tests', function() {
    // The tests below were extracted from https://github.com/stellar/stellar-core/blob/c5f6349b240818f716617ca6e0f08d295a6fad9a/src/transactions/test/LiquidityPoolTradeTests.cpp#L430-L526
    const issuer1 = StellarBase.StrKey.encodeEd25519PublicKey(
      Buffer.from(
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        'hex'
      )
    );
    const issuer2 = StellarBase.StrKey.encodeEd25519PublicKey(
      Buffer.from(
        'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
        'hex'
      )
    );

    // NATIVE and ALPHANUM4 (short and full length)
    let poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset.native(),
      assetB: new StellarBase.Asset('AbC', issuer1),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      'c17f36fbd210e43dca1cda8edc5b6c0f825fcb72b39f0392fd6309844d77ff7d'
    );

    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset.native(),
      assetB: new StellarBase.Asset('AbCd', issuer1),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      '80e0c5dc79ed76bb7e63681f6456136762f0d01ede94bb379dbc793e66db35e6'
    );

    // NATIVE and ALPHANUM12 (short and full length)
    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset.native(),
      assetB: new StellarBase.Asset('AbCdEfGhIjK', issuer1),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      'd2306c6e8532f99418e9d38520865e1c1059cddb6793da3cc634224f2ffb5bd4'
    );
    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset.native(),
      assetB: new StellarBase.Asset('AbCdEfGhIjKl', issuer1),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      '807e9e66653b5fda4dd4e672ff64a929fc5fdafe152eeadc07bb460c4849d711'
    );

    // ALPHANUM4 and ALPHANUM12: same code different issuer
    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset('aBc', issuer1),
      assetB: new StellarBase.Asset('aBc', issuer2),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      '5d7188454299529856586e81ea385d2c131c6afdd9d58c82e9aa558c16522fea'
    );

    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset('aBcDeFgHiJkL', issuer1),
      assetB: new StellarBase.Asset('aBcDeFgHiJkL', issuer2),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      '93fa82ecaabe987461d1e3c8e0fd6510558b86ac82a41f7c70b112281be90c71'
    );

    // ALPHANUM4 before ALPHANUM12 doesn't depend on issuer or code
    poolId = StellarBase.getLiquidityPoolId('constant_product', {
      assetA: new StellarBase.Asset('aBc', issuer1),
      assetB: new StellarBase.Asset('aBcDeFgHiJk', issuer2),
      fee
    });
    expect(poolId.toString('hex')).to.equal(
      'c0d4c87bbaade53764b904fde2901a0353af437e9d3a976f1252670b85a36895'
    );
  });

  it('throws an error if assets are not in lexicographic order', function() {
    expect(() =>
      StellarBase.getLiquidityPoolId('constant_product', {
        assetA: assetB,
        assetB: assetA,
        fee
      })
    ).to.throw(/Assets are not in lexicographic order/);
  });
});

describe('StellarBase#validateLexicographicAssetsOrder()', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(() => StellarBase.validateLexicographicAssetsOrder()).to.throw(
      /assetA is invalid/
    );

    expect(() => StellarBase.validateLexicographicAssetsOrder(assetA)).to.throw(
      /assetB is invalid/
    );

    expect(() => StellarBase.validateLexicographicAssetsOrder(assetA, assetB))
      .to.not.throw;
  });

  it('returns false if assets are equal', function() {
    const XLM = new StellarBase.Asset.native();
    expect(StellarBase.validateLexicographicAssetsOrder(XLM, XLM)).to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(assetA, assetA)).to
      .false;
    expect(StellarBase.validateLexicographicAssetsOrder(assetB, assetB)).to
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

    expect(StellarBase.validateLexicographicAssetsOrder(XLM, XLM)).to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(XLM, anum4)).to.true;
    expect(StellarBase.validateLexicographicAssetsOrder(XLM, anum12)).to.true;

    expect(StellarBase.validateLexicographicAssetsOrder(anum4, XLM)).to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(anum4, anum4)).to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(anum4, anum12)).to.true;

    expect(StellarBase.validateLexicographicAssetsOrder(anum12, XLM)).to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(anum12, anum4)).to
      .false;
    expect(StellarBase.validateLexicographicAssetsOrder(anum12, anum12)).to
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

    expect(StellarBase.validateLexicographicAssetsOrder(assetARST, assetARST))
      .to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(assetARST, assetUSDX))
      .to.true;

    expect(StellarBase.validateLexicographicAssetsOrder(assetUSDX, assetARST))
      .to.false;
    expect(StellarBase.validateLexicographicAssetsOrder(assetUSDX, assetUSDX))
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
      StellarBase.validateLexicographicAssetsOrder(assetIssuerA, assetIssuerB)
    ).to.true;
    expect(
      StellarBase.validateLexicographicAssetsOrder(assetIssuerA, assetIssuerA)
    ).to.false;

    expect(
      StellarBase.validateLexicographicAssetsOrder(assetIssuerB, assetIssuerA)
    ).to.false;
    expect(
      StellarBase.validateLexicographicAssetsOrder(assetIssuerB, assetIssuerB)
    ).to.false;
  });
});

describe('StellarBase#LiquidityPoolFeeV18', function() {
  it('throws an error if the input assets are invalid', function() {
    expect(StellarBase.LiquidityPoolFeeV18).to.equal(30);
  });
});