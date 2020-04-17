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

    describe('muxed account', function() {
      it('decodes med25519 correctly', function() {
        const med25519 = new StellarBase.xdr.MuxedAccountMed25519({
          id: StellarBase.xdr.Uint64.fromString('0'),
          ed25519: StellarBase.StrKey.decodeEd25519PublicKey(
            'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
          )
        });
        let expectedBuffer = StellarBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
          med25519
        ).toXDR();
        let strkey =
          'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL6';
        expect(StellarBase.StrKey.decodeMuxedAccount(strkey)).to.eql(
          expectedBuffer
        );
      });

      it('decodes ed25519 correctly', function() {
        const rawEd25519 = StellarBase.StrKey.decodeEd25519PublicKey(
          'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
        );
        const expectedBuffer = StellarBase.xdr.MuxedAccount.keyTypeEd25519(
          rawEd25519
        ).toXDR();
        const strkey =
          'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

        expect(StellarBase.StrKey.decodeMuxedAccount(strkey)).to.eql(
          expectedBuffer
        );
      });

      it('throws an error: unused trailing bit must be zero in the encoding of the last three bytes (24 bits) as five base-32 symbols (25 bits)', function() {
        // unused trailing bit must be zero in the encoding of the last three bytes (24 bits) as five base-32 symbols (25 bits)
        expect(() =>
          StellarBase.StrKey.decodeMuxedAccount(
            'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL7'
          )
        ).to.throw(/invalid encoded string/);
      });

      it('throws an error if strkey has an invalid algorithm', function() {
        // Invalid algorithm (low 3 bits of version byte are 7)
        expect(() =>
          StellarBase.StrKey.decodeMuxedAccount(
            'M4AAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITIU2K'
          )
        ).to.throw(/invalid version byte/);
      });

      it('throws an error if strkey has an invalid length', function() {
        expect(() =>
          StellarBase.StrKey.decodeMuxedAccount(
            'MCAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOGA'
          )
        ).to.throw(/invalid encoded string/);
      });

      it('throws an error with if strkey has padding bytes ', function() {
        expect(() =>
          StellarBase.StrKey.decodeMuxedAccount(
            'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL6==='
          )
        ).to.throw(/invalid encoded string/);
      });

      it('throws an error with an invalid checksum', function() {
        expect(() =>
          StellarBase.StrKey.decodeMuxedAccount(
            'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL4'
          )
        ).to.throw(/invalid checksum/);
      });
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

    describe('muxed account', function() {
      it('encodes med25519 accounts correctly', function() {
        const med25519 = new StellarBase.xdr.MuxedAccountMed25519({
          id: StellarBase.xdr.Uint64.fromString('0'),
          ed25519: StellarBase.StrKey.decodeEd25519PublicKey(
            'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
          )
        });
        const buffer = StellarBase.xdr.MuxedAccount.keyTypeMuxedEd25519(
          med25519
        ).toXDR();

        let expectedMuxedAccount =
          'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITLVL6';
        expect(StellarBase.StrKey.encodeMuxedAccount(buffer)).to.eql(
          expectedMuxedAccount
        );
      });
      it('encodes ed25519 accounts correctly', function() {
        const ed25519 = StellarBase.StrKey.decodeEd25519PublicKey(
          'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ'
        );

        const buffer = StellarBase.xdr.MuxedAccount.keyTypeEd25519(
          ed25519
        ).toXDR();

        let expectedMuxedAccount =
          'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
        expect(StellarBase.StrKey.encodeMuxedAccount(buffer)).to.eql(
          expectedMuxedAccount
        );
      });
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
});
