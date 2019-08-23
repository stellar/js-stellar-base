// Type definitions for js-xdr v1.1.1
// Project: https://github.com/stellar/js-xdr
// Definitions by: Adolfo Builes <https://github.com/abuiles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.4.1
declare module "js-xdr" {
    import Long from "long";

    // interface IOMixin {
    //     toXDR(format?: 'raw'): Buffer
    //     toXDR(format: 'hex' | 'base64'): string
    // }
    // interface IOMixinBuilder<TInstance extends IOMixin> {
    //     new (): TInstance;
    //     toXDR(val: Buffer): Buffer
    //     fromXDR(input: Buffer, format: 'raw'): TInstance
    //     fromXDR(input: string, format?: 'hex' | 'base64'): TInstance
    // }
    export class IOMixin {
        /**
         * **REMEMBER TO REPLACE** static method `toXDR` to return the appropriate class.
         */
        static toXDR(val: Buffer): IOMixin
        /**
         * **REMEMBER TO REPLACE** static method `fromXDR` to return the appropriate class.
         */
        static fromXDR(input: Buffer, format: 'raw'): IOMixin
        static fromXDR(input: string, format?: 'hex' | 'base64'): IOMixin
    }

    export class Bool extends IOMixin {
    }
    export class UnsignedInt extends IOMixin {
    }
    export class Float extends IOMixin {
    }
    export class Double extends IOMixin {
    }
    export class Quadruple extends IOMixin {
    }
    export class Int extends IOMixin {
    }

    export class Array {
        public _childType: any;
        public _length: number;
    }

    export class ChildStruct extends Struct {
    }

    export class Enum {
        public name: string;
        public value: number;
        public fromName(string: string): Enum;
    }

    export class Hyper extends Long {
    }

    export class Opaque extends IOMixin {
        new (length: number): Opaque;
    }

    export class Struct {
        public _attributes: object;
    }

    export class String {
    }

    export class Union {
        public switch(): any;
        public armType(): any;
        public value(): any;
        public arm(): any;
    }

    export class UnsignedHyper extends Long {
    }

    export class VarArray {
        public _childType: any;
        public _length: number;
    }

    export class VarOpaque {
        constructor(length?: number);
    }

    export class Option {
        public _childType: any;
    }

    export class Void {
    }

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