import randomBytes from 'randombytes';

describe('Transaction', function() {
  it('constructs Transaction object from a TransactionEnvelope', function(done) {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000.0000000';

    let input = new StellarBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .setTimeout(StellarBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new StellarBase.Transaction(
      input,
      StellarBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.accountId());
    expect(transaction.fee).to.be.equal('100');
    expect(transaction.memo.type).to.be.equal(StellarBase.MemoText);
    expect(transaction.memo.value.toString('ascii')).to.be.equal(
      'Happy birthday!'
    );
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal(destination);
    expect(operation.amount).to.be.equal(amount);

    done();
  });

  it('does not sign when no Network selected', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';
    let signer = StellarBase.Keypair.random();

    let tx = new StellarBase.TransactionBuilder(source, {
      fee: 100
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    expect(() => tx.sign(signer)).to.throw(/No network selected/);
  });

  it('throws when a garbage Network is selected', () => {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000.0000000';

    let input = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .setTimeout(StellarBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    expect(() => {
      new StellarBase.Transaction(input, { garbage: 'yes' });
    }).to.throw(/expected a string/);

    expect(() => {
      new StellarBase.Transaction(input, 1234);
    }).to.throw(/expected a string/);
  });

  it('throws when no fee is provided', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    expect(() =>
      new StellarBase.TransactionBuilder(source, {
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({ destination, asset, amount })
        )
        .setTimeout(StellarBase.TimeoutInfinite)
        .build()
    ).to.throw(/must specify fee/);
  });

  it('signs correctly', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';
    let signer = StellarBase.Keypair.master(StellarBase.Networks.TESTNET);

    let tx = new StellarBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    tx.sign(signer);

    let env = tx.toEnvelope().value();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });

  it('signs using hash preimage', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(64);
    let hash = StellarBase.hash(preimage);

    let tx = new StellarBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    tx.signHashX(preimage);

    let env = tx.toEnvelope().value();
    expectBuffersToBeEqual(env.signatures()[0].signature(), preimage);
    expectBuffersToBeEqual(
      env.signatures()[0].hint(),
      hash.slice(hash.length - 4)
    );
  });

  it('returns error when signing using hash preimage that is too long', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let preimage = randomBytes(2 * 64);

    let tx = new StellarBase.TransactionBuilder(source, {
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();

    expect(() => tx.signHashX(preimage)).to.throw(
      /preimage cannnot be longer than 64 bytes/
    );
  });

  it('adds signature correctly', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const signedSource = new StellarBase.Account(sourceKey, '20');
    const addedSignatureSource = new StellarBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = StellarBase.Asset.native();
    const amount = '2000';
    const signer = StellarBase.Keypair.master(StellarBase.Networks.TESTNET);

    const signedTx = new StellarBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const addedSignatureTx = new StellarBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      }
    )
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const signature = signer.sign(presignHash).toString('base64');

    addedSignatureTx.addSignature(signer.publicKey(), signature);

    const envelopeAddedSignature = addedSignatureTx.toEnvelope().value();

    expect(
      signer.verify(
        addedSignatureTx.hash(),
        envelopeAddedSignature.signatures()[0].signature()
      )
    ).to.equal(true);

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].signature(),
      envelopeAddedSignature.signatures()[0].signature()
    );

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].hint(),
      envelopeAddedSignature.signatures()[0].hint()
    );

    expectBuffersToBeEqual(addedSignatureTx.hash(), signedTx.hash());
  });

  it('adds signature generated by getKeypairSignature', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const signedSource = new StellarBase.Account(sourceKey, '20');
    const addedSignatureSource = new StellarBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = StellarBase.Asset.native();
    const amount = '2000';
    const signer = StellarBase.Keypair.master(StellarBase.Networks.TESTNET);

    const signedTx = new StellarBase.TransactionBuilder(signedSource, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    const presignHash = signedTx.hash();
    signedTx.sign(signer);

    const envelopeSigned = signedTx.toEnvelope().value();

    const signature = new StellarBase.Transaction(
      signedTx.toXDR(),
      StellarBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    expect(signer.sign(presignHash).toString('base64')).to.equal(signature);

    const addedSignatureTx = new StellarBase.TransactionBuilder(
      addedSignatureSource,
      {
        timebounds: {
          minTime: 0,
          maxTime: 1739392569
        },
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      }
    )
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .build();

    addedSignatureTx.addSignature(signer.publicKey(), signature);

    const envelopeAddedSignature = addedSignatureTx.toEnvelope().value();

    expect(
      signer.verify(
        addedSignatureTx.hash(),
        envelopeAddedSignature.signatures()[0].signature()
      )
    ).to.equal(true);

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].signature(),
      envelopeAddedSignature.signatures()[0].signature()
    );

    expectBuffersToBeEqual(
      envelopeSigned.signatures()[0].hint(),
      envelopeAddedSignature.signatures()[0].hint()
    );

    expectBuffersToBeEqual(addedSignatureTx.hash(), signedTx.hash());
  });

  it('does not add invalid signature', function() {
    const sourceKey =
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
    // make two sources so they have the same seq number
    const source = new StellarBase.Account(sourceKey, '20');
    const sourceCopy = new StellarBase.Account(sourceKey, '20');
    const destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    const asset = StellarBase.Asset.native();
    const originalAmount = '2000';
    const alteredAmount = '1000';
    const signer = StellarBase.Keypair.master(StellarBase.Networks.TESTNET);

    const originalTx = new StellarBase.TransactionBuilder(source, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({
          destination,
          asset,
          amount: originalAmount
        })
      )
      .build();

    const signature = new StellarBase.Transaction(
      originalTx.toXDR(),
      StellarBase.Networks.TESTNET
    ).getKeypairSignature(signer);

    const alteredTx = new StellarBase.TransactionBuilder(sourceCopy, {
      timebounds: {
        minTime: 0,
        maxTime: 1739392569
      },
      fee: 100,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({
          destination,
          asset,
          amount: alteredAmount
        })
      )
      .build();

    function addSignature() {
      alteredTx.addSignature(signer.publicKey(), signature);
    }
    expect(addSignature).to.throw('Invalid signature');
  });

  it('accepts 0 as a valid transaction fee', function(done) {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let input = new StellarBase.TransactionBuilder(source, {
      fee: 0,
      networkPassphrase: StellarBase.Networks.TESTNET
    })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .setTimeout(StellarBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new StellarBase.Transaction(
      input,
      StellarBase.Networks.TESTNET
    );
    var operation = transaction.operations[0];

    expect(transaction.fee).to.be.equal('0');

    done();
  });

  it('outputs xdr as a string', () => {
    const xdrString =
      'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
    const transaction = new StellarBase.Transaction(
      xdrString,
      StellarBase.Networks.TESTNET
    );
    expect(typeof transaction).to.be.equal('object');
    expect(typeof transaction.toXDR).to.be.equal('function');
    expect(transaction.toXDR()).to.be.equal(xdrString);
  });

  describe('FeeBumpTransaction', function() {
    it('handles fee bump transactions', function(done) {
      let baseFee = '100';
      const networkPassphrase = 'Standalone Network ; February 2017';
      const innerSource = StellarBase.Keypair.master(networkPassphrase);
      const innerAccount = new StellarBase.Account(
        innerSource.publicKey(),
        '7'
      );
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = StellarBase.Asset.native();

      let innerTx = new StellarBase.TransactionBuilder(innerAccount, {
        fee: '100',
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        },
        v1: true
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination,
            asset,
            amount
          })
        )
        .addMemo(StellarBase.Memo.text('Happy birthday!'))
        .build();
      innerTx.sign(innerSource);

      let feeSource = StellarBase.Keypair.fromSecret(
        'SB7ZMPZB3YMMK5CUWENXVLZWBK4KYX4YU5JBXQNZSK2DP2Q7V3LVTO5V'
      );
      let transaction = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '100',
        innerTx,
        networkPassphrase
      );
      transaction.sign(feeSource);

      expect(transaction.isFeeBump()).to.equal(true);

      expect(transaction.source).to.be.equal(innerSource.publicKey());
      expect(transaction.feeSource).to.be.equal(feeSource.publicKey());

      // shows new fee
      expect(transaction.fee).to.be.equal('200');

      // can read inner fee
      expect(transaction.innerFee).to.be.equal('100');

      // show innerTx operations and memo
      let operation = transaction.operations[0];
      expect(transaction.memo.type).to.be.equal(StellarBase.MemoText);
      expect(transaction.memo.value.toString('ascii')).to.be.equal(
        'Happy birthday!'
      );
      expect(operation.type).to.be.equal('payment');
      expect(operation.destination).to.be.equal(destination);
      expect(operation.amount).to.be.equal(amount);

      const expectedXDR =
        'AAAABQAAAADgSJG2GOUMy/H9lHyjYZOwyuyytH8y0wWaoc596L+bEgAAAAAAAADIAAAAAgAAAABzdv3ojkzWHMD7KUoXhrPx0GH18vHKV0ZfqpMiEblG1gAAAGQAAAAAAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA9IYXBweSBiaXJ0aGRheSEAAAAAAQAAAAAAAAABAAAAAOBIkbYY5QzL8f2UfKNhk7DK7LK0fzLTBZqhzn3ov5sSAAAAAAAAAASoF8gAAAAAAAAAAAERuUbWAAAAQK933Dnt1pxXlsf1B5CYn81PLxeYsx+MiV9EGbMdUfEcdDWUySyIkdzJefjpR5ejdXVp/KXosGmNUQ+DrIBlzg0AAAAAAAAAAei/mxIAAABAijIIQpL6KlFefiL4FP8UWQktWEz4wFgGNSaXe7mZdVMuiREntehi1b7MRqZ1h+W+Y0y+Z2HtMunsilT2yS5mAA==';

      expect(
        transaction
          .toEnvelope()
          .toXDR()
          .toString('base64')
      ).to.be.equal(expectedXDR);
      let expectedTxEnvelope = StellarBase.xdr.TransactionEnvelope.fromXDR(
        expectedXDR,
        'base64'
      ).value();

      expect(transaction.source).to.equal(
        StellarBase.StrKey.encodeEd25519PublicKey(
          expectedTxEnvelope
            .tx()
            .innerTx()
            .value()
            .tx()
            .sourceAccount()
            .ed25519()
        )
      );
      expect(transaction.feeSource).to.equal(
        StellarBase.StrKey.encodeEd25519PublicKey(
          expectedTxEnvelope
            .tx()
            .feeSource()
            .ed25519()
        )
      );

      expect(transaction.innerFee).to.equal(
        expectedTxEnvelope
          .tx()
          .innerTx()
          .value()
          .tx()
          .fee()
          .toString()
      );
      expect(transaction.fee).to.equal(
        expectedTxEnvelope
          .tx()
          .fee()
          .toString()
      );

      expect(transaction.innerSignatures.length).to.equal(1);
      expect(
        transaction.innerSignatures[0].toXDR().toString('base64')
      ).to.equal(
        expectedTxEnvelope
          .tx()
          .innerTx()
          .value()
          .signatures()[0]
          .toXDR()
          .toString('base64')
      );

      expect(transaction.signatures.length).to.equal(1);
      expect(transaction.signatures[0].toXDR().toString('base64')).to.equal(
        expectedTxEnvelope
          .signatures()[0]
          .toXDR()
          .toString('base64')
      );

      done();
    });
  });
});

function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');
  expect(leftHex).to.eql(rightHex);
}
