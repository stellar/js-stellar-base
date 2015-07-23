let assert = require('assert');
let Promise = require('bluebird');
let axios = require('axios');

describe('Functional test', function() {
  this.timeout(10e3);
  let baseUrl = 'https://horizon-testnet.stellar.org';
  //let url = 'http://localhost:8000';
  //let kpGateway = StellarBase.Keypair.fromRawSeed("gatewaybestcowinthestable");

  let gateway = {
    public: "gLf9Js8MYGUKAPJLKoDhUcSg8BcHtrnu2KSZkGMvsnQwhMTTVJ"
  };

  let accountAlice;
  let keysAlice = {
    public: "gsQx3Uofqu2SMHCwzvpeDPjENJF8d9N9GXmnsAQqD6nhMwypbXG",
    seed: "sfjGjkUHxr5wffg4NPkdFK3fJyT9PjXyu1gAMwHiKdgdXsb3sZ1"
  };

  let keysBob = {
    public: 'gs3uhS4n248kCAVJrAw2eirZt88pnEXUq2sB9AcD3fDMJAwSKbN'
  };

  function fetchAccount(publicKey) {
    return axios.get(baseUrl + '/accounts/' + publicKey)
      .then(function(response) {
        //console.log("fetchAccount ", response.data)
        return response.data;
      })
  }
  before(function(done) {
    fetchAccount(keysAlice.public)
      .then(function(account) {
        accountAlice = new StellarBase.Account(keysAlice.public, account.sequence);
      })
      .then(done, done)
  })

  it("create account", function(done) {
    var destination = keysBob.public;
    var startingBalance = 1000;
    let createAccountOp = StellarBase.Operation.createAccount({
      destination: destination,
      startingBalance: startingBalance
    });

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
      .addOperation(createAccountOp)
      .addSigner(keyPairAlice)
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        console.log(response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
      })
      .then(done, done);
  });

  it("alice sends native currency to bob", function(done) {
    let destination = keysBob.public
    let currency = StellarBase.Currency.native();
    let amount = "5";

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
      .addOperation(StellarBase.Operation.payment({
        destination, currency, amount
      }))
      .addSigner(keyPairAlice)
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        //console.log(response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
      })
      .then(done, done)
  });

  it("set trust", function(done) {
    let trustor = gateway.public;
    let currencyCode = "USD";
    let authorize = true;

    let opTrust = StellarBase.Operation.allowTrust({
      trustor: trustor,
      currencyCode: currencyCode,
      authorize: authorize
    });

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
      .addSigner(keyPairAlice)
      .addOperation(opTrust)
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        //console.log(response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
      })
      .then(done, done)
  });

  it("alice sends an invalid transaction", function(done) {
    let input = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .catch(function(error) {
        //console.log(response.data);
        assert(error);
        //assert.equal(response.data.result, 'received');
      })
      .then(done, done)

  });
});
