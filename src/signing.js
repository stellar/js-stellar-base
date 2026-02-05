import { ed25519 } from "@noble/curves/ed25519";

export function generate(secretKey) {
  return Buffer.from(ed25519.getPublicKey(secretKey));
}

export function sign(data, secretKey) {
  return Buffer.from(ed25519.sign(Buffer.from(data), secretKey));
}

export function verify(data, signature, publicKey) {
  return ed25519.verify(
    Buffer.from(signature),
    Buffer.from(data),
    Buffer.from(publicKey),
    {
      zip215: false
    }
  );
}
