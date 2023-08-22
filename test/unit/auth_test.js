const xdr = StellarBase.xdr;

describe("building authorization entries", function () {
  const contractId = "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE";
  const kp = StellarBase.Keypair.random();
  const invocation = new xdr.SorobanAuthorizedInvocation({
    function:
      xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
        new xdr.InvokeContractArgs({
          contractAddress: new StellarBase.Address(contractId).toScAddress(),
          functionName: "hello",
          args: [StellarBase.nativeToScVal("world!")]
        })
      ),
    subInvocations: []
  });

  it("built an mock invocation correctly", function () {
    invocation.toXDR();
  });

  it("works with keypairs", function () {
    const entry = StellarBase.authorizeInvocation(
      kp,
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    );

    let cred = entry.credentials().address();
    expect(cred.signatureExpirationLedger()).to.equal(123);
    expect(entry.rootInvocation()).to.eql(invocation);

    // sanity check raw xdr signature types: should be ScVal{
    //  type: ScVec,
    //  value: ScVec[
    //    Map{
    //      Symbol("public_key"): Buffer,
    //      Symbol("signature"): Buffer,
    //    }
    //  ]
    // }
    let sig = cred.signature();
    expect(sig.switch().name).to.equal("scvVec");

    let map = sig.value()[0];
    expect(map.switch().name).to.equal("scvMap");
    expect(map.value().length).to.equal(
      2,
      `expected two map entries, got: ${JSON.stringify(map.value())}`
    );
    map.value().forEach((entry) => {
      expect(entry.key().switch().name).to.equal(
        "scvSymbol",
        `entry key wasn't an ScSymbol: ${JSON.stringify(entry)}`
      );
    });

    let args = StellarBase.scValToNative(cred.signature())[0];
    expect(
      StellarBase.StrKey.encodeEd25519PublicKey(args["public_key"])
    ).to.equal(kp.publicKey());

    // TODO: Validate the signature using the XDR structure.
    let _ = args["signature"];

    const nextEntry = StellarBase.authorizeInvocation(
      kp,
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    );
    const nextCred = nextEntry.credentials().address();

    expect(cred.nonce()).to.not.equal(nextCred.nonce());
  });

  it("works asynchronously", function (done) {
    StellarBase.authorizeInvocationCallback(
      kp.publicKey(),
      async (v) => kp.sign(v),
      StellarBase.Networks.FUTURENET,
      1234,
      invocation
    )
      .then((entry) => {
        let cred = entry.credentials().address();
        expect(cred.signatureExpirationLedger()).to.equal(1234);
        expect(entry.rootInvocation()).to.eql(invocation);

        let args = StellarBase.scValToNative(cred.signature());
        expect(args).to.be.instanceOf(Array);
        expect(args.length).to.equal(1);
        expect(
          StellarBase.StrKey.encodeEd25519PublicKey(args[0]["public_key"])
        ).to.equal(kp.publicKey());

        // TODO: Validate the signature using the XDR structure.
        let _ = args[0]["signature"];

        done();
      })
      .catch((err) => done(err));
  });
});
