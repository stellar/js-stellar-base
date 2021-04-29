const { ENGINE_METHOD_PKEY_METHS } = require('constants');

describe('StrKey', function() {
  beforeEach(function() {
    var keypair = StellarBase.Keypair.master(
      'Test SDF Network ; September 2015'
    );
    this.unencodedBuffer = keypair.rawPublicKey();
    this.unencoded = this.unencodedBuffer.toString();
    this.accountIdEncoded = keypair.publicKey();
    this.seedEncoded = StellarBase.StrKey.encodeEd25519SecretSeed(
      this.unencodedBuffer
    );
  });
  describe('#decodeCheck', function() {
    it('decodes correctly', function() {
      expect(
        StellarBase.StrKey.decodeEd25519PublicKey(this.accountIdEncoded)
      ).to.eql(this.unencodedBuffer);
      expect(
        StellarBase.StrKey.decodeEd25519SecretSeed(this.seedEncoded)
      ).to.eql(this.unencodedBuffer);
    });

    it('throws an error when the version byte is wrong', function() {
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL'
        )
      ).to.throw(/invalid version/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCU'
        )
      ).to.throw(/invalid version/);
    });

    it('throws an error when decoded data encodes to other string', function() {
      // accountId
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T'
        )
      ).to.throw(/invalid encoded string/);
      // seed
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYW'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2T'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SCMB30FQCIQAWZ4WQTS6SVK37LGMAFJGXOZIHTH2PY6EXLP37G46H6DT'
        )
      ).to.throw(/invalid encoded string/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SAYC2LQ322EEHZYWNSKBEW6N66IRTDREEBUXXU5HPVZGMAXKLIZNM45H++'
        )
      ).to.throw(/invalid encoded string/);
    });

    it('throws an error when the checksum is wrong', function() {
      expect(() =>
        StellarBase.StrKey.decodeEd25519PublicKey(
          'GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVT'
        )
      ).to.throw(/invalid checksum/);
      expect(() =>
        StellarBase.StrKey.decodeEd25519SecretSeed(
          'SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCX'
        )
      ).to.throw(/invalid checksum/);
    });
  });

  describe('#encodeCheck', function() {
    it('encodes a buffer correctly', function() {
      expect(
        StellarBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.eql(this.accountIdEncoded);
      expect(
        StellarBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.match(/^G/);
      expect(
        StellarBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.eql(this.seedEncoded);
      expect(
        StellarBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.match(/^S/);

      var strkeyEncoded;

      strkeyEncoded = StellarBase.StrKey.encodePreAuthTx(this.unencodedBuffer);
      expect(strkeyEncoded).to.match(/^T/);
      expect(StellarBase.StrKey.decodePreAuthTx(strkeyEncoded)).to.eql(
        this.unencodedBuffer
      );

      strkeyEncoded = StellarBase.StrKey.encodeSha256Hash(this.unencodedBuffer);
      expect(strkeyEncoded).to.match(/^X/);
      expect(StellarBase.StrKey.decodeSha256Hash(strkeyEncoded)).to.eql(
        this.unencodedBuffer
      );
    });

    it('encodes a buffer correctly', function() {
      expect(
        StellarBase.StrKey.encodeEd25519PublicKey(this.unencodedBuffer)
      ).to.eql(this.accountIdEncoded);
      expect(
        StellarBase.StrKey.encodeEd25519SecretSeed(this.unencodedBuffer)
      ).to.eql(this.seedEncoded);
    });

    it('throws an error when the data is null', function() {
      expect(() => StellarBase.StrKey.encodeEd25519SecretSeed(null)).to.throw(
        /null data/
      );
      expect(() => StellarBase.StrKey.encodeEd25519PublicKey(null)).to.throw(
        /null data/
      );
    });
  });

  describe('#isValidEd25519PublicKey', function() {
    it('returns true for valid public key', function() {
      var keys = [
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        'GB7KKHHVYLDIZEKYJPAJUOTBE5E3NJAXPSDZK7O6O44WR3EBRO5HRPVT',
        'GD6WVYRVID442Y4JVWFWKWCZKB45UGHJAABBJRS22TUSTWGJYXIUR7N2',
        'GBCG42WTVWPO4Q6OZCYI3D6ZSTFSJIXIS6INCIUF23L6VN3ADE4337AP',
        'GDFX463YPLCO2EY7NGFMI7SXWWDQAMASGYZXCG2LATOF3PP5NQIUKBPT',
        'GBXEODUMM3SJ3QSX2VYUWFU3NRP7BQRC2ERWS7E2LZXDJXL2N66ZQ5PT',
        'GAJHORKJKDDEPYCD6URDFODV7CVLJ5AAOJKR6PG2VQOLWFQOF3X7XLOG',
        'GACXQEAXYBEZLBMQ2XETOBRO4P66FZAJENDHOQRYPUIXZIIXLKMZEXBJ',
        'GDD3XRXU3G4DXHVRUDH7LJM4CD4PDZTVP4QHOO4Q6DELKXUATR657OZV',
        'GDTYVCTAUQVPKEDZIBWEJGKBQHB4UGGXI2SXXUEW7LXMD4B7MK37CWLJ'
      ];

      for (var i in keys) {
        expect(StellarBase.StrKey.isValidEd25519PublicKey(keys[i])).to.be.true;
      }
    });

    it('returns false for invalid public key', function() {
      var keys = [
        'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL',
        'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++',
        'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA',
        'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2',
        'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T',
        'GDXIIZTKTLVYCBHURXL2UPMTYXOVNI7BRAEFQCP6EZCY4JLKY4VKFNLT',
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
        'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wt',
        'test',
        null,
        'g4VPBPrHZkfE8CsjuG2S4yBQNd455UWmk' // Old network key
      ];

      for (var i in keys) {
        expect(StellarBase.StrKey.isValidEd25519PublicKey(keys[i])).to.be.false;
      }
    });
  });

  describe('#isValidSecretKey', function() {
    it('returns true for valid secret key', function() {
      var keys = [
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDY',
        'SCZTUEKSEH2VYZQC6VLOTOM4ZDLMAGV4LUMH4AASZ4ORF27V2X64F2S2',
        'SCGNLQKTZ4XCDUGVIADRVOD4DEVNYZ5A7PGLIIZQGH7QEHK6DYODTFEH',
        'SDH6R7PMU4WIUEXSM66LFE4JCUHGYRTLTOXVUV5GUEPITQEO3INRLHER',
        'SC2RDTRNSHXJNCWEUVO7VGUSPNRAWFCQDPP6BGN4JFMWDSEZBRAPANYW',
        'SCEMFYOSFZ5MUXDKTLZ2GC5RTOJO6FGTAJCF3CCPZXSLXA2GX6QUYOA7'
      ];

      for (var i in keys) {
        expect(StellarBase.StrKey.isValidEd25519SecretSeed(keys[i])).to.be.true;
      }
    });

    it('returns false for invalid secret key', function() {
      var keys = [
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        'SAB5556L5AN5KSR5WF7UOEFDCIODEWEO7H2UR4S5R62DFTQOGLKOVZDYT', // Too long
        'SAFGAMN5Z6IHVI3IVEPIILS7ITZDYSCEPLN4FN5Z3IY63DRH4CIYEV', // To short
        'SAFGAMN5Z6IHVI3IVEPIILS7ITZDYSCEPLN4FN5Z3IY63DRH4CIYEVIT', // Checksum
        'test',
        null
      ];

      for (var i in keys) {
        expect(StellarBase.StrKey.isValidEd25519SecretSeed(keys[i])).to.be
          .false;
      }
    });
  });

  const PUBKEY = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
  const MPUBKEY =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK';
  const RAW_MPUBKEY = Buffer.from([
    0x3f,
    0x0c,
    0x34,
    0xbf,
    0x93,
    0xad,
    0x0d,
    0x99,
    0x71,
    0xd0,
    0x4c,
    0xcc,
    0x90,
    0xf7,
    0x05,
    0x51,
    0x1c,
    0x83,
    0x8a,
    0xad,
    0x97,
    0x34,
    0xa4,
    0xa2,
    0xfb,
    0x0d,
    0x7a,
    0x03,
    0xfc,
    0x7f,
    0xe8,
    0x9a,
    0x80,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00
  ]);

  describe('#muxedAccounts', function() {
    it('encodes & decodes M... addresses correctly', function() {
      expect(StellarBase.StrKey.encodeMed25519PublicKey(RAW_MPUBKEY)).to.equal(
        MPUBKEY
      );
      expect(StellarBase.StrKey.decodeMed25519PublicKey(MPUBKEY)).to.eql(
        RAW_MPUBKEY
      );
    });
    it('decodes to an empty muxed account when given a G...', function() {
      const emptyMux = StellarBase.decodeAddressToMuxedAccount(PUBKEY, true);
      const ZERO = StellarBase.xdr.Uint64.fromString('0');

      expect(StellarBase.xdr.MuxedAccount.isValid(emptyMux)).to.be.true;
      expect(emptyMux.switch()).to.equal(
        StellarBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
      );
      expect(emptyMux.med25519().ed25519()).to.eql(
        StellarBase.StrKey.decodeEd25519PublicKey(PUBKEY)
      );
      expect(emptyMux.med25519().id()).to.eql(ZERO);
      expect(StellarBase.encodeMuxedAccountToAddress(emptyMux)).to.equal(
        PUBKEY
      );
    });
    it('decodes underlying G... address correctly', function() {
      expect(
        StellarBase.encodeMuxedAccountToAddress(
          StellarBase.decodeAddressToMuxedAccount(MPUBKEY, true)
        )
      ).to.equal(PUBKEY);
    });
  });

  describe('#muxedAccounts', function() {
    const RAW_PUBKEY = StellarBase.StrKey.decodeEd25519PublicKey(PUBKEY);
    const unmuxed = StellarBase.xdr.MuxedAccount.keyTypeEd25519(RAW_PUBKEY);

    it('encodes & decodes unmuxed keys', function() {
      expect(StellarBase.xdr.MuxedAccount.isValid(unmuxed)).to.be.true;
      expect(unmuxed.switch()).to.equal(
        StellarBase.xdr.CryptoKeyType.keyTypeEd25519()
      );
      expect(unmuxed.ed25519()).to.eql(RAW_PUBKEY);

      const pubkey = StellarBase.encodeMuxedAccountToAddress(unmuxed);
      expect(pubkey).to.equal(PUBKEY);
    });

    const CASES = {
      MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK:
        '9223372036854775808', // 0x8000...
      MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAFB4CJJBRKA:
        '1357924680',
      MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAE2JUG6:
        '1234',
      MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ: '0'
    };

    for (const CASE_MPUBKEY in CASES) {
      const CASE_ID = CASES[CASE_MPUBKEY];

      it(`encodes & decodes muxed key w/ ID=${CASE_ID}`, function() {
        const muxed = StellarBase.decodeAddressToMuxedAccount(
          CASE_MPUBKEY,
          true
        );
        expect(StellarBase.xdr.MuxedAccount.isValid(muxed)).to.be.true;
        expect(muxed.switch()).to.equal(
          StellarBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
        );

        const innerMux = muxed.value();
        const id = StellarBase.xdr.Uint64.fromString(CASE_ID);
        expect(innerMux).to.be.an.instanceof(
          StellarBase.xdr.MuxedAccountMed25519
        );
        expect(innerMux.ed25519()).to.eql(unmuxed.ed25519());
        expect(innerMux.id()).to.eql(id);

        const mpubkey = StellarBase.encodeMuxedAccountToAddress(muxed, true);
        expect(mpubkey).to.equal(CASE_MPUBKEY);
      });
    }

    // From https://stellar.org/protocol/sep-23#invalid-test-cases
    const BAD_STRKEYS = [
      // The unused trailing bit must be zero in the encoding of the last three
      // bytes (24 bits) as five base-32 symbols (25 bits)
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUR',
      // Invalid length (congruent to 1 mod 8)
      'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZA',
      // Invalid algorithm (low 3 bits of version byte are 7)
      'G47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVP2I',
      // Invalid length (congruent to 6 mod 8)
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLKA',
      // Invalid algorithm (low 3 bits of version byte are 7)
      'M47QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ',
      // Padding bytes are not allowed
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUK===',
      // Invalid checksum
      'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUO'

      //
      // FIXME: The following test cases don't pass (i.e. don't throw).
      //        Fixing this would require a larger refactoring to the way strkey
      //        decoding works (strkey.js:decodeCheck), because the decoder
      //        doesn't perform length validation.
      //

      // Invalid length (Ed25519 should be 32 bytes, not 5)
      // "GAAAAAAAACGC6",
      // Invalid length (base-32 decoding should yield 35 bytes, not 36)
      // "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUACUSI",
      // Invalid length (base-32 decoding should yield 43 bytes, not 44)
      // "MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAAV75I",
    ];

    BAD_STRKEYS.forEach((address) => {
      it(`fails in expected case ${address}`, function() {
        let decoder;
        if (address.indexOf('G') === 0) {
          decoder = StellarBase.StrKey.decodeEd25519PublicKey;
        } else if (address.indexOf('M') === 0) {
          decoder = StellarBase.StrKey.decodeMed25519PublicKey;
        } else {
          expect(`can't understand address`).to.be.true;
        }

        expect(() => decoder(address)).to.throw();
      });
    });
  });
});
