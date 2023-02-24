describe('Address', function() {
  const ACCOUNT = 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
  const CONTRACT = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const MUXED_ADDRESS =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK';

  describe('.constructor', function() {
    it('fails to create Address object from an invalid address', function() {
      expect(() => new StellarBase.Address('GBBB')).to.throw(
        /Unsupported address type/
      );
    });

    it('creates an Address object for accounts', function() {
      let account = new StellarBase.Address(ACCOUNT);
      expect(account.toString()).to.equal(ACCOUNT);
    });

    it('creates an Address object for contracts', function() {
      let account = new StellarBase.Address(CONTRACT);
      expect(account.toString()).to.equal(CONTRACT);
    });

    it('wont create Address objects from muxed account strings', function() {
      expect(() => {
        new StellarBase.Account(MUXED_ADDRESS, '123');
      }).to.throw(/MuxedAccount/);
    });
  });

  describe('static constructors', function() {
    it('.fromString', function() {
      let account = StellarBase.Address.fromString(ACCOUNT);
      expect(account.toString()).to.equal(ACCOUNT);
    });

    it('.account', function() {
      let account = StellarBase.Address.account(Buffer.alloc(32));
      expect(account.toString()).to.equal(
        'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF'
      );
    });

    it('.contract', function() {
      let account = StellarBase.Address.contract(Buffer.alloc(32));
      expect(account.toString()).to.equal(
        'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4'
      );
    });
  });

  describe('.toScAddress', function() {
    it('converts accounts to an ScAddress', function() {
      const a = new StellarBase.Address(ACCOUNT);
      const s = a.toScAddress();
      expect(s).to.be.instanceof(StellarBase.xdr.ScAddress);
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeAccount()
      );
    });

    it('converts contracts to an ScAddress', function() {
      const a = new StellarBase.Address(CONTRACT);
      const s = a.toScAddress();
      expect(s).to.be.instanceof(StellarBase.xdr.ScAddress);
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeContract()
      );
    });
  });

  describe('.toScVal', function() {
    it('converts to an ScAddress', function() {
      const a = new StellarBase.Address(ACCOUNT);
      const s = a.toScVal();
      expect(s).to.be.instanceof(StellarBase.xdr.ScVal);
      expect(s.obj().address()).to.deep.equal(a.toScAddress());
    });
  });

  describe('.toBuffer', function() {
    it('returns the raw public key bytes for accounts', function() {
      const a = new StellarBase.Address(ACCOUNT);
      const b = a.toBuffer();
      expect(b).to.deep.equal(
        StellarBase.StrKey.decodeEd25519PublicKey(ACCOUNT)
      );
    });

    it('returns the raw public key bytes for contracts', function() {
      const a = new StellarBase.Address(CONTRACT);
      const b = a.toBuffer();
      expect(b).to.deep.equal(StellarBase.StrKey.decodeContract(CONTRACT));
    });
  });
});
