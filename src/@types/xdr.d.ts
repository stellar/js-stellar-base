declare module 'js-xdr' {
    export class Hyper {
        public static fromString(raw: string): Hyper
    }
    export class UnsignedHyper {
        public static fromString(raw: string): Hyper
    }
    export const config: (callback: any) => any
}
