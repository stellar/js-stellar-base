describe('SignerKey', function () {
  describe('encode/decode roundtrip', function () {
    const TEST_CASES = [
      {
        strkey: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
        type: StellarBase.xdr.SignerKeyType.signerKeyTypeEd25519()
      },
      {
        strkey: 'TBU2RRGLXH3E5CQHTD3ODLDF2BWDCYUSSBLLZ5GNW7JXHDIYKXZWHXL7',
        type: StellarBase.xdr.SignerKeyType.signerKeyTypePreAuthTx()
      },
      {
        strkey: 'XBU2RRGLXH3E5CQHTD3ODLDF2BWDCYUSSBLLZ5GNW7JXHDIYKXZWGTOG',
        type: StellarBase.xdr.SignerKeyType.signerKeyTypeHashX()
      },
      {
        strkey:
          'PA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAQACAQDAQCQMBYIBEFAWDANBYHRAEISCMKBKFQXDAMRUGY4DUPB6IBZGM',
        type: StellarBase.xdr.SignerKeyType.signerKeyTypeEd25519SignedPayload()
      }
    ];

    TEST_CASES.forEach((testCase) => {
      it(`works for ${testCase.strkey.substring(0, 5)}...`, function () {
        const skey = StellarBase.SignerKey.decodeAddress(testCase.strkey);
        expect(skey.switch()).to.eql(testCase.type);

        const rawXdr = skey.toXDR('raw');
        const rawSk = StellarBase.xdr.SignerKey.fromXDR(rawXdr, 'raw');
        expect(rawSk).to.eql(skey);

        const address = StellarBase.SignerKey.encodeSignerKey(skey);
        expect(address).to.equal(testCase.strkey);
      });
    });

    it('roundtrip is identity for signed payloads with non-multiple-of-4 lengths', function () {
      const ed25519 = Buffer.alloc(32, 0x01);
      // 29 % 4 = 1 (3 padding bytes), 30 % 4 = 2 (2 bytes), 31 % 4 = 3 (1 byte)
      [29, 30, 31].forEach((len) => {
        const payload = Buffer.alloc(len, 0xab);
        const signerKey =
          StellarBase.xdr.SignerKey.signerKeyTypeEd25519SignedPayload(
            new StellarBase.xdr.SignerKeyEd25519SignedPayload({
              ed25519,
              payload
            })
          );
        const address = StellarBase.SignerKey.encodeSignerKey(signerKey);
        const decoded = StellarBase.SignerKey.decodeAddress(address);

        expect(decoded.ed25519SignedPayload().payload()).to.have.lengthOf(len);
        expect(StellarBase.SignerKey.encodeSignerKey(decoded)).to.equal(
          address
        );
      });
    });
  });

  describe('error cases', function () {
    [
      // these are valid strkeys, just not valid signers
      'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK',
      // this is (literal) nonsense
      'NONSENSE'
    ].forEach((strkey) => {
      it(`fails on ${strkey.substring(0, 5)}...`, function () {
        expect(() => {
          StellarBase.SignerKey.decodeAddress(strkey);
        }).to.throw(/invalid signer key type/i);
      });
    });

    it('fails on invalid strkey', function () {
      expect(() =>
        // address taken from strkey_test.js#invalidStrKeys
        StellarBase.SignerKey.decodeAddress(
          'G47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVP2I'
        )
      ).to.throw(/invalid version byte/i);
    });
  });
});
