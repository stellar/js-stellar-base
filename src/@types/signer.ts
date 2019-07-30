export namespace Signer {
  export interface Ed25519PublicKey {
    ed25519PublicKey: string;
    weight: number | undefined;
  }
  export interface Sha256Hash {
    sha256Hash: Buffer;
    weight: number | undefined;
  }
  export interface PreAuthTx {
    preAuthTx: Buffer;
    weight: number | undefined;
  }
}

export type Signer =
  | Signer.Ed25519PublicKey
  | Signer.Sha256Hash
  | Signer.PreAuthTx;

export namespace SignerOptions {
  export interface Ed25519PublicKey {
    ed25519PublicKey: string;
    weight?: number | string;
  }
  export interface Sha256Hash {
    sha256Hash: Buffer | string;
    weight?: number | string;
  }
  export interface PreAuthTx {
    preAuthTx: Buffer | string;
    weight?: number | string;
  }
}

export type SignerOptions =
  | SignerOptions.Ed25519PublicKey
  | SignerOptions.Sha256Hash
  | SignerOptions.PreAuthTx;
