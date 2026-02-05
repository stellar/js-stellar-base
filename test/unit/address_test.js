describe("Address", function () {
  const ACCOUNT = "GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB";
  const CONTRACT = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";
  const MUXED_ADDRESS =
    "MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK";
  const MUXED_ADDRESS_ID = "9223372036854775808";
  const MUXED_ADDRESS_BASE =
    "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ";

  const MUXED_ZERO = StellarBase.StrKey.encodeMed25519PublicKey(
    Buffer.alloc(40)
  );
  const CLAIMABLE_BALANCE_ZERO = StellarBase.StrKey.encodeClaimableBalance(
    Buffer.alloc(33)
  );
  const LIQUIDITY_POOL_ZERO = StellarBase.StrKey.encodeLiquidityPool(
    Buffer.alloc(32)
  );

  describe(".constructor", function () {
    it("fails to create Address object from an invalid address", function () {
      expect(() => new StellarBase.Address("GBBB")).to.throw(
        /Unsupported address type/
      );
    });

    [
      ACCOUNT,
      CONTRACT,
      MUXED_ADDRESS,
      CLAIMABLE_BALANCE_ZERO,
      LIQUIDITY_POOL_ZERO
    ].forEach((strkey) => {
      const type = StellarBase.StrKey.types[strkey[0]];
      it(`creates an Address for ${type}`, function () {
        expect(new StellarBase.Address(strkey).toString()).to.equal(strkey);
      });
    });
  });

  describe("static constructors", function () {
    it(".fromString", function () {
      const a = StellarBase.Address.fromString(ACCOUNT);
      expect(a.toString()).to.equal(ACCOUNT);
    });

    it(".account", function () {
      const a = StellarBase.Address.account(Buffer.alloc(32));
      expect(a.toString()).to.equal(
        "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"
      );
    });

    it(".contract", function () {
      const c = StellarBase.Address.contract(Buffer.alloc(32));
      expect(c.toString()).to.equal(
        "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4"
      );
    });

    it(".muxedAccount", function () {
      const m = StellarBase.Address.muxedAccount(Buffer.alloc(40));
      expect(m.toString()).to.equal(MUXED_ZERO);
    });

    it(".claimableBalance", function () {
      const cb = StellarBase.Address.claimableBalance(Buffer.alloc(33));
      expect(cb.toString()).to.equal(CLAIMABLE_BALANCE_ZERO);
    });

    it(".liquidityPool", function () {
      const lp = StellarBase.Address.liquidityPool(Buffer.alloc(32));
      expect(lp.toString()).to.equal(LIQUIDITY_POOL_ZERO);
    });

    describe(".fromScAddress", function () {
      it("parses account addresses", function () {
        const sc = StellarBase.xdr.ScAddress.scAddressTypeAccount(
          StellarBase.xdr.PublicKey.publicKeyTypeEd25519(
            StellarBase.StrKey.decodeEd25519PublicKey(ACCOUNT)
          )
        );
        const a = StellarBase.Address.fromScAddress(sc);
        expect(a.toString()).to.equal(ACCOUNT);
      });

      it("parses contract addresses", function () {
        const sc = StellarBase.xdr.ScAddress.scAddressTypeContract(
          StellarBase.StrKey.decodeContract(CONTRACT)
        );
        const c = StellarBase.Address.fromScAddress(sc);
        expect(c.toString()).to.equal(CONTRACT);
      });

      it("parses muxed-account addresses", function () {
        const sc = StellarBase.xdr.ScAddress.scAddressTypeMuxedAccount(
          new StellarBase.xdr.MuxedEd25519Account({
            id: new StellarBase.xdr.Uint64(MUXED_ADDRESS_ID),
            ed25519:
              StellarBase.StrKey.decodeEd25519PublicKey(MUXED_ADDRESS_BASE)
          })
        );
        const m = StellarBase.Address.fromScAddress(sc);
        expect(m.toString()).to.equal(MUXED_ADDRESS);
      });

      it("parses claimable-balance addresses", function () {
        const sc = StellarBase.xdr.ScAddress.scAddressTypeClaimableBalance(
          new StellarBase.xdr.ClaimableBalanceId(
            "claimableBalanceIdTypeV0",
            Buffer.alloc(32)
          )
        );
        const cb = StellarBase.Address.fromScAddress(sc);
        expect(cb.toString()).to.equal(CLAIMABLE_BALANCE_ZERO);
      });

      it("parses claimable-balance from decoded XDR", function () {
        // XDR: ScVal containing claimable balance address
        const xdrBase64 =
          "AAAAEgAAAAMAAAAAGZ8agta/ETY/tCE7KG10xWweJ9IBmnhmy0alCNG6gOE=";
        const scVal = StellarBase.xdr.ScVal.fromXDR(xdrBase64, "base64");
        const addr = StellarBase.Address.fromScVal(scVal);
        expect(addr.toString()).to.equal(
          "BAABTHY2QLLL6EJWH62CCOZINV2MK3A6E7JADGTYM3FUNJII2G5IBYM2TU"
        );
      });

      it("parses liquidity-pool addresses", function () {
        const sc = StellarBase.xdr.ScAddress.scAddressTypeLiquidityPool(
          Buffer.alloc(32)
        );
        const lp = StellarBase.Address.fromScAddress(sc);
        expect(lp.toString()).to.equal(LIQUIDITY_POOL_ZERO);
      });
    });

    describe(".fromScVal", function () {
      it("parses account ScVals", function () {
        const scVal = StellarBase.xdr.ScVal.scvAddress(
          StellarBase.xdr.ScAddress.scAddressTypeAccount(
            StellarBase.xdr.PublicKey.publicKeyTypeEd25519(
              StellarBase.StrKey.decodeEd25519PublicKey(ACCOUNT)
            )
          )
        );
        const a = StellarBase.Address.fromScVal(scVal);
        expect(a.toString()).to.equal(ACCOUNT);
      });

      it("parses contract ScVals", function () {
        const scVal = StellarBase.xdr.ScVal.scvAddress(
          StellarBase.xdr.ScAddress.scAddressTypeContract(
            StellarBase.StrKey.decodeContract(CONTRACT)
          )
        );
        const c = StellarBase.Address.fromScVal(scVal);
        expect(c.toString()).to.equal(CONTRACT);
      });

      it("parses muxed-account ScVals", function () {
        const scVal = StellarBase.xdr.ScVal.scvAddress(
          StellarBase.xdr.ScAddress.scAddressTypeMuxedAccount(
            new StellarBase.xdr.MuxedEd25519Account({
              id: new StellarBase.xdr.Uint64(MUXED_ADDRESS_ID),
              ed25519:
                StellarBase.StrKey.decodeEd25519PublicKey(MUXED_ADDRESS_BASE)
            })
          )
        );
        const m = StellarBase.Address.fromScVal(scVal);
        expect(m.toString()).to.equal(MUXED_ADDRESS);
      });

      it("parses claimable-balance ScVals", function () {
        const scVal = StellarBase.xdr.ScVal.scvAddress(
          StellarBase.xdr.ScAddress.scAddressTypeClaimableBalance(
            new StellarBase.xdr.ClaimableBalanceId(
              "claimableBalanceIdTypeV0",
              Buffer.alloc(32)
            )
          )
        );
        const cb = StellarBase.Address.fromScVal(scVal);
        expect(cb.toString()).to.equal(CLAIMABLE_BALANCE_ZERO);
      });

      it("parses liquidity-pool ScVals", function () {
        const scVal = StellarBase.xdr.ScVal.scvAddress(
          StellarBase.xdr.ScAddress.scAddressTypeLiquidityPool(Buffer.alloc(32))
        );
        const lp = StellarBase.Address.fromScVal(scVal);
        expect(lp.toString()).to.equal(LIQUIDITY_POOL_ZERO);
      });
    });
  });

  describe(".toScAddress", function () {
    it("converts accounts", function () {
      const a = new StellarBase.Address(ACCOUNT);
      const s = a.toScAddress();
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeAccount()
      );
      expect(StellarBase.xdr.ScAddress.fromXDR(s.toXDR())).to.eql(s);
    });

    it("converts contracts", function () {
      const c = new StellarBase.Address(CONTRACT);
      const s = c.toScAddress();
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeContract()
      );
      expect(StellarBase.xdr.ScAddress.fromXDR(s.toXDR())).to.eql(s);
    });

    it("converts muxed accounts", function () {
      const m = new StellarBase.Address(MUXED_ADDRESS);
      const s = m.toScAddress();
      expect(s).to.be.instanceof(StellarBase.xdr.ScAddress);
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeMuxedAccount()
      );
      expect(s.muxedAccount().ed25519()).to.deep.equal(
        StellarBase.StrKey.decodeEd25519PublicKey(MUXED_ADDRESS_BASE)
      );
      expect(s.muxedAccount().id().toString()).to.equal(MUXED_ADDRESS_ID);
      expect(StellarBase.xdr.ScAddress.fromXDR(s.toXDR())).to.eql(s);
    });

    it("converts claimable balances", function () {
      const cb = new StellarBase.Address(CLAIMABLE_BALANCE_ZERO);
      const s = cb.toScAddress();
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeClaimableBalance()
      );
      expect(StellarBase.xdr.ScAddress.fromXDR(s.toXDR())).to.eql(s);
    });

    it("converts liquidity pools", function () {
      const lp = new StellarBase.Address(LIQUIDITY_POOL_ZERO);
      const s = lp.toScAddress();
      expect(s.switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeLiquidityPool()
      );
      expect(StellarBase.xdr.ScAddress.fromXDR(s.toXDR())).to.eql(s);
    });
  });

  describe(".toScVal", function () {
    it("wraps account ScAddress types", function () {
      const a = new StellarBase.Address(ACCOUNT);
      expect(a.toScVal().address().switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeAccount()
      );
    });

    it("wraps contract ScAddress types", function () {
      const c = new StellarBase.Address(CONTRACT);
      expect(c.toScVal().address().switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeContract()
      );
    });

    it("wraps muxed-account ScAddress types", function () {
      const m = new StellarBase.Address(MUXED_ADDRESS);
      expect(m.toScVal().address().switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeMuxedAccount()
      );
    });

    it("wraps liquidity-pool ScAddress types", function () {
      const lp = new StellarBase.Address(LIQUIDITY_POOL_ZERO);
      expect(lp.toScVal().address().switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeLiquidityPool()
      );
    });

    it("wraps claimable-balance ScAddress types", function () {
      const cb = new StellarBase.Address(CLAIMABLE_BALANCE_ZERO);
      const val = cb.toScVal();
      expect(val).to.be.instanceof(StellarBase.xdr.ScVal);
      expect(val.address().switch()).to.equal(
        StellarBase.xdr.ScAddressType.scAddressTypeClaimableBalance()
      );
    });
  });

  describe(".toBuffer", function () {
    it("returns the raw public-key bytes for accounts", function () {
      const a = new StellarBase.Address(ACCOUNT);
      expect(a.toBuffer()).to.deep.equal(
        StellarBase.StrKey.decodeEd25519PublicKey(ACCOUNT)
      );
    });

    it("returns the raw hash for contracts", function () {
      const c = new StellarBase.Address(CONTRACT);
      expect(c.toBuffer()).to.deep.equal(
        StellarBase.StrKey.decodeContract(CONTRACT)
      );
    });

    it("returns raw bytes for muxed accounts", function () {
      const m = new StellarBase.Address(MUXED_ADDRESS);
      expect(m.toBuffer()).to.deep.equal(
        StellarBase.StrKey.decodeMed25519PublicKey(MUXED_ADDRESS)
      );
    });

    it("returns raw bytes for claimable balances", function () {
      const cb = new StellarBase.Address(CLAIMABLE_BALANCE_ZERO);
      expect(cb.toBuffer()).to.deep.equal(
        StellarBase.StrKey.decodeClaimableBalance(CLAIMABLE_BALANCE_ZERO)
      );
    });

    it("returns raw bytes for liquidity pools", function () {
      const lp = new StellarBase.Address(LIQUIDITY_POOL_ZERO);
      expect(lp.toBuffer()).to.deep.equal(
        StellarBase.StrKey.decodeLiquidityPool(LIQUIDITY_POOL_ZERO)
      );
    });
  });
});
