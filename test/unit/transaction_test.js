import { UnsignedHyper } from 'js-xdr';
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

  describe('toEnvelope', function() {
    beforeEach(function() {
      let source = new StellarBase.Account(
        'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
        '0'
      );
      let destination =
        'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      let asset = StellarBase.Asset.native();
      let amount = '2000.0000000';

      this.transaction = new StellarBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({ destination, asset, amount })
        )
        .addMemo(StellarBase.Memo.text('Happy birthday!'))
        .setTimeout(StellarBase.TimeoutInfinite)
        .build();
    });

    it('does not return a reference to source signatures', function() {
      const transaction = this.transaction;
      const envelope = transaction.toEnvelope().value();
      envelope.signatures().push({});

      expect(transaction.signatures.length).to.equal(0);
    });
    it('does not return a reference to the source transaction', function() {
      const transaction = this.transaction;
      const envelope = transaction.toEnvelope().value();
      envelope.tx().fee(StellarBase.xdr.Int64.fromString('300'));

      expect(transaction.tx.fee().toString()).to.equal('100');
    });
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

    expect(() => {
      new StellarBase.Transaction(input, { garbage: 'yes' });
    }).to.throw(/expected a string/);

    expect(() => {
      new StellarBase.Transaction(input, 1234);
    }).to.throw(/expected a string/);
  });

  it('throws when a Network is not passed', () => {
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

    expect(() => {
      new StellarBase.Transaction(input);
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

  describe('TransactionEnvelope with MuxedAccount', function() {
    it('handles muxed accounts', function() {
      let baseFee = '100';
      const networkPassphrase = 'Standalone Network ; February 2017';
      const source = StellarBase.Keypair.master(networkPassphrase);
      const account = new StellarBase.Account(source.publicKey(), '7');
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = StellarBase.Asset.native();
      let tx = new StellarBase.TransactionBuilder(account, {
        fee: baseFee,
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
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

      // force the source to be muxed in the envelope
      const muxedSource = new StellarBase.MuxedAccount(account, '0');
      const envelope = tx.toEnvelope();
      envelope
        .v1()
        .tx()
        .sourceAccount(muxedSource.toXDRObject());

      // force the payment destination to be muxed in the envelope
      const destinationMuxed = new StellarBase.MuxedAccount(
        new StellarBase.Account(destination, '1'),
        '0'
      );
      envelope
        .v1()
        .tx()
        .operations()[0]
        .body()
        .value()
        .destination(destinationMuxed.toXDRObject());

      // muxed properties should decode
      const muxedTx = new StellarBase.Transaction(envelope, networkPassphrase);
      expect(tx.source).to.equal(source.publicKey());
      expect(muxedTx.source).to.be.equal(muxedSource.accountId());
      expect(muxedTx.operations[0].destination).to.be.equal(
        destinationMuxed.accountId()
      );
    });
  });

  describe('knows how to calculate claimable balance IDs', function() {
    const address = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

    const makeBuilder = function(source) {
      return new StellarBase.TransactionBuilder(source, {
        fee: StellarBase.BASE_FEE,
        networkPassphrase: StellarBase.Networks.TESTNET,
        withMuxing: true
      }).setTimeout(StellarBase.TimeoutInfinite);
    };

    const makeClaimableBalance = function() {
      return StellarBase.Operation.createClaimableBalance({
        asset: StellarBase.Asset.native(),
        amount: '100',
        claimants: [
          new StellarBase.Claimant(
            address,
            StellarBase.Claimant.predicateUnconditional()
          )
        ]
      });
    };

    const paymentOp = StellarBase.Operation.payment({
      destination: address,
      asset: StellarBase.Asset.native(),
      amount: '100'
    });

    it('calculates from transaction src', function() {
      let gSource = new StellarBase.Account(address, '1234');

      let tx = makeBuilder(gSource)
        .addOperation(makeClaimableBalance())
        .build();
      const balanceId = tx.getClaimableBalanceId(0);
      expect(balanceId).to.be.equal(
        '00000000536af35c666a28d26775008321655e9eda2039154270484e3f81d72c66d5c26f'
      );
    });

    it('calculates from muxed transaction src as if unmuxed', function() {
      let gSource = new StellarBase.Account(address, '1234');
      let mSource = new StellarBase.MuxedAccount(gSource, '5678');
      let tx = makeBuilder(mSource)
        .addOperation(makeClaimableBalance())
        .build();

      const balanceId = tx.getClaimableBalanceId(0);
      expect(balanceId).to.be.equal(
        '00000000536af35c666a28d26775008321655e9eda2039154270484e3f81d72c66d5c26f'
      );
    });

    it('throws on invalid operations', function() {
      let gSource = new StellarBase.Account(address, '1234');
      let tx = makeBuilder(gSource)
        .addOperation(paymentOp)
        .addOperation(makeClaimableBalance())
        .build();

      expect(() => tx.getClaimableBalanceId(0)).to.throw(
        /createClaimableBalance/
      );
      expect(() => tx.getClaimableBalanceId(1)).to.not.throw();
      expect(() => tx.getClaimableBalanceId(2)).to.throw(/index/);
      expect(() => tx.getClaimableBalanceId(-1)).to.throw(/index/);
    });
  });

  describe('preconditions', function() {
    const address = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

    const source = new StellarBase.Account(address, '1234');
    const makeBuilder = function() {
      return new StellarBase.TransactionBuilder(source, {
        fee: StellarBase.BASE_FEE,
        networkPassphrase: StellarBase.Networks.TESTNET,
        withMuxing: true
      });
    };

    describe('timebounds', function() {
      it('Date', function() {
        let now = new Date();
        let tx = makeBuilder()
          .setTimebounds(now, now)
          .build();
        expect(tx.timeBounds.minTime).to.eql(
          `${Math.floor(now.valueOf() / 1000)}`
        );
        expect(tx.timeBounds.maxTime).to.eql(
          `${Math.floor(now.valueOf() / 1000)}`
        );
      });

      it('number', function() {
        let tx = makeBuilder()
          .setTimebounds(5, 10)
          .build();
        expect(tx.timeBounds.minTime).to.eql('5');
        expect(tx.timeBounds.maxTime).to.eql('10');
      });
    });

    it('ledgerbounds', function() {
      let tx = makeBuilder()
        .setTimeout(5)
        .setLedgerbounds(5, 10)
        .build();

      expect(tx.ledgerBounds.minLedger).to.equal(5);
      expect(tx.ledgerBounds.maxLedger).to.equal(10);
    });

    it('minAccountSequence', function() {
      let tx = makeBuilder()
        .setTimeout(5)
        .setMinAccountSequence('5')
        .build();
      expect(tx.minAccountSequence).to.eql('5');
    });

    it('minAccountSequenceAge', function() {
      let tx = makeBuilder()
        .setTimeout(5)
        .setMinAccountSequenceAge(5)
        .build();

      expect(tx.minAccountSequenceAge.toString()).to.equal('5');
    });

    it('minAccountSequenceLedgerGap', function() {
      let tx = makeBuilder()
        .setTimeout(5)
        .setMinAccountSequenceLedgerGap(5)
        .build();
      expect(tx.minAccountSequenceLedgerGap).to.equal(5);
    });

    it('extraSigners', function() {
      let tx = makeBuilder()
        .setTimeout(5)
        .setExtraSigners([address])
        .build();
      expect(tx.extraSigners).to.have.lengthOf(1);
      expect(
        tx.extraSigners.map(StellarBase.SignerKey.encodeSignerKey)
      ).to.eql([address]);
    });
  });
});

function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');
  expect(leftHex).to.eql(rightHex);
}
