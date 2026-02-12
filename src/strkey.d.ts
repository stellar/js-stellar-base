export class StrKey {
  static encodeEd25519PublicKey(data: Buffer): string;
  static decodeEd25519PublicKey(address: string): Buffer;
  static isValidEd25519PublicKey(key: string): boolean;

  static encodeEd25519SecretSeed(data: Buffer): string;
  static decodeEd25519SecretSeed(address: string): Buffer;
  static isValidEd25519SecretSeed(seed: string): boolean;

  static encodeMed25519PublicKey(data: Buffer): string;
  static decodeMed25519PublicKey(address: string): Buffer;
  static isValidMed25519PublicKey(publicKey: string): boolean;

  static encodeSignedPayload(data: Buffer): string;
  static decodeSignedPayload(address: string): Buffer;
  static isValidSignedPayload(address: string): boolean;

  static encodePreAuthTx(data: Buffer): string;
  static decodePreAuthTx(address: string): Buffer;

  static encodeSha256Hash(data: Buffer): string;
  static decodeSha256Hash(address: string): Buffer;

  static encodeContract(data: Buffer): string;
  static decodeContract(address: string): Buffer;
  static isValidContract(address: string): boolean;

  static encodeClaimableBalance(data: Buffer): string;
  static decodeClaimableBalance(address: string): Buffer;
  static isValidClaimableBalance(address: string): boolean;

  static encodeLiquidityPool(data: Buffer): string;
  static decodeLiquidityPool(address: string): Buffer;
  static isValidLiquidityPool(address: string): boolean;
}

export function decodeCheck(versionByteName: string, encoded: string): Buffer;
export function encodeCheck(versionByteName: string, data: Buffer): string;
