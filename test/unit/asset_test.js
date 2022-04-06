describe('Asset', function() {
  describe('constructor', function() {
    it("throws an error when there's no issuer for non XLM type asset", function() {
      expect(() => new StellarBase.Asset('USD')).to.throw(
        /Issuer cannot be null/
      );
    });

    it('throws an error when code is invalid', function() {
      expect(
        () =>
          new StellarBase.Asset(
            '',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.Asset(
            '1234567890123',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
      expect(
        () =>
          new StellarBase.Asset(
            'ab_',
            'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
          )
      ).to.throw(/Asset code is invalid/);
    });

    it('throws an error when issuer is invalid', function() {
      expect(() => new StellarBase.Asset('USD', 'GCEZWKCA5')).to.throw(
        /Issuer is invalid/
      );
    });
  });

  describe('getCode()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new StellarBase.Asset.native();
      expect(asset.getCode()).to.be.equal('XLM');
    });

    it('returns a code for a non-native asset', function() {
      var asset = new StellarBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getCode()).to.be.equal('USD');
    });
  });

  describe('getIssuer()', function() {
    it('returns a code for a native asset object', function() {
      var asset = new StellarBase.Asset.native();
      expect(asset.getIssuer()).to.be.undefined;
    });

    it('returns a code for a non-native asset', function() {
      var asset = new StellarBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getIssuer()).to.be.equal(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });
  });

  describe('getAssetType()', function() {
    it('returns native for native assets', function() {
      var asset = StellarBase.Asset.native();
      expect(asset.getAssetType()).to.eq('native');
    });

    it('returns credit_alphanum4 if the asset code length is between 1 and 4', function() {
      var asset = new StellarBase.Asset(
        'ABCD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum4');
    });

    it('returns credit_alphanum12 if the asset code length is between 5 and 12', function() {
      var asset = new StellarBase.Asset(
        'ABCDEF',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.getAssetType()).to.eq('credit_alphanum12');
    });
  });

  describe('toXDRObject(), toChangeTrustXDRObject(), toTrustLineXDRObject', function() {
    it('parses a native asset object', function() {
      const asset = new StellarBase.Asset.native();

      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(xdr.toXDR().toString()).to.be.equal(
        Buffer.from([0, 0, 0, 0]).toString()
      );
    });

    it('parses a 3-alphanum asset object', function() {
      const asset = new StellarBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );

      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('USD\0');
    });

    it('parses a 4-alphanum asset object', function() {
      const asset = new StellarBase.Asset(
        'BART',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum4');
      expect(xdr.value().assetCode()).to.equal('BART');
    });

    it('parses a 5-alphanum asset object', function() {
      const asset = new StellarBase.Asset(
        '12345',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('12345\0\0\0\0\0\0\0');
    });

    it('parses a 12-alphanum asset object', function() {
      const asset = new StellarBase.Asset(
        '123456789012',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      let xdr = asset.toXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.Asset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');

      xdr = asset.toChangeTrustXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.ChangeTrustAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');

      xdr = asset.toTrustLineXDRObject();
      expect(xdr).to.be.instanceof(StellarBase.xdr.TrustLineAsset);
      expect(() => xdr.toXDR('hex')).to.not.throw();
      expect(xdr.arm()).to.equal('alphaNum12');
      expect(xdr.value().assetCode()).to.equal('123456789012');
    });
  });

  describe('fromOperation()', function() {
    it('parses a native asset XDR', function() {
      var xdr = new StellarBase.xdr.Asset.assetTypeNative();
      var asset = StellarBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.Asset);
      expect(asset.isNative()).to.equal(true);
    });

    it('parses a 4-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHL';
      var assetType = new StellarBase.xdr.AlphaNum4({
        assetCode: assetCode + '\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new StellarBase.xdr.Asset(
        'assetTypeCreditAlphanum4',
        assetType
      );

      var asset = StellarBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.Asset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });

    it('parses a 12-alphanum asset XDR', function() {
      var issuer = 'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ';
      var assetCode = 'KHLTOKEN';
      var assetType = new StellarBase.xdr.AlphaNum12({
        assetCode: assetCode + '\0\0\0\0',
        issuer: StellarBase.Keypair.fromPublicKey(issuer).xdrAccountId()
      });
      var xdr = new StellarBase.xdr.Asset(
        'assetTypeCreditAlphanum12',
        assetType
      );

      var asset = StellarBase.Asset.fromOperation(xdr);

      expect(asset).to.be.instanceof(StellarBase.Asset);
      expect(asset.getCode()).to.equal(assetCode);
      expect(asset.getIssuer()).to.equal(issuer);
    });
  });

  describe('toString()', function() {
    it("returns 'native' for native asset", function() {
      var asset = StellarBase.Asset.native();
      expect(asset.toString()).to.be.equal('native');
    });

    it("returns 'code:issuer' for non-native asset", function() {
      var asset = new StellarBase.Asset(
        'USD',
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
      expect(asset.toString()).to.be.equal(
        'USD:GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
      );
    });
  });

  describe('compare()', function() {
    const assetA = new StellarBase.Asset(
      'ARST',
      'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
    );
    const assetB = new StellarBase.Asset(
      'USD',
      'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ'
    );

    it('throws an error if the input assets are invalid', function() {
      expect(() => StellarBase.Asset.compare()).to.throw(/assetA is invalid/);

      expect(() => StellarBase.Asset.compare(assetA)).to.throw(
        /assetB is invalid/
      );

      expect(() => StellarBase.Asset.compare(assetA, assetB)).to.not.throw;
    });

    it('returns false if assets are equal', function() {
      const XLM = new StellarBase.Asset.native();
      expect(StellarBase.Asset.compare(XLM, XLM)).to.eq(0);
      expect(StellarBase.Asset.compare(assetA, assetA)).to.eq(0);
      expect(StellarBase.Asset.compare(assetB, assetB)).to.eq(0);
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

      expect(StellarBase.Asset.compare(XLM, XLM)).to.eq(0);
      expect(StellarBase.Asset.compare(XLM, anum4)).to.eq(-1);
      expect(StellarBase.Asset.compare(XLM, anum12)).to.eq(-1);

      expect(StellarBase.Asset.compare(anum4, XLM)).to.eq(1);
      expect(StellarBase.Asset.compare(anum4, anum4)).to.eq(0);
      expect(StellarBase.Asset.compare(anum4, anum12)).to.eq(-1);

      expect(StellarBase.Asset.compare(anum12, XLM)).to.eq(1);
      expect(StellarBase.Asset.compare(anum12, anum4)).to.eq(1);
      expect(StellarBase.Asset.compare(anum12, anum12)).to.eq(0);
    });

    it('test if asset codes are being validated as assetCodeA < assetCodeB', function() {
      const assetARST = new StellarBase.Asset(
        'ARST',
        'GB7TAYRUZGE6TVT7NHP5SMIZRNQA6PLM423EYISAOAP3MKYIQMVYP2JO'
      );
      const assetUSDX = new StellarBase.Asset('USDA', assetARST.getIssuer());

      expect(StellarBase.Asset.compare(assetARST, assetARST)).to.eq(0);
      expect(StellarBase.Asset.compare(assetARST, assetUSDX)).to.eq(-1);

      expect(StellarBase.Asset.compare(assetUSDX, assetARST)).to.eq(1);
      expect(StellarBase.Asset.compare(assetUSDX, assetUSDX)).to.eq(0);

      // uppercase should be smaller
      const assetLower = new StellarBase.Asset('aRST', assetARST.getIssuer());
      expect(StellarBase.Asset.compare(assetARST, assetLower)).to.eq(-1);
      expect(StellarBase.Asset.compare(assetLower, assetA)).to.eq(1);
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

      expect(StellarBase.Asset.compare(assetIssuerA, assetIssuerB)).to.eq(-1);
      expect(StellarBase.Asset.compare(assetIssuerA, assetIssuerA)).to.eq(0);

      expect(StellarBase.Asset.compare(assetIssuerB, assetIssuerA)).to.eq(1);
      expect(StellarBase.Asset.compare(assetIssuerB, assetIssuerB)).to.eq(0);
    });
  });
});
