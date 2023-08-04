const xdr = StellarBase.xdr;

describe('building authorization entries', function () {
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const kp = StellarBase.Keypair.random();
  const invocation = new xdr.SorobanAuthorizedInvocation({
    function:
      xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
        new xdr.SorobanAuthorizedContractFunction({
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
    let args = cred.signatureArgs().map((v) => StellarBase.scValToNative(v));

    expect(cred.signatureExpirationLedger()).to.equal(123);
    expect(args.length).to.equal(1);
    expect(
      StellarBase.StrKey.encodeEd25519PublicKey(args[0]['public_key'])
    ).to.equal(kp.publicKey());
    expect(entry.rootInvocation()).to.eql(invocation);

    // TODO: Validate the signature using the XDR structure.

    const nextEntry = StellarBase.authorizeInvocation(
      kp,
      StellarBase.Networks.FUTURENET,
      123,
      invocation
    );
    const nextCred = nextEntry.credentials().address();

    expect(cred.nonce()).to.not.equal(nextCred.nonce());

    const thirdEntry = StellarBase.authorizeInvocationCallback(
      (input) => { return kp.sign(input); },
      kp.publicKey(),
      StellarBase.Networks.FUTURENET,
      123,
      invocation,
    );

    cred = thirdEntry.credentials().address();
    args = cred.signatureArgs().map((v) => StellarBase.scValToNative(v));

    expect(cred.signatureExpirationLedger()).to.equal(123);
    expect(args.length).to.equal(1);
    expect(
      StellarBase.StrKey.encodeEd25519PublicKey(args[0]['public_key'])
    ).to.equal(kp.publicKey());
    expect(entry.rootInvocation()).to.eql(invocation);

  });
});
