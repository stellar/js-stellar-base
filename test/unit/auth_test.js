const { xdr, Address, scValToNative, StrKey } = StellarBase;

describe("building authorization entries", function () {
  const kp = StellarBase.Keypair.random();
  const contractId = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";

  const authEntry = new xdr.SorobanAuthorizationEntry({
    rootInvocation: new xdr.SorobanAuthorizedInvocation({
      function:
        xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
          new xdr.InvokeContractArgs({
            contractAddress: new Address(contractId).toScAddress(),
            functionName: "hello",
            args: [xdr.ScVal.scvU64(1234n)]
          })
        ),
      subInvocations: []
    }),
    credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
      new xdr.SorobanAddressCredentials({
        address: new Address(kp.publicKey()).toScAddress(),
        nonce: new xdr.Int64(123456789101112n),
        signatureExpirationLedger: 0,
        signature: xdr.ScVal.scvVec([])
      })
    )
  });

  // handle bigints when serializing to JSON
  const biHandler = (_, v) => (typeof v === "bigint" ? v.toString() : v);

  it("built an mock entry correctly", function () {
    authEntry.toXDR();
  });

  [
    [kp, "Keypair"],
    [(preimage) => kp.sign(StellarBase.hash(preimage.toXDR())), "callback"],
    [
      (preimage) => {
        return {
          signature: kp.sign(StellarBase.hash(preimage.toXDR())),
          publicKey: kp.publicKey()
        };
      },
      "callback w/ obj"
    ]
  ].forEach(([signer, methodName]) => {
    it(`signs the entry correctly (${methodName})`, function (done) {
      StellarBase.authorizeEntry(authEntry, signer, 10)
        .then((signedEntry) => {
          expect(signedEntry.rootInvocation().toXDR()).to.eql(
            authEntry.rootInvocation().toXDR(),
            `invocation tree changed! before: ${authEntry.rootInvocation()},` +
              `after: ${JSON.stringify(signedEntry)}`
          );

          const signedAddr = signedEntry.credentials().address();
          const entryAddr = authEntry.credentials().address();
          expect(signedAddr.signatureExpirationLedger()).to.eql(10);
          expect(signedAddr.address()).to.eql(entryAddr.address());
          expect(signedAddr.nonce()).to.eql(entryAddr.nonce());

          const sigArgs = signedAddr.signature().vec().map(scValToNative);
          expect(sigArgs).to.have.lengthOf(1);

          const sig = sigArgs[0];
          expect(sig).to.have.property("public_key");
          expect(sig).to.have.property("signature");
          expect(StrKey.encodeEd25519PublicKey(sig.public_key)).to.eql(
            kp.publicKey()
          );

          done();
        })
        .catch((err) => done(err));
    });
  });

  it("throws with a random signer", function () {
    const randomKp = StellarBase.Keypair.random();
    expect(
      StellarBase.authorizeEntry(authEntry, randomKp, 10)
    ).to.eventually.be.rejectedWith(/identity doesn't match/i);
  });

  it("throws with a bad signature", function () {
    expect(
      StellarBase.authorizeEntry(
        authEntry,
        (_) => accountId.sign(Buffer.from("bs")),
        10
      )
    ).to.eventually.be.rejectedWith(/signature doesn't match/i);
  });

  it("can build from scratch", function (done) {
    StellarBase.authorizeInvocation(kp, 10, authEntry.rootInvocation())
      .then((signedEntry) => done())
      .catch((err) => done(err));
  });

  describe("nonce generation uses all 8 bytes", function () {
    let sandbox;

    beforeEach(function () {
      sandbox = sinon.createSandbox();
    });

    afterEach(function () {
      sandbox.restore();
    });

    function stubRawBytes(first8) {
      const raw = new Uint8Array(32);
      raw.set(first8);
      sandbox
        .stub(StellarBase.Keypair, "random")
        .returns({ rawPublicKey: () => raw });
    }

    // Regression: the old `<<` (Int32 shift) implementation discarded the upper 4
    // bytes. bytes [0,0,0,1, 0,0,0,0] — after consuming bytes 0-3 the accumulator
    // reaches 1, then four more left-shifts overflow Int32 back to 0. The nonce was
    // 0 instead of the correct 2^32.
    it("upper 4 bytes contribute to the nonce", async function () {
      stubRawBytes([0, 0, 0, 1, 0, 0, 0, 0]);
      const entry = await StellarBase.authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation()
      );
      expect(entry.credentials().address().nonce()).to.eql(
        new xdr.Int64(4294967296n)
      ); // 2^32
    });

    it("all-0xFF bytes produce nonce -1 (signed Int64 all-bits-set)", async function () {
      stubRawBytes([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
      const entry = await StellarBase.authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation()
      );
      expect(entry.credentials().address().nonce()).to.eql(new xdr.Int64(-1n));
    });

    it("high bit set produces Int64 minimum value", async function () {
      stubRawBytes([0x80, 0, 0, 0, 0, 0, 0, 0]);
      const entry = await StellarBase.authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation()
      );
      expect(entry.credentials().address().nonce()).to.eql(
        new xdr.Int64(-9223372036854775808n)
      ); // -(2^63), Int64 minimum
    });

    it("all-zero bytes produce nonce 0", async function () {
      stubRawBytes([0, 0, 0, 0, 0, 0, 0, 0]);
      const entry = await StellarBase.authorizeInvocation(
        kp,
        10,
        authEntry.rootInvocation()
      );
      expect(entry.credentials().address().nonce()).to.eql(new xdr.Int64(0n));
    });
  });
});
