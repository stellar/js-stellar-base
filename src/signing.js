//  This module provides the signing functionality used by the Stellar network

import * as nacl from 'tweetnacl';

export function generate(secretKey) {
  const secretKeyUint8 = new Uint8Array(secretKey);
  const naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8);
  return Buffer.from(naclKeys.publicKey);
}

export function sign(data, secretKey) {
  data = Buffer.from(data);
  data = new Uint8Array(data.toJSON().data);
  secretKey = new Uint8Array(secretKey.toJSON().data);

  const signature = nacl.sign.detached(data, secretKey);

  return Buffer.from(signature);
}

export function verify(data, signature, publicKey) {
  data = Buffer.from(data);
  data = new Uint8Array(data.toJSON().data);
  signature = new Uint8Array(signature.toJSON().data);
  publicKey = new Uint8Array(publicKey.toJSON().data);

  return nacl.sign.detached.verify(data, signature, publicKey);
}
