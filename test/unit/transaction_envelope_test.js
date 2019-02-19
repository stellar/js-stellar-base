describe('TransactionEnvelope', function() {
  it('can successfully decode an envelope', function(done) {
    // from https://github.com/stellar/js-stellar-sdk/issues/73
    let xdr =
      'AAAAAPQQv+uPYrlCDnjgPyPRgIjB6T8Zb8ANmL8YGAXC2IAgAAAAZAAIteYAAAAHAAAAAAAAAAAAAAABAAAAAAAAAAMAAAAAAAAAAUVVUgAAAAAAUtYuFczBLlsXyEp3q8BbTBpEGINWahqkFbnTPd93YUUAAAAXSHboAAAAABEAACcQAAAAAAAAAKIAAAAAAAAAAcLYgCAAAABAo2tU6n0Bb7bbbpaXacVeaTVbxNMBtnrrXVk2QAOje2Flllk/ORlmQdFU/9c8z43eWh1RNMpI3PscY+yDCnJPBQ==';

    var txe = StellarBase.xdr.TransactionEnvelope.fromXDR(xdr, 'base64');
    expect(
      txe
        .tx()
        .sourceAccount()
        .value().length
    ).to.be.equal(32);
    done();
  });

  it('calculates correct hash with non-utf8 strings', function() {
    // a84d534b3742ad89413bdbf259e02fa4c5d039123769e9bcc63616f723a2bcd5
    let xdr =
      'AAAAAAtjwtJadppTmm0NtAU99BFxXXfzPO1N/SqR43Z8aXqXAAAAZAAIj6YAAAACAAAAAAAAAAEAAAAB0QAAAAAAAAEAAAAAAAAAAQAAAADLa6390PDAqg3qDLpshQxS+uVw3ytSgKRirQcInPWt1QAAAAAAAAAAA1Z+AAAAAAAAAAABfGl6lwAAAEBC655+8Izq54MIZrXTVF/E1ycHgQWpVcBD+LFkuOjjJd995u/7wM8sFqQqambL0/ME2FTOtxMO65B9i3eAIu4P';
    var tx = new StellarBase.Transaction(xdr);
    StellarBase.Network.usePublicNetwork();
    expect(tx.hash().toString('hex')).to.be.equal(
      'a84d534b3742ad89413bdbf259e02fa4c5d039123769e9bcc63616f723a2bcd5'
    );
  });
});
