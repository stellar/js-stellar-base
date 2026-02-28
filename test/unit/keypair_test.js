describe('Keypair.contructor', function () {
  it('fails when passes secret key does not match public key', function () {
    let secret = 'SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36';
    let kp = StellarBase.Keypair.fromSecret(secret);

    let secretKey = kp.rawSecretKey();
    let publicKey = StellarBase.StrKey.decodeEd25519PublicKey(kp.publicKey());
    publicKey[0] = 0; // Make public key invalid

    expect(
      () => new StellarBase.Keypair({ type: 'ed25519', secretKey, publicKey })
    ).to.throw(/secretKey does not match publicKey/);
  });

  it('fails when secretKey length is invalid', function () {
    let secretKey = Buffer.alloc(33);
    expect(
      () => new StellarBase.Keypair({ type: 'ed25519', secretKey })
    ).to.throw(/secretKey length is invalid/);
  });

  it('fails when publicKey length is invalid', function () {
    let publicKey = Buffer.alloc(33);
    expect(
      () => new StellarBase.Keypair({ type: 'ed25519', publicKey })
    ).to.throw(/publicKey length is invalid/);
  });
});

describe('Keypair.fromSecret', function () {
  it('creates a keypair correctly', function () {
    let secret = 'SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36';
    let kp = StellarBase.Keypair.fromSecret(secret);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GDFQVQCYYB7GKCGSCUSIQYXTPLV5YJ3XWDMWGQMDNM4EAXAL7LITIBQ7'
    );
    expect(kp.secret()).to.eql(secret);
  });

  it("throw an error if the arg isn't strkey encoded as a seed", function () {
    expect(() => StellarBase.Keypair.fromSecret('hel0')).to.throw();
    expect(() =>
      StellarBase.Keypair.fromSecret(
        'SBWUBZ3SIPLLF5CCXLWUB2Z6UBTYAW34KVXOLRQ5HDAZG4ZY7MHNBWJ1'
      )
    ).to.throw();
    expect(() =>
      StellarBase.Keypair.fromSecret('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      StellarBase.Keypair.fromSecret(
        'gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu'
      )
    ).to.throw();
  });
});

describe('Keypair.fromRawEd25519Seed', function () {
  it('creates a keypair correctly', function () {
    let seed = 'masterpassphrasemasterpassphrase';
    let kp = StellarBase.Keypair.fromRawEd25519Seed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp.secret()).to.eql(
      'SBWWC43UMVZHAYLTONYGQ4TBONSW2YLTORSXE4DBONZXA2DSMFZWLP2R'
    );
    expect(kp.rawPublicKey().toString('hex')).to.eql(
      '2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432'
    );
  });

  it("throws an error if the arg isn't 32 bytes", function () {
    expect(() =>
      StellarBase.Keypair.fromRawEd25519Seed('masterpassphrasemasterpassphras')
    ).to.throw();
    expect(() =>
      StellarBase.Keypair.fromRawEd25519Seed(
        'masterpassphrasemasterpassphrase1'
      )
    ).to.throw();
    expect(() => StellarBase.Keypair.fromRawEd25519Seed(null)).to.throw();
    expect(() => StellarBase.Keypair.fromRawEd25519Seed()).to.throw();
  });
});

describe('Keypair.fromPublicKey', function () {
  it('creates a keypair correctly', function () {
    let kp = StellarBase.Keypair.fromPublicKey(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.publicKey()).to.eql(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    expect(kp.rawPublicKey().toString('hex')).to.eql(
      '2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432'
    );
  });

  it("throw an error if the arg isn't strkey encoded as a accountid", function () {
    expect(() => StellarBase.Keypair.fromPublicKey('hel0')).to.throw();
    expect(() =>
      StellarBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      StellarBase.Keypair.fromPublicKey(
        'sfyjodTxbwLtRToZvi6yQ1KnpZriwTJ7n6nrASFR6goRviCU3Ff'
      )
    ).to.throw();
  });

  it("throws an error if the address isn't 32 bytes", function () {
    expect(() =>
      StellarBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() =>
      StellarBase.Keypair.fromPublicKey('masterpassphrasemasterpassphrase')
    ).to.throw();
    expect(() => StellarBase.Keypair.fromPublicKey(null)).to.throw();
    expect(() => StellarBase.Keypair.fromPublicKey()).to.throw();
  });
});

describe('Keypair.random', function () {
  it('creates a keypair correctly', function () {
    let kp = StellarBase.Keypair.random();
    expect(kp).to.be.instanceof(StellarBase.Keypair);
  });
});

describe('Keypair.xdrMuxedAccount', function () {
  it('returns a valid MuxedAccount with a Ed25519 key type', function () {
    const kp = StellarBase.Keypair.fromPublicKey(
      'GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH'
    );
    const muxed = kp.xdrMuxedAccount();
    expect(muxed).to.be.instanceof(StellarBase.xdr.MuxedAccount);
    expect(muxed.switch()).to.be.equal(
      StellarBase.xdr.CryptoKeyType.keyTypeEd25519()
    );
  });
});

describe('Keypair.sign*Decorated', function () {
  describe('returning the correct hints', function () {
    const secret = 'SDVSYBKP7ESCODJSNGVDNXAJB63NPS5GQXSBZXLNT2Y4YVUJCFZWODGJ';
    const kp = StellarBase.Keypair.fromSecret(secret);

    // Note: these were generated using the Go SDK as a source of truth
    const CASES = [
      {
        data: [1, 2, 3, 4, 5, 6],
        regular: [8, 170, 203, 16],
        payload: [11, 174, 206, 22]
      },
      {
        data: [1, 2],
        regular: [8, 170, 203, 16],
        payload: [9, 168, 203, 16]
      },
      {
        data: [],
        regular: [8, 170, 203, 16],
        payload: [8, 170, 203, 16]
      }
    ];

    CASES.forEach((testCase) => {
      const data = testCase.data;
      const sig = kp.sign(data);

      it(`signedPayloads#${data.length}`, function () {
        const expectedXdr = new StellarBase.xdr.DecoratedSignature({
          hint: testCase.payload,
          signature: sig
        });

        const decoSig = kp.signPayloadDecorated(data);
        expect(decoSig.toXDR('hex')).to.eql(expectedXdr.toXDR('hex'));
      });

      it(`regular#${data.length}`, function () {
        const expectedXdr = new StellarBase.xdr.DecoratedSignature({
          hint: testCase.regular,
          signature: sig
        });

        const decoSig = kp.signDecorated(data);
        expect(decoSig.toXDR('hex')).to.eql(expectedXdr.toXDR('hex'));
      });
    });
  });
});

describe('Keypair.signMessage and Keypair.verifyMessage (SEP-53)', function () {
  // Test vectors from SEP-53 specification
  // https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0053.md
  const SEP53_TEST_PUBLIC_KEY =
    'GBXFXNDLV4LSWA4VB7YIL5GBD7BVNR22SGBTDKMO2SBZZHDXSKZYCP7L';
  const SEP53_TEST_SECRET_KEY =
    'SAKICEVQLYWGSOJS4WW7HZJWAHZVEEBS527LHK5V4MLJALYKICQCJXMW';

  // Test case from SEP-53: message = "Hello, World!"
  // Signature in base64 from spec: fO5dbYhXUhBMhe6kId/cuVq/AfEnHRHEvsP8vXh03M1uLpi5e46yO2Q8rEBzu3feXQewcQE5GArp88u6ePK6BA==
  const SEP53_TEST_MESSAGE = 'Hello, World!';
  const SEP53_TEST_SIGNATURE_BASE64 =
    'fO5dbYhXUhBMhe6kId/cuVq/AfEnHRHEvsP8vXh03M1uLpi5e46yO2Q8rEBzu3feXQewcQE5GArp88u6ePK6BA==';

  describe('Keypair.signMessage', function () {
    it('signs a message correctly according to SEP-53', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const signature = kp.signMessage(SEP53_TEST_MESSAGE);

      expect(signature.length).to.equal(64);
      expect(Buffer.from(signature).toString('base64')).to.equal(
        SEP53_TEST_SIGNATURE_BASE64
      );
    });

    it('signs a message passed as Buffer', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const messageBuffer = Buffer.from(SEP53_TEST_MESSAGE, 'utf8');
      const signature = kp.signMessage(messageBuffer);

      expect(Buffer.from(signature).toString('base64')).to.equal(
        SEP53_TEST_SIGNATURE_BASE64
      );
    });

    it('throws an error when keypair has no secret key', function () {
      const kp = StellarBase.Keypair.fromPublicKey(SEP53_TEST_PUBLIC_KEY);
      expect(() => kp.signMessage(SEP53_TEST_MESSAGE)).to.throw(
        /cannot sign.*no secret key/
      );
    });

    it('produces consistent signatures for the same message', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const sig1 = kp.signMessage(SEP53_TEST_MESSAGE);
      const sig2 = kp.signMessage(SEP53_TEST_MESSAGE);

      expect(Buffer.from(sig1).toString('base64')).to.equal(
        Buffer.from(sig2).toString('base64')
      );
    });

    it('produces different signatures for different messages', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const sig1 = kp.signMessage('Message A');
      const sig2 = kp.signMessage('Message B');

      expect(Buffer.from(sig1).toString('base64')).to.not.equal(
        Buffer.from(sig2).toString('base64')
      );
    });

    it('handles empty messages', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const signature = kp.signMessage('');

      expect(signature.length).to.equal(64);
    });

    it('handles unicode messages correctly', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const unicodeMessage = '🚀 Stellar to the moon! 月へ';
      const signature = kp.signMessage(unicodeMessage);

      expect(signature.length).to.equal(64);

      // Verify it can be verified
      expect(kp.verifyMessage(unicodeMessage, signature)).to.be.true;
    });
  });

  describe('Keypair.verifyMessage', function () {
    it('verifies a valid SEP-53 signature', function () {
      const kp = StellarBase.Keypair.fromPublicKey(SEP53_TEST_PUBLIC_KEY);
      const signature = Buffer.from(SEP53_TEST_SIGNATURE_BASE64, 'base64');

      expect(kp.verifyMessage(SEP53_TEST_MESSAGE, signature)).to.be.true;
    });

    it('verifies a message passed as Buffer', function () {
      const kp = StellarBase.Keypair.fromPublicKey(SEP53_TEST_PUBLIC_KEY);
      const messageBuffer = Buffer.from(SEP53_TEST_MESSAGE, 'utf8');
      const signature = Buffer.from(SEP53_TEST_SIGNATURE_BASE64, 'base64');

      expect(kp.verifyMessage(messageBuffer, signature)).to.be.true;
    });

    it('rejects an invalid signature', function () {
      const kp = StellarBase.Keypair.fromPublicKey(SEP53_TEST_PUBLIC_KEY);
      const invalidSignature = Buffer.alloc(64, 0);

      expect(kp.verifyMessage(SEP53_TEST_MESSAGE, invalidSignature)).to.be
        .false;
    });

    it('rejects a signature for a different message', function () {
      const kp = StellarBase.Keypair.fromPublicKey(SEP53_TEST_PUBLIC_KEY);
      const signature = Buffer.from(SEP53_TEST_SIGNATURE_BASE64, 'base64');

      expect(kp.verifyMessage('Different message', signature)).to.be.false;
    });

    it('rejects a signature from a different signer', function () {
      // Create a different keypair
      const differentKp = StellarBase.Keypair.fromSecret(
        'SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36'
      );
      const signature = Buffer.from(SEP53_TEST_SIGNATURE_BASE64, 'base64');

      expect(differentKp.verifyMessage(SEP53_TEST_MESSAGE, signature)).to.be
        .false;
    });

    it('works with keypair that has secret key', function () {
      const kp = StellarBase.Keypair.fromSecret(SEP53_TEST_SECRET_KEY);
      const signature = Buffer.from(SEP53_TEST_SIGNATURE_BASE64, 'base64');

      expect(kp.verifyMessage(SEP53_TEST_MESSAGE, signature)).to.be.true;
    });
  });

  describe('round-trip signing and verification', function () {
    it('can sign and verify with the same keypair', function () {
      const kp = StellarBase.Keypair.random();
      const message = 'Test message for round-trip';
      const signature = kp.signMessage(message);

      expect(kp.verifyMessage(message, signature)).to.be.true;
    });

    it('can sign and verify with separate keypairs (secret and public)', function () {
      const secretKp = StellarBase.Keypair.random();
      const publicKp = StellarBase.Keypair.fromPublicKey(secretKp.publicKey());

      const message = 'Test message';
      const signature = secretKp.signMessage(message);

      expect(publicKp.verifyMessage(message, signature)).to.be.true;
    });

    it('handles long messages', function () {
      const kp = StellarBase.Keypair.random();
      const longMessage = 'A'.repeat(10000);
      const signature = kp.signMessage(longMessage);

      expect(kp.verifyMessage(longMessage, signature)).to.be.true;
    });

    it('handles binary data as Buffer', function () {
      const kp = StellarBase.Keypair.random();
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
      const signature = kp.signMessage(binaryData);

      expect(kp.verifyMessage(binaryData, signature)).to.be.true;
    });
  });
});
