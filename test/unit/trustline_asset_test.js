describe('TrustLineAsset', function() {
  describe('constructor', function() {
    it('throws an error when no parameter is provided', function() {
      expect(() => new StellarBase.TrustLineAsset()).to.throw(
        /Must provide either code, issuer or liquidityPoolId/
      );
    });

    it("throws an error when there's no issuer for a trustline asset with code `XLM`", function() {
      expect(() => new StellarBase.TrustLineAsset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when there is an asset issuer but the code is invalid', function() {
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            '',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            '1234567890123',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            'ab_',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is invalid', function() {
      expect(() => new StellarBase.TrustLineAsset('USD', 'GCEZWKCA5')).to.throw(
        /Issuer is invalid/
      );
    });

    it('throws an error when issuer is null and asset is not XLM', function() {
      expect(() => new StellarBase.TrustLineAsset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when pool ID is not a valid hash', function() {
      expect(
        () => new StellarBase.TrustLineAsset(undefined, undefined, 'abc')
      ).to.throw(/Liquidity pool ID is not a valid hash/);
    });

    it('does not throw an error when pool ID is a valid hash', function() {
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            undefined,
            undefined,
            'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
          )
      ).to.not.throw;
    });
  });

  describe('getCode()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new StellarBase.TrustLineAsset.native();
      expect(asset.getCode()).to.be.equal('XLM');
    });

    it('returns a code for a non-native asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.be.equal('USD');
    });

    it('returns undefined code for a liquidity pool asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getCode()).to.be.undefined;
    });
  });

  describe('getIssuer()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new StellarBase.TrustLineAsset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns a code for a non-native asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.be.equal(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it('returns undefined issuer for a liquidity pool asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getIssuer()).to.be.undefined;
    });
  });

  describe('getLiquidityPoolId()', function() {
    it('returns empty liquidity pool ID for a native asset object', function() {
      var asset = new StellarBase.TrustLineAsset.native();
      expect(asset.getLiquidityPoolId()).to.be.undefined;
    });

    it('returns empty liquidity pool ID for a non-native asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getLiquidityPoolId()).to.be.undefined;
    });

    it('returns liquidity pool ID of liquidity pool asset', function() {
      var asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getLiquidityPoolId()).to.be.equal(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });

  describe('getAssetType()', function() {
    it('returns native for native assets', function() {
      var asset = StellarBase.TrustLineAsset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns credit_alphanum4 if the trustline asset code length is between 1 and 4', function() {
      var asset = new StellarBase.TrustLineAsset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns credit_alphanum12 if the trustline asset code length is between 5 and 12', function() {
      var asset = new StellarBase.TrustLineAsset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('returns liquidity_pool_shares if the trustline asset is a liquidity pool ID', function() {
      var asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a native asset object', function() {
      var asset = new StellarBase.TrustLineAsset.native();
      var xdr = asset.toXDRObject();
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      var asset = new StellarBase.TrustLineAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      var asset = new StellarBase.TrustLineAsset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      var asset = new StellarBase.TrustLineAsset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      var asset = new StellarBase.TrustLineAsset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');
    });

    it('parses a liquidity pool trustline asset object', function() {
      const asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(xdr.arm()).to.equal('liquidityPoolId');
      expect(xdr.liquidityPoolId().toString('hex')).to.equal(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(xdr.liquidityPoolId().toString('hex')).to.equal(
        asset.getLiquidityPoolId()
      );
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      var xdr = new StellarBase.xdr.TrustLineAsset.assetTypeNative();
      var asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.isNative()).to.equal(true);
    });

    it('parses a 4-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHL';
      var assetType = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum4',
        assetType
      );

      var asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });

    it('parses a 12-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHLTOKEN';
      var assetType = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0\0\0\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum12',
        assetType
      );

      var asset = StellarBase.TrustLineAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.TrustLineAsset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
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
      expect(asset.getLiquidityPoolId()).to.equal(poolId);
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      var asset = StellarBase.TrustLineAsset.native();
      expect(asset.toString()).to.be.equal('native');
    });

    it("returns 'code:issuer' for non-native asset", function() {
      var asset = new StellarBase.TrustLineAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.be.equal(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it("returns 'liquidity_pool:<id>' for liquidity pool assets", function() {
      var asset = new StellarBase.TrustLineAsset(
        undefined,
        undefined,
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.toString()).to.be.equal(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
