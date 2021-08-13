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
        /Must provide either code, issuer or liquidityPoolParams/
      );
    });

    it("throws an error when there's no issuer for a trustline asset with code `XLM`", function() {
      expect(() => new StellarBase.ChangeTrustAsset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when there is an asset issuer but the code is invalid', function() {
      expect(
        () =>
          new StellarBase.ChangeTrustAsset(
            '',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.ChangeTrustAsset(
            '1234567890123',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.ChangeTrustAsset(
            'ab_',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is invalid', function() {
      expect(
        () => new StellarBase.ChangeTrustAsset('USD', 'GCEZWKCA5')
      ).to.throw(/Issuer is invalid/);
    });
  });

  describe('getCode()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset.native();
      expect(asset.getCode()).to.be.equal('XLM');
    });

    it('returns a code for a non-native asset', function() {
      const asset = new StellarBase.ChangeTrustAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.be.equal('USD');
    });

    it('returns undefined code for a liquidity pool asset', function() {
      const asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      expect(asset.getCode()).to.be.undefined;
    });
  });

  describe('getIssuer()', function() {
    it('returns a code for a native asset object', function() {
      const asset = new StellarBase.ChangeTrustAsset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns a code for a non-native asset', function() {
      const asset = new StellarBase.ChangeTrustAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.be.equal(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it('returns undefined issuer for a liquidity pool asset', function() {
      const asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      expect(asset.getIssuer()).to.be.undefined;
    });
  });

  describe('getLiquidityPoolParams()', function() {
    it('returns empty liquidity pool params for a native asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset.native();
      expect(asset.getLiquidityPoolParams()).to.be.undefined;
    });

    it('returns empty liquidity pool params for a non-native asset', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getLiquidityPoolParams()).to.be.undefined;
    });

    it('returns liquidity pool parameters for a liquidity pool asset', function() {
      const asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      const gotPoolParams = asset.getLiquidityPoolParams();
      expect(gotPoolParams.asseta).to.be.equal(assetA);
      expect(gotPoolParams.assetB).to.be.equal(assetB);
      expect(gotPoolParams.fee).to.be.equal(fee);
    });
  });

  describe('getAssetType()', function() {
    it('returns native for native assets', function() {
      var asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns credit_alphanum4 if the trustline asset code length is between 1 and 4', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns credit_alphanum12 if the trustline asset code length is between 5 and 12', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });

    it('returns liquidity_pool_shares if the trustline asset is a liquidity pool ID', function() {
      const asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      expect(asset.getAssetType()).to.eq('liquidity_pool_shares');
    });
  });

  describe('toXDRObject()', function() {
    it('parses a native asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset.native();
      var xdr = asset.toXDRObject();
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      var asset = new StellarBase.ChangeTrustAsset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      var xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();

      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');
    });

    it('parses a liquidity pool trustline asset object', function() {
      const asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      const xdr = asset.toXDRObject();

      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(xdr.arm()).to.equal('liquidityPool');

      const gotPoolParams = asset.getLiquidityPoolParams();
      expect(gotPoolParams.asseta).to.be.equal(assetA);
      expect(gotPoolParams.assetB).to.be.equal(assetB);
      expect(gotPoolParams.fee).to.be.equal(fee);
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      var xdr = new StellarBase.xdr.ChangeTrustAsset.assetTypeNative();
      var asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      expect(asset.isNative()).to.equal(true);
    });

    it('parses a 4-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHL';
      var assetType = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypeCreditAlphanum4',
        assetType
      );

      var asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
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
      var xdr = new StellarBase.xdr.ChangeTrustAsset(
        'assetTypeCreditAlphanum12',
        assetType
      );

      var asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });

    it('parses a liquidityPool asset XDR', function() {
      const lpConstantProductParamsXdr = new StellarBase.xdr.LiquidityPoolConstantProductParameters(
        {
          asseta: assetA,
          assetB,
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
      expect(xdr.arm()).to.equal('liquidityPool');

      const asset = StellarBase.ChangeTrustAsset.fromOperation(xdr);
      expect(asset).to.be.instanceof(StellarBase.ChangeTrustAsset);

      const gotPoolParams = asset.getLiquidityPoolParams();
      expect(gotPoolParams.asseta).to.be.equal(assetA);
      expect(gotPoolParams.assetB).to.be.equal(assetB);
      expect(gotPoolParams.fee).to.be.equal(fee);
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      var asset = StellarBase.ChangeTrustAsset.native();
      expect(asset.toString()).to.be.equal('native');
    });

    it("returns 'code:issuer' for non-native asset", function() {
      var asset = new StellarBase.ChangeTrustAsset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.be.equal(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });

    it("returns 'liquidity_pool:<id>' for liquidity pool assets", function() {
      var asset = new StellarBase.ChangeTrustAsset(undefined, undefined, {
        asseta: assetA,
        assetB,
        fee
      });
      expect(asset.toString()).to.be.equal(
        'liquidity_pool:dd7b1ab831c273310ddbec6f97870aa83c2fbd78ce22aded37ecbf4f3380fac7'
      );
    });
  });
});
