/**
 * Type declarations for @stellar/js-xdr
 * This file provides type definitions for the @stellar/js-xdr library
 * during the JS to TS migration process.
 */

declare module "@stellar/js-xdr" {
  export abstract class LargeInt {
    constructor(values: Array<number | bigint | string>);
    static defineIntBoundaries(): void;
    static MIN_VALUE: LargeInt;
    static MAX_VALUE: LargeInt;
    static isValid(value: unknown): boolean;
    static fromString(value: string): LargeInt;
    abstract get unsigned(): boolean;
    abstract get size(): number;
    toBigInt(): bigint;
    toString(): string;
  }

  export class Hyper extends LargeInt {
    constructor(values: Array<number | bigint | string>);
    static defineIntBoundaries(): void;
    static MIN_VALUE: Hyper;
    static MAX_VALUE: Hyper;
    static isValid(value: unknown): boolean;
    static fromString(value: string): Hyper;
  }

  export class UnsignedHyper extends LargeInt {
    constructor(values: Array<number | bigint | string>);
    static defineIntBoundaries(): void;
    static MIN_VALUE: UnsignedHyper;
    static MAX_VALUE: UnsignedHyper;
    static isValid(value: unknown): boolean;
    static fromString(value: string): UnsignedHyper;
  }
}
