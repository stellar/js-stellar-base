# JS Stellar Base

[![Build Status](https://travis-ci.org/stellar/js-stellar-base.svg)](https://travis-ci.org/stellar/js-stellar-base)
[![Code Climate](https://codeclimate.com/github/stellar/js-stellar-base/badges/gpa.svg)](https://codeclimate.com/github/stellar/js-stellar-base)

The stellar-base library is the lowest-level stellar helper library.  It consists of classes
to read, write, hash, and sign the xdr structures that are used in stellar-core.

## Installation

Using npm:

```shell
npm install --save stellar-base
```

## Usage

[Examples are here](examples)

In addition to the code generated from the XDR definition files (see [js-xdr](https://github.com/stellar/js-xdr) for example usage), this library also provides some stellar specific features.  Let's look at some of them:


```javascript
var StellarBase = require("stellar-base");

// Create a keypair from a stellar secret seed
var signer = StellarBase.Keypair.fromSeed("SDSIBVHCCWHK7MZSGWJRLYTAESAZ6O4OQU4QS4YJQAQ2EGJXRJW7PYD3");

// Create a keypair from a stellar address
var verifier = StellarBase.Keypair.fromAddress("GDADKSW7B4WZAKFZ7YHESAEZQ5JC7WYSLTUNRTBTAY3R3JRZWXMNKXPN")

// Produce a stellar compliant "decorated signature" that is compliant with stellar transactions
var sig = signer.signDecorated("Hello world!") 

console.log(sig.hint()) // displays the 4 byte buffer of the signatures public key "hint"
console.log(sig.signature()) // displays the 32 byte buffer of the signature

```

This library also provides an implementation of StrCheck encoding:

```javascript
var StellarBase = require("stellar-base");

StellarBase.encodeCheck("accountId", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]) // => "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF"
StellarBase.encodeCheck("seed", [0,0,0]) // => "SAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSU2"

// To prevent interpretation mistakes, you must pass the expected version byte
// when decoding a check-encoded value

var encoded = StellarBase.encodeCheck("accountId", [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
StellarBase.decodeCheck("accountId", encoded) // => Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
StellarBase.decodeCheck("seed", encoded) // => throws Error: invalid version byte.

```

## Contributing

Please [see CONTRIBUTING.md for details](CONTRIBUTING.md).
