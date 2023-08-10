const xdr = StellarBase.xdr;

function bytesToInt64(bytes) {
  // eslint-disable-next-line no-bitwise
  return bytes.subarray(0, 8).reduce((accum, b) => (accum << 8) | b, 0);
}

describe('building authorization entries', function () {
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const kp = StellarBase.Keypair.random();
  const nonce = new xdr.Int64(bytesToInt64(kp.rawPublicKey()));
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
      invocation,
      nonce
    );

    let cred = entry.credentials().address();
    let args = cred.signatureArgs().map((v) => StellarBase.scValToNative(v));

    expect(cred.signatureExpirationLedger()).to.equal(123);
    expect(args.length).to.equal(1);
    expect(
      StellarBase.StrKey.encodeEd25519PublicKey(args[0]['public_key'])
    ).to.equal(kp.publicKey());
    expect(entry.rootInvocation()).to.eql(invocation);
    expect(entry.credentials().address().nonce()).to.eql(nonce);

    // TODO: Validate the signature using the XDR structure.
  });

  it('works asynchronously', function (done) {
    StellarBase.authorizeInvocationCallback(
      kp.publicKey(),
      async (v) => kp.sign(v),
      StellarBase.Networks.FUTURENET,
      123,
      invocation,
      nonce
    )
      .then((entry) => {
        let cred = entry.credentials().address();
        let args = cred
          .signatureArgs()
          .map((v) => StellarBase.scValToNative(v));

        expect(cred.signatureExpirationLedger()).to.equal(123);
        expect(args.length).to.equal(1);
        expect(
          StellarBase.StrKey.encodeEd25519PublicKey(args[0]['public_key'])
        ).to.equal(kp.publicKey());
        expect(entry.rootInvocation()).to.eql(invocation);
        expect(cred.nonce()).to.eql(nonce);

        done();
      })
      .catch((err) => done(err));
  });
});
