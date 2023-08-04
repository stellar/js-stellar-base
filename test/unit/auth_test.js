const xdr = StellarBase.xdr;

describe('building authorization entries', function () {
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const kp = StellarBase.Keypair.random();
  const invocation = new xdr.SorobanAuthorizedInvocation({
    function:
      xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
        new xdr.InvokeContractArgs({
          contractAddress: new StellarBase.Address(contractId).toScAddress(),
          functionName: 'hello',
          args: [StellarBase.nativeToScVal('world!')]
        })
      ),
    subInvocations: []
  });

  it('built an mock invocation correctly', function () {
    invocation.toXDR();
  });

  it('works with keypairs', function () {
    const entry = StellarBase.authorizeInvocation(
      kp,
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    );

    let cred = entry.credentials().address();

    expect(cred.signatureExpirationLedger()).to.equal(123);
    expect(entry.rootInvocation()).to.eql(invocation);

    // TODO: Validate the signature using the XDR structure.
    let rawSig = cred.signature();
    expect(rawSig.switch()).to.eql(xdr.ScValType.scvBytes());
    let _ = StellarBase.scValToNative(rawSig);

    const nextEntry = StellarBase.authorizeInvocation(
      kp,
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    );
    const nextCred = nextEntry.credentials().address();

    expect(cred.nonce()).to.not.equal(nextCred.nonce());
  });

  it('works asynchronously', function (done) {
    StellarBase.authorizeInvocationCallback(
      kp.publicKey(),
      async (v) => kp.sign(v),
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    )
      .then((entry) => {
        let cred = entry.credentials().address();

        expect(cred.signatureExpirationLedger()).to.equal(123);
        expect(entry.rootInvocation()).to.eql(invocation);

        done();
      })
      .catch((err) => done(err));
  });
});
