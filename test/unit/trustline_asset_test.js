describe('TrustLineAsset', function() {
  describe('constructor', function() {
    it('throws an error when no parameter is provided', function() {
      expect(() => new StellarBase.TrustLineAsset()).to.throw(
        /liquidityPoolId cannot be empty/
      );
    });

    it('throws an error when pool ID is not a valid hash', function() {
      expect(() => new StellarBase.TrustLineAsset('abc')).to.throw(
        /Liquidity pool ID is not a valid hash/
      );
    });

    it('throws an error when pool ID is not all lowercase', function() {
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            'DD7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
          )
      ).to.throw(/Liquidity pool ID should be a lowerc case hash/);
    });

    it('does not throw an error when pool ID is a valid hash', function() {
      expect(
        () =>
          new StellarBase.TrustLineAsset(
            'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
          )
      ).to.not.throw;
    });
  });

  describe('getLiquidityPoolId()', function() {
    it('returns liquidity pool ID of liquidity pool asset', function() {
      const asset = new StellarBase.TrustLineAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getLiquidityPoolId()).to.eq(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });

  describe('getAssetType()', function() {
    it('returns "liquidity_pool_shares" if the trustline asset is a liquidity pool ID', function() {
      const asset = new StellarBase.TrustLineAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a liquidity pool trustline asset object', function() {
      const asset = new StellarBase.TrustLineAsset(
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
    it('throws an error if asset type is "assetTypeNative"', function() {
      const xdr = new StellarBase.xdr.TrustLineAsset.assetTypeNative();
      expect(() => StellarBase.LiquidityPoolAsset.fromOperation(xdr)).to.throw(
        /Invalid asset type: assetTypeNative/
      );
    });

    it('throws an error if asset type is "assetTypeCreditAlphanum4"', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHL';
      const assetXdr = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum4',
        assetXdr
      );
      expect(() => StellarBase.LiquidityPoolAsset.fromOperation(xdr)).to.throw(
        /Invalid asset type: assetTypeCreditAlphanum4/
      );
    });

    it('throws an error if asset type is "assetTypeCreditAlphanum4" (full)', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHL';
      const assetXdr = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum4',
        assetXdr
      );
      expect(() => StellarBase.LiquidityPoolAsset.fromOperation(xdr)).to.throw(
        /Invalid asset type: assetTypeCreditAlphanum4/
      );
    });

    it('throws an error if asset type is "assetTypeCreditAlphanum12"', function() {
      const issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      const assetCode = 'KHLTOKEN';
      const assetXdr = new StellarBase.xdr.AlphaNum12({
        assetCode: assetCode + '\0\0\0\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      const xdr = new StellarBase.xdr.TrustLineAsset(
        'assetTypeCreditAlphanum12',
        assetXdr
      );
      expect(() => StellarBase.LiquidityPoolAsset.fromOperation(xdr)).to.throw(
        /Invalid asset type: assetTypeCreditAlphanum12/
      );
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
    it("returns 'liquidity_pool:<id>' for liquidity pool assets", function() {
      const asset = new StellarBase.TrustLineAsset(
        'dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
      expect(asset.toString()).to.eq(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
