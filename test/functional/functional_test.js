let assert = require('assert');
let Promise = require('bluebird');
let axios = require('axios');
let _ = require('lodash');

describe('Functional test', function() {
  this.timeout(10e3);
  let baseUrl = 'https://horizon-testnet.stellar.org';
  let accounts = {};
  let keyPairs = {};
  //let url = 'http://localhost:8000';
  keyPairs['gateway'] = StellarBase.Keypair.fromRawSeed("gateway0000000000000000000000000");
  keyPairs['issuer'] = StellarBase.Keypair.fromRawSeed("issuer00000000000000000000000000");
  keyPairs['alice'] = StellarBase.Keypair.fromRawSeed("alice000000000000000000000000000");
  keyPairs['bob'] = StellarBase.Keypair.fromRawSeed("bob00000000000000000000000000000");

  function fetchAccount(publicKey) {
    return axios.get(baseUrl + '/accounts/' + publicKey)
      .then(function(response) {
        console.log("fetchAccount ", response.data.balances)
        return response.data;
      })
  }

  function fetchAccountsSequence() {

    return Promise.each(_.map(keyPairs, function(value, key) {
        return {
          name: key,
          keyPair: value
        }
      }), function(item) {
        var name = item['name'];
        var keyPair = item['keyPair'];
        var address = keyPair.address()
        console.log("address %s %s", name, address)
        return fetchAccount(address)
          .then(function(account) {
            accounts[name] = new StellarBase.Account(address, account.sequence);
          })
          .catch(function(err) {
            console.log("account does not exist")
            return axios.get(baseUrl + '/friendbot?addr=' + address)
              .then(function(response) {
                console.log("friendbot ", response.data)
                  //return response.data;
              })
          })
      })
      .then(function() {
        _.each(accounts, function(account, key) {
          //console.log("accounts %s %s", JSON.stringify(account, null, 4), key);
        });
      })
  }

  function sendPayment(accountSource, keyPair, option) {
    console.log('sendPayment');
    assert(accountSource);
    let input = new StellarBase.TransactionBuilder(accountSource)
      .addOperation(StellarBase.Operation.payment(option))
      .addSigner(keyPair)
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        console.log('sendPayment ', response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
      })
  }


  function setTrust(account, keyPair, options) {
    console.log("setTrust ", options)
    let opTrust = StellarBase.Operation.changeTrust(options);

    let input = new StellarBase.TransactionBuilder(account)
      .addSigner(keyPair)
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
  }

  before(function(done) {
    this.timeout(20e3);
    fetchAccountsSequence().then(done, done)
  })

  it("show addresses", function(done) {
    _.each(keyPairs, function(value, key) {
      console.log("address %s %s", value.address(), key);
    });
    done()
  });

  it.skip("create account", function(done) {
    var destination = accounts['bob'].address;
    var startingBalance = 1000;
    let createAccountOp = StellarBase.Operation.createAccount({
      destination: destination,
      startingBalance: startingBalance
    });

    let input = new StellarBase.TransactionBuilder(keyPairs['alice'])
      .addOperation(createAccountOp)
      .addSigner(keyPairs['alice'])
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



  it("gateway issue 1000 GBP to the bond issuer", function(done) {
    let option = {
      destination: keyPairs['issuer'].address(),
      currency: new StellarBase.Currency("GBP", accounts['gateway'].address),
      amount: 1000
    }
    sendPayment(accounts['gateway'], keyPairs['gateway'], option)
      .then(done, done)
  });

  it("alice sends native currency to bob", function(done) {
    let option = {
      destination: keyPairs['bob'].address(),
      currency: StellarBase.Currency.native(),
      amount: 5 * 10e6
    }
    sendPayment(accounts['alice'], keyPairs['alice'], option)
      .then(done, done)
  });

  it("set trust all", function(done) {
    let option = {
      currency: new StellarBase.Currency("GBP", accounts['gateway'].address),
      limit: "1000000"
    }

    var names = ['issuer', 'alice', 'bob'];
    Promise.each(names, function(name) {
        return setTrust(accounts[name], keyPairs[name], option)
      })
      .then(function() {})
      .then(done, done);
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
