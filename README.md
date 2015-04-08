# JS Stellar Base

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
var signer = StellarBase.Keypair.fromSeed("s3tUdZbCmLoMdrZ6nhqztatMFaiD85P54oVj93g1NeSBwWQpTnE");

// Create a keypair from a stellar address
var verifier = StellarBase.Keypair.fromAddress("gsTe6bDX54bPwtUAm2TER4shBF8nQNVtEvB8fmRkRoWvq3Y8XmY")

// Produce a stellar compliant "decorated signature" that is compliant with stellar transactions
var sig = signer.signDecorated("Hello world!") 

console.log(sig.hint()) // displays the 4 byte buffer of the signatures public key "hint"
console.log(sig.signature()) // displays the 32 byte buffer of the signature

```

This library also provides an impementation of base58 and base58check encoding, with support for the stellar alphabet:

```javascript
var StellarBase = require("stellar-base");

var encoded = StellarBase.encodeBase58([0,0,0]); //  => "ggg"
StellarBase.decodeBase58(encoded) // => Buffer([0,0,0])

// we can also use check encoding

StellarBase.encodeBase58Check("account_id", [0,0,0]) // => "gggghbdQd2"
StellarBase.encodeBase58Check("seed", [0,0,0]) // => "aX9UTew55Eh"

// To prevent interpretation mistakes, you must pass the expected version byte
// when decoding a check-encoded value

encoded = StellarBase.encodeBase58Check("account_id", [0,0,0])
StellarBase.decodeBase58Check("account_id", encoded) // => Buffer([0,0,0])
StellarBase.decodeBase58Check("seed", encoded) # => throws Error: invalid version byte.  expected 0, got 33

```

## Contributing

Please [see CONTRIBUTING.md for details](CONTRIBUTING.md).
