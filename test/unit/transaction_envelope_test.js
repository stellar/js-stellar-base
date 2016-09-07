describe('TransactionEnvelope', function() {

  it("can successfully decode an envelope", function(done) {

    // from https://github.com/stellar/js-stellar-sdk/issues/73
    let xdr = "AAAAAPQQv+uPYrlCDnjgPyPRgIjB6T8Zb8ANmL8YGAXC2IAgAAAAZAAIteYAAAAHAAAAAAAAAAAAAAABAAAAAAAAAAMAAAAAAAAAAUVVUgAAAAAAUtYuFczBLlsXyEp3q8BbTBpEGINWahqkFbnTPd93YUUAAAAXSHboAAAAABEAACcQAAAAAAAAAKIAAAAAAAAAAcLYgCAAAABAo2tU6n0Bb7bbbpaXacVeaTVbxNMBtnrrXVk2QAOje2Flllk/ORlmQdFU/9c8z43eWh1RNMpI3PscY+yDCnJPBQ==";

    var txe = StellarBase.xdr.TransactionEnvelope.fromXDR(xdr, 'base64');
    expect(txe.tx().sourceAccount().value().length).to.be.equal(32)
    done();
  });

});
