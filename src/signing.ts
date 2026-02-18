import { ed25519 } from "@noble/curves/ed25519";

export function generate(secretKey: Buffer | string): Buffer {
  return Buffer.from(ed25519.getPublicKey(secretKey));
}

export function sign(data: Buffer, rawSecret: Buffer | string): Buffer {
  return Buffer.from(ed25519.sign(Buffer.from(data), rawSecret));
}

export function verify(
  data: Buffer,
  signature: Buffer,
  rawPublicKey: Buffer,
): boolean {
  return ed25519.verify(
    Buffer.from(signature),
    Buffer.from(data),
    Buffer.from(rawPublicKey),
    {
      zip215: false,
    },
  );
}
