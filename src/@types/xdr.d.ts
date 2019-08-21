// Type definitions for js-xdr v1.1.1
// Project: https://github.com/stellar/js-xdr
// Definitions by: Adolfo Builes <https://github.com/abuiles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.4.1
declare module "js-xdr" {
    import Long from "long";

    export class Array {
        public _childType: any;
        public _length: number;
    }

    export class ChildStruct extends Struct {
    }

    export function config(fn: any, types?: any): any;

    export class Enum {
        public name: string;
        public value: number;
        public fromName(string: string): Enum;
    }

    export class Hyper extends Long {
    }

    export class Opaque {
    }

    export class Struct {
        public _attributes: object;
        public toXDR(): Buffer;
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
    }

    export class Option {
        public _childType: any;
    }
}
