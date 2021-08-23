describe('TrustLineAsset', function() {
  describe('constructor', function() {
    it('throws an error when no parameter is provided', function() {
      expect(() => new StellarBase.TrustLineAsset()).to.throw(
        /Must provide either code, issuer or liquidityPoolId/
      );
    });

    it('throws an error when there is an asset issuer but the code is invalid', function() {
      expect(() =>
        StellarBase.TrustLineAsset.creditAsset(
          '',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
      expect(() =>
        StellarBase.TrustLineAsset.creditAsset(
          '1234567890123',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
      expect(() =>
        StellarBase.TrustLineAsset.creditAsset(
          'ab_',
          'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
        )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is null and asset is not XLM', function() {
      expect(() => StellarBase.TrustLineAsset.creditAsset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when issuer is invalid', function() {
      expect(() =>
        StellarBase.TrustLineAsset.creditAsset('USD', 'GCEZWKCA5')
      ).to.throw(/Issuer is invalid/);
    });

    it('throws an error when pool ID is not a valid hash', function() {
      expect(() =>
        StellarBase.TrustLineAsset.liquidityPoolAsset('abc')
      ).to.throw(/Liquidity pool ID is not a valid hash/);
    });

    it('does not throw an error when pool ID is a valid hash', function() {
      expect(() =>
        StellarBase.TrustLineAsset.liquidityPoolAsset(
          'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
        )
      ).to.not.throw;
    });
  });

  describe('getCode()', function() {
    it('returns an issuer for a native asset', function() {
      const asset = StellarBase.TrustLineAsset.native();
      expect(asset.getCode()).to.eq('XLM');
    });

    it('returns a code for a non-native asset', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.eq('USD');
    });

    it('returns undefined code for a liquidity pool asset', function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getCode()).to.be.undefined;
    });
  });

  describe('getIssuer()', function() {
    it('returns undefined issuer for a native asset', function() {
      const asset = StellarBase.TrustLineAsset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns an issuer for a non-native asset', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.eq(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it('returns undefined issuer for a liquidity pool asset', function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getIssuer()).to.be.undefined;
    });
  });

  describe('getLiquidityPoolId()', function() {
    it('returns undefined liquidity pool ID for a native asset', function() {
      const asset = StellarBase.TrustLineAsset.native();
      expect(asset.getLiquidityPoolId()).to.be.undefined;
    });

    it('returns undefined liquidity pool ID for a non-native asset', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getLiquidityPoolId()).to.be.undefined;
    });

    it('returns liquidity pool ID of liquidity pool asset', function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getLiquidityPoolId()).to.eq(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });

  describe('getAssetType()', function() {
    it('returns "native" for native assets', function() {
      const asset = StellarBase.TrustLineAsset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns "credit_alphanum4" if the trustline asset code length is between 1 and 4', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns "credit_alphanum12" if the trustline asset code length is between 5 and 12', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('returns "liquidity_pool_shares" if the trustline asset is a liquidity pool ID', function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a native asset object', function() {
      const asset = StellarBase.TrustLineAsset.native();
      const xdr = asset.toXDRObject();
      expect(xdr.toXDR().toString()).to.eq(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum4');
      expect(xdr.value().assetCode()).to.eq('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum4');
      expect(xdr.value().assetCode()).to.eq('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum12');
      expect(xdr.value().assetCode()).to.eq('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.eq('alphaNum12');
      expect(xdr.value().assetCode()).to.eq('123456789012');
    });

    it('parses a liquidity pool trustline asset object', function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(xdr.arm()).to.eq('liquidityPoolId');
      expect(xdr.liquidityPoolId().toString('hex')).to.eq(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(xdr.liquidityPoolId().toString('hex')).to.eq(
        asset.getLiquidityPoolId()
      );
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      const xdr = new StellarBase.xdr.TrustLineAsset.assetTypeNative();
      const asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.isNative()).to.eq(true);
      expect(asset.getAssetType()).to.eq('native');
    });

    it('parses a 4-alphanum asset XDR', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHL';
      const assetType = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum4',
        assetType
      );

      const asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.getCode()).to.eq(assetCode);
      expect(asset.getIssuer()).to.eq(issuer);
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('parses a 12-alphanum asset XDR', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHLTOKEN';
      const assetType = new StellarBase.xdr.AlphaNum12({
        assetCode: assetCode + '\0\0\0\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum12',
        assetType
      );

      const asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.getCode()).to.eq(assetCode);
      expect(asset.getIssuer()).to.eq(issuer);
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('parses a liquidityPoolId asset XDR', function() {
      const poolId =
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7';
      const xdrPoolId = StellarBase.xdr.PoolId.fromXDR(poolId, 'hex');
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypePoolShare',
        xdrPoolId
      );

      const asset = StellarBase.TrustLineAsset.fromOperation(xdr);
      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.getLiquidityPoolId()).to.eq(poolId);
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      const asset = StellarBase.TrustLineAsset.native();
      expect(asset.toString()).to.eq('native');
    });

    it("returns '<code>:<issuer>' for non-native asset", function() {
      const asset = StellarBase.TrustLineAsset.creditAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.eq(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it("returns 'liquidity_pool:<id>' for liquidity pool assets", function() {
      const asset = StellarBase.TrustLineAsset.liquidityPoolAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.toString()).to.eq(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
