import { Operation as BaseOperation } from './operation';

export namespace xdr {
  export class XDRStruct {
    static fromXDR(xdr: Buffer): XDRStruct;

    toXDR(base?: string): Buffer;
    toXDR(encoding: string): string;
  }

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends XDRStruct {
    static fromXDR(xdr: Buffer): Operation;
  }

  export class Asset extends XDRStruct {
    static fromXDR(xdr: Buffer): Asset;
  }

  export class Memo extends XDRStruct {
    static fromXDR(xdr: Buffer): Memo;
  }

  export class TransactionEnvelope extends XDRStruct {
    static fromXDR(xdr: Buffer): TransactionEnvelope;
  }

  export class DecoratedSignature extends XDRStruct {
    static fromXDR(xdr: Buffer): DecoratedSignature;

    constructor(keys: { hint: SignatureHint; signature: Signature });

    hint(): SignatureHint;
    signature(): Buffer;
  }

  export type SignatureHint = Buffer;
  export type Signature = Buffer;

  export class TransactionResult extends XDRStruct {
    static fromXDR(xdr: Buffer): TransactionResult;
  }
}
