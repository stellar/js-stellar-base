import { prngInt64 } from '../../src/auth';

const xdr = StellarBase.xdr;

function buildInvocation(contractId) {
  return new xdr.SorobanAuthorizedInvocation({
    function:
      xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
        new xdr.SorobanAuthorizedContractFunction({
          contractAddress: new StellarBase.Address(contractId).toScAddress(),
          functionName: 'hello',
          args: [
            StellarBase.nativeToScVal('world!'),
            StellarBase.nativeToScVal(true)
          ]
        })
      ),
    // just to test nesting
    subInvocations: [
      new xdr.SorobanAuthorizedInvocation({
        function:
          xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
            new xdr.SorobanAuthorizedContractFunction({
              contractAddress: new StellarBase.Address(
                contractId
              ).toScAddress(),
              functionName: 'goodbye',
              args: [
                StellarBase.nativeToScVal(['cruel', 'world!']),
                StellarBase.nativeToScVal(false)
              ]
            })
          ),
        subInvocations: []
      })
    ]
  });
}

describe('building authorization entries', function () {
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';
  const invocation = buildInvocation(contractId);
  const kp = StellarBase.Keypair.random();

  it('generates reasonably random numbers', function () {
    const val = prngInt64();
    expect(val).to.be.instanceof(xdr.Int64);

    //
    // there should be no duplicates after 1000 attempts (ASTRONOMICALLY
    // unlikely): we check this by sorting the nonces and ensuring no neighbors
    // match
    //
    const nonces = new Array(1000).map(StellarBase.prngInt64).sort();
    nonces.forEach((elem, idx) => {
      if (idx == nonces.length - 1) {
        return; // skip last elem
      }

      expect(elem).not.to.equal(nonces[idx + 1], `bad prng: ${nonces}`);
    });
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

    it('generates the right signature', function () {
      // verify that when using ONLY the entry (i.e. the thing submitted to
      // core), not the envelope, you can generate the SAME envelope and
      // verify it against the signature (aka this is what core does)
      const expectedHash = new xdr.HashIdPreimageSorobanAuthorization({
        networkId: StellarBase.hash(StellarBase.Networks.FUTURENET),
        nonce: cred.nonce(),
        signatureExpirationLedger: cred.signatureExpirationLedger(),
        invocation: entry.rootInvocation()
      });

      const payload = StellarBase.hash(expectedHash.toXDR());
      expect(kp.verify(payload, args[1]['signature'])).to.be.true;
    });

    it('changes the nonce on a retry', function () {
      const nextEntry = StellarBase.authorizeInvocation(
        kp,
        StellarBase.Networks.FUTURENET,
        123,
        invocation
      );
      const nextCred = nextEntry.credentials().address();

      // verify that the nonce changes on re-auth
      expect(cred.nonce()).to.not.equal(nextCred.nonce());
    });
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
        let args = cred
          .signatureArgs()
          .map((v) => StellarBase.scValToNative(v));

        expect(cred.signatureExpirationLedger()).to.equal(123);
        expect(args.length).to.equal(1);
        expect(
          StellarBase.StrKey.encodeEd25519PublicKey(args[0]['public_key'])
        ).to.equal(kp.publicKey());
        expect(entry.rootInvocation()).to.eql(invocation);

        done();
      })
      .catch((err) => done(err));
  });

  it('works in separate parts', function () {
    const preimage = StellarBase.buildAuthEnvelope(
      StellarBase.Networks.FUTURENET,
      1234,
      invocation
    );
    const env = preimage.sorobanAuthorization();

    const entry = StellarBase.buildAuthEntry(
      preimage,
      kp.sign(StellarBase.hash(preimage.toXDR())),
      kp.publicKey()
    );
    const cred = entry.credentials().address();

    expect(entry.rootInvocation()).to.eql(invocation);
    expect(cred.nonce()).to.eql(env.nonce());
    expect(cred.signatureExpirationLedger()).to.eql(
      env.signatureExpirationLedger()
    );
  });
});
