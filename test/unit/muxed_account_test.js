describe('muxed account abstraction works', function() {
  const PUBKEY = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';
  const MPUBKEY_ZERO =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ';
  const MPUBKEY_ID =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAABUTGI4';

  it('generates addresses correctly', function() {
    let baseAccount = new StellarBase.Account(PUBKEY, '1');
    const mux = new StellarBase.MuxedAccount(baseAccount, '0');
    expect(mux.baseAccount().accountId()).to.equal(PUBKEY);
    expect(mux.accountId()).to.equal(MPUBKEY_ZERO);
    expect(mux.id()).to.equal('0');

    expect(mux.setId('420').id()).to.equal('420');
    expect(mux.accountId()).to.equal(MPUBKEY_ID);

    const muxXdr = mux.asXDRObject();
    expect(muxXdr.switch()).to.equal(
      StellarBase.xdr.CryptoKeyType.keyTypeMuxedEd25519()
    );

    const innerMux = muxXdr.med25519();
    expect(innerMux.ed25519()).to.eql(
      StellarBase.StrKey.decodeEd25519PublicKey(PUBKEY)
    );
    expect(innerMux.id()).to.eql(StellarBase.xdr.Uint64.fromString('420'));
  });

  it('tracks sequence numbers correctly', function() {
    let baseAccount = new StellarBase.Account(PUBKEY, '12345');
    const mux1 = new StellarBase.MuxedAccount(baseAccount, '1');
    const mux2 = new StellarBase.MuxedAccount(baseAccount, '2');

    expect(baseAccount.sequenceNumber()).to.equal('12345');
    expect(mux1.sequenceNumber()).to.equal('12345');
    expect(mux2.sequenceNumber()).to.equal('12345');

    mux1.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12346');
    expect(mux1.sequenceNumber()).to.equal('12346');
    expect(mux2.sequenceNumber()).to.equal('12346');

    mux2.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12347');
    expect(mux1.sequenceNumber()).to.equal('12347');
    expect(mux2.sequenceNumber()).to.equal('12347');

    baseAccount.incrementSequenceNumber();

    expect(baseAccount.sequenceNumber()).to.equal('12348');
    expect(mux1.sequenceNumber()).to.equal('12348');
    expect(mux2.sequenceNumber()).to.equal('12348');
  });
});
