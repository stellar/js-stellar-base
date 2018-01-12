describe('Common', () => {
  it('Should send a transaction using sendTransaction()', async () => {
    const destination = StellarBase.Keypair.random();
    const signer = StellarBase.Keypair.fromSecret('SCZ5VCOS5UUDVCNFZO2IXJJR6WZQOSN56TC76UCVOSWH67UTLLOSWWIN');
    const transaction = await StellarBase.Common.sendTransaction({
      secret: signer.secret(),
      destination: destination.publicKey(),
      amount: '20',
      asset: StellarBase.Asset.native(),
      memo: 'Testing common',
      testnet: true,
    });
    const env = transaction.toEnvelope();

    const rawSig = env.signatures()[0].signature();
    const verified = signer.verify(transaction.hash(), rawSig);
    expect(verified).to.equal(true);
  });

  after(() => StellarBase.Network.use(null));
})