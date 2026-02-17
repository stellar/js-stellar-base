/* eslint-disable import-x/extensions */
/**
 * Temporary type declaration file for src/index.js
 * This will be removed once src/index.js is migrated to TypeScript
 */

import xdr from "./xdr";

// Re-export xdr and cereal
export { xdr };
export { cereal } from "./jsxdr";

// From ./numbers
export { ScInt } from "./numbers/index";
export { XdrLargeInt } from "./numbers/index";
export { scValToBigInt } from "./numbers/index";

// From ./scval
export function nativeToScVal(
  val: unknown,
  opts?: { type?: Record<string, unknown> | string[] | string },
): xdr.ScVal;

export function scValToNative(scv: xdr.ScVal): unknown;

// From ./address
export class Address {
  constructor(address: string);
  toScVal(): xdr.ScVal;
  toString(): string;
}

// From ./keypair
export class Keypair {
  static random(): Keypair;
  publicKey(): string;
}

// All other exports
export function hash(data: Buffer): Buffer;
export function sign(data: Buffer, keypair: Keypair): Buffer;
export function verify(
  data: Buffer,
  signature: Buffer,
  publicKey: string,
): boolean;

export function getLiquidityPoolId(
  liquidityPoolType: string,
  assets: unknown[],
): string;
export const LiquidityPoolFeeV18: number;

export { UnsignedHyper, Hyper } from "@stellar/js-xdr";

export class TransactionBase {}
export class Transaction extends TransactionBase {}
export class FeeBumpTransaction {}

export class TransactionBuilder {
  constructor(sourceAccount: unknown, opts: unknown);
}
export const TimeoutInfinite: number;
export const BASE_FEE: string;

export class Asset {}
export class LiquidityPoolAsset {}
export class LiquidityPoolId {}

export class Operation {}
export const AuthRequiredFlag: number;
export const AuthRevocableFlag: number;
export const AuthImmutableFlag: number;
export const AuthClawbackEnabledFlag: number;

export class MemoNone {}
export class MemoText {
  constructor(text: string);
}
export class MemoId {
  constructor(id: string);
}
export class MemoHash {
  constructor(hash: Buffer);
}
export class MemoReturnHash {
  constructor(hash: Buffer);
}

export class Account {}
export class MuxedAccount {}
export class Claimant {}

export const Networks: { PUBLIC_NETWORK_PASSPHRASE: string };

export class StrKey {}
export class SignerKey {}
export class Soroban {}

export function decodeAddressToMuxedAccount(address: string): unknown;
export function encodeMuxedAccountToAddress(
  accountId: string,
  muxId?: string,
): string;
export function extractBaseAddress(address: string): string;
export function encodeMuxedAccount(accountId: string, muxId?: string): string;

export class Contract {}

// Re-export everything from numbers
export * from "./numbers/index.js";

// Re-export everything from scval (nativeToScVal and scValToNative already declared)
export * from "./scval.js";

export * from "./events.js";
export * from "./sorobandata_builder.js";
export * from "./auth.js";
export * from "./invocation.js";

export default module.exports;
