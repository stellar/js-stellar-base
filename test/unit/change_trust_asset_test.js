const assetA = new StellarBase.Asset(
  'ARST',
  'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
);
const assetB = new StellarBase.Asset(
  'USD',
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
);
const fee = StellarBase.LiquidityPoolFeeV18;

describe('ChangeTrustAsset', function() {
  describe('constructor', function() {
    it('throws an error when no parameter is provided', function() {
      expect(() => new StellarBase.ChangeTrustAsset()).to.throw(
        /Must provide either code, issuer or liquidityPoolParameters/
      );
    });

    it('throws an error when there is an asset issuer but the code is invalid', function() {
      expect(() =>
        StellarBase.ChangeTrustAsset.creditAsset(
          '',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
      expect(() =>
        StellarBase.ChangeTrustAsset.creditAsset(
          '1234567890123',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
      expect(() =>
        StellarBase.ChangeTrustAsset.creditAsset(
          'ab_',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is null and asset is not XLM', function() {
      expect(() => StellarBase.ChangeTrustAsset.creditAsset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when issuer is invalid', function() {
      expect(() =>
        StellarBase.ChangeTrustAsset.creditAsset('USD', 'GCEZWKCA5')
      ).to.throw(/Issuer is invalid/);
    });

    it('native asset does not throw', function() {
      expect(() => StellarBase.ChangeTrustAsset.native()).to.not.throw;
    });
  });

  describe('getCode()', function() {
    it('returns a code for a native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.getCode()).to.eq('XLM');
    });

    it('returns a code for a non-native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.eq('USD');
    });

    it('returns undefined code for a liquidity pool asset', function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      expect(asset.getCode()).to.be.undefined;
    });
  });

  describe('getIssuer()', function() {
    it('returns undefined issuer for a native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns an issuer for a non-native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.eq(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it('returns undefined issuer for a liquidity pool asset', function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      expect(asset.getIssuer()).to.be.undefined;
    });
  });

  describe('getLiquidityPoolParameters()', function() {
    it('returns undefined liquidity pool params for a native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.getLiquidityPoolParameters()).to.be.undefined;
    });

    it('returns undefined liquidity pool params for a non-native asset', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getLiquidityPoolParameters()).to.be.undefined;
    });

    it('returns liquidity pool parameters for a liquidity pool asset', function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      const gotPoolParams = asset.getLiquidityPoolParameters();
      expect(gotPoolParams.assetA).to.eq(assetA);
      expect(gotPoolParams.assetB).to.eq(assetB);
      expect(gotPoolParams.fee).to.eq(fee);
    });
  });

  describe('getAssetType()', function() {
    it('returns "native" for native assets', function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns "credit_alphanum4" if the trustline asset code length is between 1 and 4', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns "credit_alphanum12" if the trustline asset code length is between 5 and 12', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('returns "liquidity_pool_shares" if the trustline asset is a liquidity pool ID', function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a native asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      const xdr = asset.toXDRObject();
      expect(xdr.toXDR().toString()).to.eq(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum4');
      expect(xdr.value().assetCode()).to.eq('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum4');
      expect(xdr.value().assetCode()).to.eq('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum12');
      expect(xdr.value().assetCode()).to.eq('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum12');
      expect(xdr.value().assetCode()).to.eq('123456789012');
    });

    it('parses a liquidity pool trustline asset object', function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(xdr.arm()).to.eq('liquidityPool');

      const gotPoolParams = asset.getLiquidityPoolParameters();
      expect(gotPoolParams.assetA).to.eq(assetA);
      expect(gotPoolParams.assetB).to.eq(assetB);
      expect(gotPoolParams.fee).to.eq(fee);
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      const xdr = new StellarBase.xdr.ChangeTrustAsset.assetTypeNative();
      const asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      expect(asset.isNative()).to.eq(true);
      expect(asset.getAssetType()).to.eq('native');
    });

    it('parses a 4-alphanum asset XDR', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHL';
      const assetXdr = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypeCreditAlphanum4',
        assetXdr
      );

      const asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);
      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      expect(asset.getCode()).to.eq(assetCode);
      expect(asset.getIssuer()).to.eq(issuer);
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('parses a 12-alphanum asset XDR', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHLTOKEN';
      const assetXdr = new StellarBase.xdr.AlphaNum12({
        assetCode: assetCode + '\0\0\0\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypeCreditAlphanum12',
        assetXdr
      );

      const asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      expect(asset.getCode()).to.eq(assetCode);
      expect(asset.getIssuer()).to.eq(issuer);
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('parses a liquidityPool asset XDR', function() {
      const lpConstantProductParamsXdr = new StellarBase.xdr.LiquidityPoolConstantProductParameters(
        {
          assetA: assetA.toXDRObject(),
          assetB: assetB.toXDRObject(),
          fee
        }
      );
      const lpParamsXdr = new StellarBase.xdr.LiquidityPoolParameters(
        'liquidityPoolConstantProduct',
        lpConstantProductParamsXdr
      );
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypePoolShare',
        lpParamsXdr
      );

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(xdr.arm()).to.eq('liquidityPool');

      const asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);
      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      const gotPoolParams = asset.getLiquidityPoolParameters();
      expect(gotPoolParams.assetA).to.be.deep.equal(assetA);
      expect(gotPoolParams.assetB).to.be.deep.equal(assetB);
      expect(gotPoolParams.fee).to.eq(fee);
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      const asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.toString()).to.eq('native');
    });

    it("returns 'code:issuer' for non-native asset", function() {
      const asset = StellarBase.ChangeTrustAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.eq(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it("returns 'liquidity_pool:<pool_id>' for liquidity pool assets", function() {
      const asset = StellarBase.ChangeTrustAsset.liquidityPoolAsset({
        assetA,
        assetB,
        fee
      });
      expect(asset.toString()).to.eq(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
