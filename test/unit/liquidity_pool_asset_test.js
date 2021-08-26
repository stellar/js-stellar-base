const assetA = new StellarBase.Asset(
  'ARST',
  'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
);
const assetB = new StellarBase.Asset(
  'USD',
  'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
);
const fee = StellarBase.LiquidityPoolFeeV18;

describe('LiquidityPoolAsset', function() {
  describe('constructor', function() {
    it('throws an error if assetA is invalid', function() {
      expect(() => new StellarBase.LiquidityPoolAsset()).to.throw(
        /assetA is invalid/
      );

      expect(() => new StellarBase.LiquidityPoolAsset('random')).to.throw(
        /assetA is invalid/
      );
    });

    it('throws an error if assetB is invalid', function() {
      expect(() => new StellarBase.LiquidityPoolAsset(assetA)).to.throw(
        /assetB is invalid/
      );

      expect(
        () => new StellarBase.LiquidityPoolAsset(assetA, 'random')
      ).to.throw(/assetB is invalid/);
    });

    it('throws an error if assets are not ordered', function() {
      expect(() => new StellarBase.LiquidityPoolAsset(assetB, assetA)).to.throw(
        /Assets are not in lexicographic order/
      );
    });

    it('throws an error if fee is invalid', function() {
      expect(() => new StellarBase.LiquidityPoolAsset(assetA, assetB)).to.throw(
        /fee is invalid/
      );
    });

    it('does not throw when using the correct attributes', function() {
      expect(() => new StellarBase.LiquidityPoolAsset(assetA, assetB, fee)).to
        .not.throw;
    });
  });

  describe('getLiquidityPoolParameters()', function() {
    it('returns liquidity pool parameters for a liquidity pool asset', function() {
      const asset = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
      const gotPoolParams = asset.getLiquidityPoolParameters();
      expect(gotPoolParams.assetA).to.eq(assetA);
      expect(gotPoolParams.assetB).to.eq(assetB);
      expect(gotPoolParams.fee).to.eq(fee);
    });
  });

  describe('getAssetType()', function() {
    it('returns "liquidity_pool_shares" if the trustline asset is a liquidity pool ID', function() {
      const asset = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a liquidity pool trustline asset object', function() {
      const asset = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
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
    it('throws an error if asset type is "assetTypeNative"', function() {
      const xdr = new StellarBase.xdr.ChangeTrustAsset.assetTypeNative();
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
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
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
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
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
      const xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypeCreditAlphanum12',
        assetXdr
      );
      expect(() => StellarBase.LiquidityPoolAsset.fromOperation(xdr)).to.throw(
        /Invalid asset type: assetTypeCreditAlphanum12/
      );
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

      const asset = StellarBase.LiquidityPoolAsset.fromOperation(xdr);
      expect(asset).to.be.instanceof(StellarBase.LiquidityPoolAsset);
      const gotPoolParams = asset.getLiquidityPoolParameters();
      expect(gotPoolParams.assetA).to.be.deep.equal(assetA);
      expect(gotPoolParams.assetB).to.be.deep.equal(assetB);
      expect(gotPoolParams.fee).to.eq(fee);
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('equals()', function() {
    it('returns true when assetA and assetB are the same for both liquidity pools', function() {
      const lpAsset1 = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
      const lpAsset2 = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
      expect(lpAsset1.equals(lpAsset1)).to.true;
      expect(lpAsset1.equals(lpAsset2)).to.true;
      expect(lpAsset2.equals(lpAsset1)).to.true;
      expect(lpAsset1.equals(lpAsset2)).to.true;
    });

    it('returns false when assetA or assetB are different in the liquidity pools', function() {
      const lpAsset1 = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);

      const assetA2 = new StellarBase.Asset(
        'ARS2',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );
      const assetB2 = new StellarBase.Asset(
        'USD2',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );

      let lpAsset2 = new StellarBase.LiquidityPoolAsset(assetA2, assetB, fee);
      expect(lpAsset1.equals(lpAsset2)).to.false;

      lpAsset2 = new StellarBase.LiquidityPoolAsset(assetA, assetB2, fee);
      expect(lpAsset1.equals(lpAsset2)).to.false;
    });
  });

  describe('toString()', function() {
    it("returns 'liquidity_pool:<pool_id>' for liquidity pool assets", function() {
      const asset = new StellarBase.LiquidityPoolAsset(assetA, assetB, fee);
      expect(asset.toString()).to.eq(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
