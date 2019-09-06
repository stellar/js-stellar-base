// Type definitions for js-xdr v1.1.1
// Project: https://github.com/stellar/js-xdr
// Definitions by: Adolfo Builes <https://github.com/abuiles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.4.1


declare module "js-xdr" {  // `IOMixin`.

export class IOMixin {
  static toXDR(val: Buffer): Buffer
  /**
  * **REMEMBER TO REPLACE** static method `fromXDR` to return the appropriate class.
  */
  static fromXDR(input: Buffer, format?: 'raw'): IOMixin
  static fromXDR(input: string, format: 'hex' | 'base64'): IOMixin
  toXDR(format?: 'raw'): Buffer
  toXDR(format: 'hex' | 'base64'): string
}
}

declare module "js-xdr" {  // Primitives Void, Hyper, Int, Float, Double, Quadruple, Bool, String, Opaque, VarOpaque.
  import Long from "long";
  import { IOMixin } from "js-xdr";

  export class Void {
    static fromXDR(input: Buffer, format?: 'raw'): Void
    static fromXDR(input: string, format: 'hex' | 'base64'): Void
  }

  export class Hyper extends Long implements IOMixin {
    static MAX_VALUE: Hyper
    static MIN_VALUE: Hyper
    static toXDR(val: Buffer): Buffer
    static fromXDR(input: Buffer, format?: 'raw'): Hyper
    static fromXDR(input: string, format: 'hex' | 'base64'): Hyper
    static fromString( str: string, unsigned?: boolean | number, radix?: number ): Hyper;
    toXDR(format?: 'raw'): Buffer
    toXDR(format: 'hex' | 'base64'): string
    isValid(value: Buffer): boolean
  }
  export class UnsignedHyper extends Long implements IOMixin {
    static MAX_VALUE: Hyper
    static MIN_VALUE: Hyper
    static toXDR(val: Buffer): Buffer
    static fromXDR(input: Buffer, format?: 'raw'): UnsignedHyper
    static fromXDR(input: string, format: 'hex' | 'base64'): UnsignedHyper
    static fromString(str: string, unsigned?: boolean | number, radix?: number ): UnsignedHyper;
    toXDR(format?: 'raw'): Buffer
    toXDR(format: 'hex' | 'base64'): string
  }
  export class Int extends IOMixin {
    static MAX_VALUE: number
    static MIN_VALUE: number
    static fromXDR(input: Buffer, format?: 'raw'): Int
    static fromXDR(input: string, format: 'hex' | 'base64'): Int
  }
  export class UnsignedInt extends IOMixin {
    static MAX_VALUE: number
    static MIN_VALUE: number
    static fromXDR(input: Buffer, format?: 'raw'): Int
    static fromXDR(input: string, format: 'hex' | 'base64'): Int
  }
  export class Float extends IOMixin {
  }
  export class Double extends IOMixin {
  }
  export class Quadruple extends IOMixin {
  }

  export class Bool extends IOMixin {
  }

  export class String extends IOMixin {
    constructor(maxLength?: number);
  }

  export class Opaque extends Buffer implements IOMixin {
    constructor(length: number);
    static fromXDR(input: Buffer, format?: 'raw'): Opaque
    static fromXDR(input: string, format: 'hex' | 'base64'): Opaque
    toXDR(format?: 'raw'): Buffer
    toXDR(format: 'hex' | 'base64'): string
  }
  export class VarOpaque extends IOMixin {
    constructor(length?: number);
  }

}

declare module "js-xdr" {  // Array and VarArray.

  export class Array<T extends IOMixin> {
    constructor(childType: T, length: number);
    public _childType: T;
    public _length: number;
  }
  export class VarArray<T extends IOMixin> {
    static _childType: any;
    static _length: number;
  }

  export class ChildStruct extends Struct {
  }

  /**
   * Example definition:
   * ```ts
   * xdr.enum("AssetType", {
   *   assetTypeNative: 0,
   *   assetTypeCreditAlphanum4: 1,
   *   assetTypeCreditAlphanum12: 2,
   * });
   *
   * // becomes...
   * export type AssetType =
   *   | AssetType.assetTypeNative
   *   | AssetType.assetTypeCreditAlphanum4
   *   | AssetType.assetTypeCreditAlphanum12
   * export namespace AssetType {
   *   export type assetTypeNative = Enum<'assetTypeNative', 0>
   *   export type assetTypeCreditAlphanum4 = Enum<'assetTypeCreditAlphanum4', 1>
   *   export type assetTypeCreditAlphanum12 = Enum<'assetTypeCreditAlphanum12', 2>
   *   export const assetTypeNative: () => Enum<'assetTypeNative', 0>
   *   export const assetTypeCreditAlphanum4: () => Enum<'assetTypeCreditAlphanum4', 1>
   *   export const assetTypeCreditAlphanum12: () => Enum<'assetTypeCreditAlphanum12', 2>
   * }
   *
   * // But shortcut works fine if Enum is not used directly (excluding AssetType):
   * export enum AssetType {
   *   assetTypeNative = 0,
   *   assetTypeCreditAlphanum4 = 1,
   *   assetTypeCreditAlphanum12 = 2,
   * }
   * ```
   *
   */
  export class Enum<TName extends string, TValue extends number> extends IOMixin {
    public name: TName;
    public value: TValue;
  }

  /**
   * Example definition:
   * ```ts
   *     xdr.struct("DecoratedSignature", [
   *       ["hint", xdr.lookup("SignatureHint")],
   *       ["signature", xdr.lookup("Signature")],
   *     ]);
   * ```
   * Example matching types:
   * ```ts
   *     export class DecoratedSignature extends Struct<DecoratedSignature> {
   *       hint(): SignatureHint
   *       signature(): Signature
   *       ...
   *     }
   * ```
   */
  export class Struct<TThis extends object = object> extends IOMixin {
    constructor(attributes: Struct.Attributes<TThis>)
    public _attributes: Struct.Attributes<TThis>;
  }
  export namespace Struct {
    export type Attributes<TAttributes extends object = object> = {
      [key in Exclude<keyof TAttributes, keyof Struct>]: TAttributes[key] extends () => any ? ReturnType<TAttributes[key]> : never
    }
  }

  /**
   * **Problem**: It has static properties that are called either as constructors, or as functions.
   *
   * **Workaround**:Use `UnionWithFunctions` and `UnionWithConstructors`.
   *
   * TODO: merge into one class.
   * ```ts
   * // Many for direct call, e.g.
   * xdr.OperationBody.setOption(setOptionsOp)
   *
   * // Only 5 cases for constructor call:
   * new xdr.AccountId.publicKeyTypeEd25519(this._publicKey);
   * new xdr.PublicKey.publicKeyTypeEd25519(this._publicKey);
   * new xdr.SignerKey.signerKeyTypeEd25519(rawKey);
   * new xdr.SignerKey.signerKeyTypePreAuthTx(signer.preAuthTx);
   * new xdr.SignerKey.signerKeyTypeHashX(signer.sha256Hash);
   * ```
   */
  export type Union = never

  /**
   * #### Example definition for direct call:
   * ```ts
   * xdr.enum("AssetType", {
   *   assetTypeNative: 0,
   *   assetTypeCreditAlphanum4: 1,
   *   assetTypeCreditAlphanum12: 2,
   * });
   * xdr.union("AllowTrustOpAsset", {
   *   switchOn: xdr.lookup("AssetType"),
   *   switchName: "type",
   *   switches: [
   *     ["assetTypeCreditAlphanum4", "assetCode4"],
   *     ["assetTypeCreditAlphanum12", "assetCode12"],
   *   ],
   *   arms: {
   *     assetCode4: xdr.lookup("AssetCode4"),
   *     assetCode12: xdr.lookup("AssetCode12"),
   *   },
   * });
   * // becomes...
   * export enum AssetType {
   *   assetTypeNative = 0,
   *   assetTypeCreditAlphanum4 = 1,
   *   assetTypeCreditAlphanum12 = 2,
   * }
   * export class AllowTrustOpAsset<T extends AssetType = AssetType> extends Union<typeof AllowTrustOpAsset> {
   *   static assetTypeCreditAlphanum4(value: AssetCode4): AllowTrustOpAsset<AssetType.assetTypeCreditAlphanum4>
   *   static assetTypeCreditAlphanum12(value: AssetCode12): AllowTrustOpAsset<AssetType.assetTypeCreditAlphanum12>
   *   assetCode4(): T extends AssetType.assetTypeCreditAlphanum4 ? AssetCode4 : never
   *   assetCode12(): T extends AssetType.assetTypeCreditAlphanum12 ? AssetCode12 : never
   * }
   * ```
   *
   */
  export class UnionWithFunctions<T extends new (...args: any) => any> extends IOMixin {
    /**
     * @param {magic} switches Instance of a class on T static property.
     * @memberof Union
     */
    constructor(switches: InstanceType<Extract<T[keyof Omit<T, 'fromXDR' | 'toXDR'>], new (...args: any) => any>>)
    public switch(): any;
    public armType(): any;
    public value(): any;
    public arm(): any;
  }

  /**
   * #### Example matching type for constuctor call:
   * ```ts
   * xdr.enum("PublicKeyType", {
   *   publicKeyTypeEd25519: 0,
   * });
   * xdr.union("PublicKey", {
   *   switchOn: xdr.lookup("PublicKeyType"),
   *   switchName: "type",
   *   switches: [
   *     ["publicKeyTypeEd25519", "ed25519"],
   *   ],
   *   arms: {
   *     ed25519: xdr.lookup("Uint256"),
   *   },
   * });
   * // becomes...
   * export enum PublicKeyType {
   *   publicKeyTypeEd25519 = 0,
   * }
   * export class PublicKey<T extends PublicKeyType = PublicKeyType> extends Union<typeof PublicKey> {
   *   static publicKeyTypeEd25519: new (...args: ConstructorParameters<typeof PublicKeyTypeEd25519>) => PublicKey<PublicKeyType.publicKeyTypeEd25519>
   *   ed25519(): T extends PublicKeyType.PublicKeyTypeEd25519 ? Uint256 : never
   * }
   * ```
   */
  export class UnionWithConstructors<T extends new (...args: any) => any> extends IOMixin {
    /**
     * @param {magic} switches Instance of a class on T static property.
     * @memberof Union
     */
    constructor(switches: InstanceType<Extract<T[keyof Omit<T, 'fromXDR' | 'toXDR'>], new (...args: any) => any>>)
    public switch(): any;
    public armType(): any;
    public value(): any;
    public arm(): any;
  }



  export type Option<T extends IOMixin> = T | undefined
}

declare module "js-xdr" {  // `XDR.config`.

  interface UnionConfigurationInt {
    switchOn: Int,
    switchName: string,
    switches: [number, string | Void][],
    arms: Record<string, Reference>
  }
  interface UnionConfigurationEnum {
    switchOn: Reference,
    switchName: string,
    switches: [string, string | Void][],
    arms: Record<string, Reference>
    defaultArm?: IOMixin
  }

  class Reference {
    resolve(context: unknown): void
  }
  class TypeBuilder {
    constructor(destination: {})

    enum(name: string, members: Record<string, number>): void
    struct(name: string, members: [string, Reference | IOMixin][]): void
    union(name: string, cfg: UnionConfigurationInt | UnionConfigurationEnum): void
    typedef(name: string, cfg: Reference | IOMixin): void
    const(name: string, cfg: number): void

    void(): Void;
    bool(): Bool;
    int(): Int;
    hyper(): Hyper;
    uint(): UnsignedInt;
    uhyper(): UnsignedHyper;
    float(): Float;
    double(): Double;
    quadruple(): Quadruple;

    string(length: number): Reference
    opaque(length: number): Reference
    varOpaque(length?: number): Reference

    array(childType: IOMixin, length: number): Reference
    varArray(childType: IOMixin, maxLength: Reference | number): Reference

    option(childType: IOMixin): Reference

    lookup(name: string): Reference
  }

  export function config(fn: (builder: TypeBuilder) => void, types?: any): any;

}