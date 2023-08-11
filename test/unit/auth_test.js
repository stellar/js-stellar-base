const xdr = StellarBase.xdr;

describe('building authorization entries', function () {
  const accountId = StellarBase.Keypair.random();
  const contractId = 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE';

  const authEntry = new xdr.SorobanAuthorizationEntry({
    rootInvocation: new xdr.SorobanAuthorizedInvocation({
      function:
        xdr.SorobanAuthorizedFunction.sorobanAuthorizedFunctionTypeContractFn(
          new xdr.SorobanAuthorizedContractFunction({
            contractAddress: new StellarBase.Address(contractId).toScAddress(),
            functionName: Buffer.from('hello'),
            args: [xdr.ScVal.scvU64(1234n)]
          })
        ),
      subInvocations: []
    }),
    credentials: xdr.SorobanCredentials.sorobanCredentialsAddress(
      new xdr.SorobanAddressCredentials({
        address: new StellarBase.Address(accountId.publicKey()).toScAddress(),
        nonce: new xdr.Int64(123456789101112n),
        signatureExpirationLedger: 0,
        signatureArgs: []
      })
    )
  });

  const bigIntHandler = (key, value) =>
    typeof value === 'bigint' ? value.toString() : value; // return everything else unchanged

  // clone it since it modifies it in-place
  let ogEntry;
  it('built an mock entry correctly', function () {
    const rawEntry = authEntry.toXDR();
    ogEntry = xdr.SorobanAuthorizationEntry.fromXDR(rawEntry);
    expect(ogEntry.toXDR('base64')).to.eql(
      authEntry.toXDR('base64'),
      `cloning entry didn't work; before: ${JSON.stringify(
        authEntry,
        bigIntHandler,
        2
      )}\nafter: ${JSON.stringify(ogEntry, bigIntHandler, 2)}`
    );
  });

  it('signs the entry correctly', function (done) {
    StellarBase.authorizeEntry(authEntry, accountId, 10)
      .then((signedEntry) => {
        expect(signedEntry.rootInvocation().toXDR('base64')).to.eql(
          ogEntry.rootInvocation().toXDR('base64'),
          `invocation tree changed; before: ${JSON.stringify(
            ogEntry.rootInvocation(),
            bigIntHandler,
            2
          )}\nafter: ${JSON.stringify(
            signedEntry.rootInvocation(),
            bigIntHandler,
            2
          )}`
        );

        const signedAddr = signedEntry.credentials().address();
        expect(signedAddr.address()).to.eql(
          ogEntry.credentials().address().address()
        );
        expect(signedAddr.signatureExpirationLedger()).to.eql(10);
        expect(signedAddr.nonce()).to.eql(
          ogEntry.credentials().address().nonce()
        );

        const sigVals = signedAddr
          .signatureArgs()
          .map(StellarBase.scValToNative);

        expect(
          StellarBase.StrKey.encodeEd25519PublicKey(sigVals[0]['public_key'])
        ).to.eql(accountId.publicKey());

        done();
      })
      .catch((err) => done(err));
  });

  it('works with a callback', function (done) {
    StellarBase.authorizeEntry(
      authEntry,
      (preimage) => {
        return [
          accountId.sign(StellarBase.hash(preimage.toXDR())),
          accountId.publicKey()
        ];
      },
      10
    )
      .then((signedEntry) => {
        done();
      })
      .catch((err) => done(err));
  });

  const randomKp = StellarBase.Keypair.random();
  it('throws with a random signer', function () {
    expect(
      StellarBase.authorizeEntry(authEntry, randomKp, 10)
    ).to.eventually.be.rejectedWith(/identity doesn't match/i);
  });

  it('throws with a mismatched public key', function () {
    expect(
      StellarBase.authorizeEntry(
        authEntry,
        (preimage) => {
          return [
            accountId.sign(StellarBase.hash(preimage.toXDR())),
            randomKp.publicKey()
          ];
        },
        10
      )
    ).to.eventually.be.rejectedWith(/signature doesn't match/i);
  });

  it('throws with a bad signature', function () {
    expect(
      StellarBase.authorizeEntry(
        authEntry,
        (_) => {
          return [accountId.sign(Buffer.from('bs')), randomKp.publicKey()];
        },
        10
      )
    ).to.eventually.be.rejectedWith(/signature doesn't match/i);
  });
});
