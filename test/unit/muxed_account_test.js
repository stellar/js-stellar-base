describe('muxed account abstraction works', function() {
  const PUBKEY = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
  const MPUBKEY_ZERO =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ';
  const MPUBKEY_ID =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAABUTGI4';
  const MPUBKEY_ID2 =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAABQHF6OU';

  const performBasicInvariantChecks = function(mux, id, expectedM) {
    expect(mux.accountId()).to.equal(PUBKEY);
    expect(mux.address()).to.equal(expectedM);
    expect(mux.id()).to.equal(id);

    const muxXdr = mux.asXDRObject();
    expect(muxXdr.switch()).to.equal(
      StellarBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
    );

    const innerMux = muxXdr.med25519();
    expect(innerMux.ed25519()).to.eql(
      StellarBase.StrKey.decodeEd25519PublicKey(PUBKEY)
    );
    expect(innerMux.id()).to.eql(StellarBase.xdr.Uint64.fromString(id));

    return muxXdr;
  };

  it('can construct from a G address', function() {
    const mux = new StellarBase.MuxedAccount(PUBKEY);
    performBasicInvariantChecks(mux, '0', MPUBKEY_ZERO);
  });
  it('can construct from an M address', function() {
    const mux = new StellarBase.MuxedAccount(MPUBKEY_ZERO);
    performBasicInvariantChecks(mux, '0', MPUBKEY_ZERO);
  });
  it('can construct from an M address w/ an ID', function() {
    const mux = new StellarBase.MuxedAccount(MPUBKEY_ID);
    performBasicInvariantChecks(mux, '420', MPUBKEY_ID);
  });

  it('can construct copies', function() {
    const baselineMux = new StellarBase.MuxedAccount(MPUBKEY_ID);
    const mux = new StellarBase.MuxedAccount(MPUBKEY_ID);
    const mux2 = mux.createSubaccount('12345');

    expect(baselineMux.equals(mux)).to.be.true; // ensure `mux` is unchanged
    performBasicInvariantChecks(mux2, '12345', MPUBKEY_ID2);
  });

  it('can construct from an XDR object', function() {
    const xdrMuxed = StellarBase.encodeMuxedAccount(PUBKEY, '12345');
    const muxBaseline = new StellarBase.MuxedAccount(MPUBKEY_ID2);
    const mux = new StellarBase.MuxedAccount.fromXDRObject(xdrMuxed);

    expect(mux.equals(muxBaseline)).to.be.true;
    expect(mux).to.eql(muxBaseline);
  });
});
