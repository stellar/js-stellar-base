//  This module provides the signing functionality used by the stellar network
//  The code below may look a little strange... this is because we try to provide
//  the most efficient signing method possible.  First, we try to load the
//  native `sodium-native` package for node.js environments, and if that fails we
//  fallback to `tweetnacl`

// TS-TODO: Review this - it shows a warning below because we might be
// calling an undefined method
const actualMethods: {
  sign?(data: Buffer, secretKey: Buffer): Buffer;
  verify?(data: Buffer, signature: Buffer, publicKey: Buffer): boolean;
  generate?(secretKey: Buffer): Buffer
} = {};

/**
 * Use this flag to check if fast signing (provided by `sodium-native` package) is available.
 * If your app is signing a large number of transaction or verifying a large number
 * of signatures make sure `sodium-native` package is installed.
 */
export const FastSigning = checkFastSigning();

export function sign(data: Buffer, secretKey: Buffer): Buffer {
  return actualMethods.sign(data, secretKey);
}

export function verify(data: Buffer, signature: Buffer, publicKey: Buffer): boolean {
  return actualMethods.verify(data, signature, publicKey);
}

export function generate(secretKey: Buffer): Buffer {
  return actualMethods.generate(secretKey);
}

function checkFastSigning() {
  return typeof window === 'undefined'
    ? checkFastSigningNode()
    : checkFastSigningBrowser();
}

function checkFastSigningNode() {
  // NOTE: we use commonjs style require here because es6 imports
  // can only occur at the top level.  thanks, obama.
  let sodium;
  try {
    // eslint-disable-next-line
    sodium = require('sodium-native');
  } catch (err) {
    return checkFastSigningBrowser();
  }

  actualMethods.generate = (secretKey) => {
    const pk = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES);
    const sk = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES);
    sodium.crypto_sign_seed_keypair(pk, sk, secretKey);
    return pk;
  };

  actualMethods.sign = (data, secretKey) => {
    data = Buffer.from(data);
    const signature = Buffer.alloc(sodium.crypto_sign_BYTES);
    sodium.crypto_sign_detached(signature, data, secretKey);
    return signature;
  };

  actualMethods.verify = (data, signature, publicKey) => {
    data = Buffer.from(data);
    try {
      return sodium.crypto_sign_verify_detached(signature, data, publicKey);
    } catch (e) {
      return false;
    }
  };

  return true;
}

function checkFastSigningBrowser() {
  // fallback to `tweetnacl` if we're in the browser or
  // if there was a failure installing `sodium-native`
  // eslint-disable-next-line
  const nacl = require('tweetnacl');

  actualMethods.generate = (secretKey) => {
    const secretKeyUint8 = new Uint8Array(secretKey);
    const naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8);
    return Buffer.from(naclKeys.publicKey);
  };

  actualMethods.sign = (data, secretKey) => {
    let buffer = Buffer.from(data);
    let dataCopy = new Uint8Array(buffer.toJSON().data);
    let secretKeyCopy = new Uint8Array(secretKey.toJSON().data);

    const signature = nacl.sign.detached(dataCopy, secretKeyCopy);

    return Buffer.from(signature);
  };

  actualMethods.verify = (data, signature, publicKey) => {
    let buffer = Buffer.from(data);
    let dataCopy = new Uint8Array(buffer.toJSON().data);
    let signatureCopy = new Uint8Array(signature.toJSON().data);
    let publicKeyCopy = new Uint8Array(publicKey.toJSON().data);

    return nacl.sign.detached.verify(dataCopy, signatureCopy, publicKeyCopy);
  };

  return false;
}
